import {
  clearCustomerToken,
  getCustomerToken,
  setCustomerToken,
} from "@/lib/auth/session";
import {
  CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
  CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION,
  CUSTOMER_ADDRESS_CREATE_MUTATION,
  CUSTOMER_ADDRESS_DELETE_MUTATION,
  CUSTOMER_ADDRESS_UPDATE_MUTATION,
  CUSTOMER_CREATE_MUTATION,
  CUSTOMER_DEFAULT_ADDRESS_UPDATE_MUTATION,
  CUSTOMER_RECOVER_MUTATION,
  CUSTOMER_RESET_BY_URL_MUTATION,
  CUSTOMER_RESET_MUTATION,
  CUSTOMER_UPDATE_MUTATION,
  GET_CUSTOMER_ORDERS_QUERY,
  GET_CUSTOMER_QUERY,
} from "./customer-queries";
import type {
  CustomerAddress,
  CustomerAddressInput,
  CustomerOrder,
  CustomerOrderLineItem,
  CustomerProfile,
  CustomerRegisterInput,
  CustomerUpdateInput,
  CustomerUserError,
} from "./customer-types";
import {
  isIndiaCountry,
  normalizeCountry,
  normalizeIndianProvince,
} from "@/lib/data/india-provinces";
import { mapAuthErrorMessage } from "@/lib/auth/messages";
import { parseMoney } from "./types";
import { CustomerApiError } from "./customer-errors";
import {
  getCustomerAuthProvider,
} from "@/lib/auth/session";
import * as customerAccount from "./customer-account";

export { CustomerApiError } from "./customer-errors";

interface ShopifyGraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

function getShopifyConfig() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;

  if (!domain || !token) {
    throw new CustomerApiError(
      "Shopify is not configured. Please check environment variables.",
    );
  }

  return { domain, token };
}

function formatUserErrors(errors: CustomerUserError[]): string {
  return errors.map((e) => e.message).join(", ");
}

async function customerShopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const config = getShopifyConfig();

  const response = await fetch(
    `https://${config.domain}/api/2025-01/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Shopify-Storefront-Private-Token": config.token,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new CustomerApiError(
      "We're having trouble connecting. Please check your internet and try again.",
    );
  }

  const json = (await response.json()) as ShopifyGraphQLResponse<T>;

  if (json.errors?.length) {
    throw new CustomerApiError(
      json.errors.map((e) => e.message).join(", "),
    );
  }

  if (!json.data) {
    throw new CustomerApiError("Shopify API returned no data");
  }

  return json.data;
}

function normalizeAddress(node: CustomerAddress): CustomerAddress {
  return {
    id: node.id,
    firstName: node.firstName,
    lastName: node.lastName,
    address1: node.address1,
    address2: node.address2,
    city: node.city,
    province: node.province,
    country: node.country,
    zip: node.zip,
    phone: node.phone,
  };
}

function normalizeCustomer(
  customer: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phone: string | null;
    defaultAddress: CustomerAddress | null;
    addresses: { edges: { node: CustomerAddress }[] };
  } | null,
): CustomerProfile | null {
  if (!customer) return null;

  return {
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phone: customer.phone,
    defaultAddress: customer.defaultAddress
      ? normalizeAddress(customer.defaultAddress)
      : null,
    addresses: customer.addresses.edges.map((edge) =>
      normalizeAddress(edge.node),
    ),
  };
}

function toMailingAddressInput(address: CustomerAddressInput) {
  const country = normalizeCountry(address.country);

  let province = address.province.trim();
  if (isIndiaCountry(country)) {
    const code = normalizeIndianProvince(province);
    if (!code) {
      throw new CustomerApiError(
        "Please select a valid state. For India, use the state dropdown.",
        "INVALID_PROVINCE",
      );
    }
    province = code;
  }

  return {
    firstName: address.firstName,
    lastName: address.lastName,
    address1: address.address1,
    address2: address.address2 || undefined,
    city: address.city,
    province,
    country,
    zip: address.zip,
    phone: address.phone || undefined,
  };
}

export async function registerCustomer(
  input: CustomerRegisterInput,
): Promise<CustomerProfile> {
  const data = await customerShopifyFetch<{
    customerCreate: {
      customer: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string;
      } | null;
      customerUserErrors: CustomerUserError[];
    };
  }>(CUSTOMER_CREATE_MUTATION, {
    input: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      password: input.password,
    },
  });

  const { customer, customerUserErrors } = data.customerCreate;

  if (customerUserErrors.length > 0) {
    throw new CustomerApiError(
      formatUserErrors(customerUserErrors),
      customerUserErrors[0]?.code ?? undefined,
    );
  }

  if (!customer) {
    throw new CustomerApiError("Failed to create customer account.");
  }

  const tokenData = await createAccessToken(input.email, input.password);
  await setCustomerToken(tokenData.accessToken, tokenData.expiresAt, "storefront");

  const profile = await getCurrentCustomer(tokenData.accessToken);
  if (!profile) {
    throw new CustomerApiError("Account created but failed to load profile.");
  }

  return profile;
}

async function createAccessToken(email: string, password: string) {
  const data = await customerShopifyFetch<{
    customerAccessTokenCreate: {
      customerAccessToken: {
        accessToken: string;
        expiresAt: string;
      } | null;
      customerUserErrors: CustomerUserError[];
    };
  }>(CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION, {
    input: { email, password },
  });

  const { customerAccessToken, customerUserErrors } =
    data.customerAccessTokenCreate;

  if (customerUserErrors.length > 0) {
    const message = formatUserErrors(customerUserErrors);
    const code = customerUserErrors[0]?.code ?? undefined;
    if (code === "UNIDENTIFIED_CUSTOMER") {
      throw new CustomerApiError(
        "We couldn't sign you in. Please check your email and password.",
        code,
      );
    }
    throw new CustomerApiError(mapAuthErrorMessage(message, code), code);
  }

  if (!customerAccessToken) {
    throw new CustomerApiError("Failed to create access token.");
  }

  return customerAccessToken;
}

export async function loginCustomer(
  email: string,
  password: string,
): Promise<CustomerProfile> {
  const tokenData = await createAccessToken(email, password);
  await setCustomerToken(tokenData.accessToken, tokenData.expiresAt, "storefront");

  const profile = await getCurrentCustomer(tokenData.accessToken);
  if (!profile) {
    await clearCustomerToken();
    throw new CustomerApiError("Login failed. Please try again.");
  }

  return profile;
}

export async function logoutCustomer(): Promise<void> {
  const token = await getCustomerToken();
  const provider = await getCustomerAuthProvider();

  if (token && provider === "storefront") {
    try {
      await customerShopifyFetch(CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION, {
        customerAccessToken: token,
      });
    } catch {
      // Token may already be expired; still clear local session.
    }
  }

  await clearCustomerToken();
}

export async function recoverPassword(email: string): Promise<void> {
  const data = await customerShopifyFetch<{
    customerRecover: {
      customerUserErrors: CustomerUserError[];
    };
  }>(CUSTOMER_RECOVER_MUTATION, { email });

  const { customerUserErrors } = data.customerRecover;

  if (customerUserErrors.length > 0) {
    throw new CustomerApiError(formatUserErrors(customerUserErrors));
  }
}

function applyResetResult(data: {
  customer: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  } | null;
  customerAccessToken: {
    accessToken: string;
    expiresAt: string;
  } | null;
  customerUserErrors: CustomerUserError[];
}): CustomerProfile {
  const { customer, customerAccessToken, customerUserErrors } = data;

  if (customerUserErrors.length > 0) {
    throw new CustomerApiError(
      formatUserErrors(customerUserErrors),
      customerUserErrors[0]?.code ?? undefined,
    );
  }

  if (!customer || !customerAccessToken) {
    throw new CustomerApiError(
      "Password reset failed. The link may have expired. Please request a new one.",
    );
  }

  return {
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phone: null,
    defaultAddress: null,
    addresses: [],
  };
}

export async function resetCustomerPasswordByUrl(
  resetUrl: string,
  password: string,
): Promise<CustomerProfile> {
  const data = await customerShopifyFetch<{
    customerResetByUrl: {
      customer: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string;
      } | null;
      customerAccessToken: {
        accessToken: string;
        expiresAt: string;
      } | null;
      customerUserErrors: CustomerUserError[];
    };
  }>(CUSTOMER_RESET_BY_URL_MUTATION, { resetUrl, password });

  const profile = applyResetResult(data.customerResetByUrl);
  await setCustomerToken(
    data.customerResetByUrl.customerAccessToken!.accessToken,
    data.customerResetByUrl.customerAccessToken!.expiresAt,
    "storefront",
  );

  return profile;
}

export async function resetCustomerPassword(
  customerId: string,
  resetToken: string,
  password: string,
): Promise<CustomerProfile> {
  const gid = customerId.startsWith("gid://")
    ? customerId
    : `gid://shopify/Customer/${customerId}`;

  const data = await customerShopifyFetch<{
    customerReset: {
      customer: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string;
      } | null;
      customerAccessToken: {
        accessToken: string;
        expiresAt: string;
      } | null;
      customerUserErrors: CustomerUserError[];
    };
  }>(CUSTOMER_RESET_MUTATION, {
    id: gid,
    input: { resetToken, password },
  });

  const profile = applyResetResult(data.customerReset);
  await setCustomerToken(
    data.customerReset.customerAccessToken!.accessToken,
    data.customerReset.customerAccessToken!.expiresAt,
    "storefront",
  );

  return profile;
}

export async function getCurrentCustomer(
  accessToken?: string,
): Promise<CustomerProfile | null> {
  const token = accessToken ?? (await getCustomerToken());
  if (!token) return null;

  const provider = await getCustomerAuthProvider();

  if (provider === "customer_account") {
    const profile = await customerAccount.getCustomerAccountProfile(token);
    if (!profile && !accessToken) {
      await clearCustomerToken();
    }
    return profile;
  }

  const data = await customerShopifyFetch<{
    customer: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      email: string;
      phone: string | null;
      defaultAddress: CustomerAddress | null;
      addresses: { edges: { node: CustomerAddress }[] };
    } | null;
  }>(GET_CUSTOMER_QUERY, { customerAccessToken: token });

  if (!data.customer) {
    if (!accessToken) {
      await clearCustomerToken();
    }
    return null;
  }

  return normalizeCustomer(data.customer);
}

export async function updateCustomerProfile(
  input: CustomerUpdateInput,
): Promise<CustomerProfile> {
  const token = await getCustomerToken();
  if (!token) {
    throw new CustomerApiError("Not authenticated");
  }

  if ((await getCustomerAuthProvider()) === "customer_account") {
    return customerAccount.updateCustomerAccountProfile(token, input);
  }

  const data = await customerShopifyFetch<{
    customerUpdate: {
      customer: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string;
        phone: string | null;
      } | null;
      customerUserErrors: CustomerUserError[];
    };
  }>(CUSTOMER_UPDATE_MUTATION, {
    customerAccessToken: token,
    customer: input,
  });

  const { customerUserErrors } = data.customerUpdate;

  if (customerUserErrors.length > 0) {
    throw new CustomerApiError(formatUserErrors(customerUserErrors));
  }

  const profile = await getCurrentCustomer(token);
  if (!profile) {
    throw new CustomerApiError("Failed to update profile.");
  }

  return profile;
}

export async function getCustomerOrders(
  first = 20,
): Promise<CustomerOrder[]> {
  const token = await getCustomerToken();
  if (!token) {
    throw new CustomerApiError("Not authenticated");
  }

  if ((await getCustomerAuthProvider()) === "customer_account") {
    return customerAccount.getCustomerAccountOrders(token, first);
  }

  const data = await customerShopifyFetch<{
    customer: {
      orders: {
        edges: {
          node: {
            id: string;
            orderNumber: number;
            processedAt: string;
            financialStatus: string;
            fulfillmentStatus: string;
            totalPrice: { amount: string; currencyCode: string };
            lineItems: {
              edges: {
                node: {
                  title: string;
                  quantity: number;
                  variant: {
                    image: { url: string } | null;
                    product: { id: string; handle: string } | null;
                  } | null;
                };
              }[];
            };
          };
        }[];
      };
    } | null;
  }>(GET_CUSTOMER_ORDERS_QUERY, {
    customerAccessToken: token,
    first,
  });

  if (!data.customer) {
    await clearCustomerToken();
    throw new CustomerApiError("Session expired. Please log in again.");
  }

  return data.customer.orders.edges.map((edge) => ({
    id: edge.node.id,
    orderNumber: edge.node.orderNumber,
    processedAt: edge.node.processedAt,
    financialStatus: edge.node.financialStatus,
    fulfillmentStatus: edge.node.fulfillmentStatus,
    totalPrice: parseMoney(edge.node.totalPrice),
    currencyCode: edge.node.totalPrice.currencyCode,
    lineItems: edge.node.lineItems.edges.map((lineEdge) => ({
      title: lineEdge.node.title,
      quantity: lineEdge.node.quantity,
      imageUrl: lineEdge.node.variant?.image?.url ?? null,
      productHandle: lineEdge.node.variant?.product?.handle ?? null,
      productId: lineEdge.node.variant?.product?.id ?? null,
    })),
  }));
}

export type CustomerProductReviewPurchaseStatus =
  | "eligible"
  | "not_purchased"
  | "payment_pending"
  | "not_fulfilled";

const INVALID_FINANCIAL_STATUSES = new Set(["VOIDED", "REFUNDED"]);
const PAID_FINANCIAL_STATUSES = new Set(["PAID", "PARTIALLY_PAID"]);
const FULFILLED_STATUSES = new Set(["FULFILLED", "PARTIALLY_FULFILLED"]);

function parseShopifyProductNumericId(productId: string): string {
  const match = productId.match(/\/Product\/(\d+)/);
  return match ? match[1] : productId;
}

function normalizeComparableText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function lineItemMatchesProduct(
  item: CustomerOrderLineItem,
  targetHandle: string,
  targetId: string | null,
  productTitle?: string,
): boolean {
  if (targetId && item.productId) {
    return parseShopifyProductNumericId(item.productId) === targetId;
  }

  if (item.productHandle) {
    return item.productHandle.toLowerCase() === targetHandle;
  }

  // A known product ID should never be matched against an unrelated line item by title.
  if (targetId) return false;

  if (productTitle && item.title) {
    const normalizedProduct = normalizeComparableText(productTitle);
    const normalizedLine = normalizeComparableText(item.title);

    if (
      normalizedLine === normalizedProduct ||
      normalizedLine.startsWith(`${normalizedProduct} -`) ||
      normalizedLine.startsWith(`${normalizedProduct} –`) ||
      normalizedLine.includes(normalizedProduct)
    ) {
      return true;
    }
  }

  return false;
}

export async function getCustomerProductReviewPurchaseStatus(
  productHandle: string,
  productId?: string,
  productTitle?: string,
): Promise<CustomerProductReviewPurchaseStatus> {
  const orders = await getCustomerOrders(50);
  const targetHandle = productHandle.toLowerCase();
  const targetId = productId ? parseShopifyProductNumericId(productId) : null;

  let hasMatchingOrder = false;
  let hasUnpaidOrder = false;
  let hasUnfulfilledPaidOrder = false;

  for (const order of orders) {
    const financialStatus = order.financialStatus.toUpperCase();
    const fulfillmentStatus = order.fulfillmentStatus.toUpperCase();

    if (INVALID_FINANCIAL_STATUSES.has(financialStatus)) {
      continue;
    }

    const hasProduct = order.lineItems.some((item) =>
      lineItemMatchesProduct(item, targetHandle, targetId, productTitle),
    );

    if (!hasProduct) {
      continue;
    }

    hasMatchingOrder = true;

    if (!PAID_FINANCIAL_STATUSES.has(financialStatus)) {
      hasUnpaidOrder = true;
      continue;
    }

    if (!FULFILLED_STATUSES.has(fulfillmentStatus)) {
      hasUnfulfilledPaidOrder = true;
      continue;
    }

    return "eligible";
  }

  if (!hasMatchingOrder) {
    return "not_purchased";
  }

  if (hasUnfulfilledPaidOrder) {
    return "not_fulfilled";
  }

  if (hasUnpaidOrder) {
    return "payment_pending";
  }

  return "not_purchased";
}

/** @deprecated Use getCustomerProductReviewPurchaseStatus instead */
export async function hasCustomerPurchasedProduct(
  productHandle: string,
  productId?: string,
  productTitle?: string,
): Promise<boolean> {
  const status = await getCustomerProductReviewPurchaseStatus(
    productHandle,
    productId,
    productTitle,
  );
  return status === "eligible";
}

export async function getCustomerAddresses(): Promise<CustomerAddress[]> {
  const profile = await getCurrentCustomer();
  return profile?.addresses ?? [];
}

export async function createCustomerAddress(
  address: CustomerAddressInput,
): Promise<CustomerAddress> {
  const token = await getCustomerToken();
  if (!token) {
    throw new CustomerApiError("Not authenticated");
  }

  if ((await getCustomerAuthProvider()) === "customer_account") {
    return customerAccount.createCustomerAccountAddress(token, address);
  }

  const data = await customerShopifyFetch<{
    customerAddressCreate: {
      customerAddress: CustomerAddress | null;
      customerUserErrors: CustomerUserError[];
    };
  }>(CUSTOMER_ADDRESS_CREATE_MUTATION, {
    customerAccessToken: token,
    address: toMailingAddressInput(address),
  });

  const { customerAddress, customerUserErrors } = data.customerAddressCreate;

  if (customerUserErrors.length > 0) {
    throw new CustomerApiError(formatUserErrors(customerUserErrors));
  }

  if (!customerAddress) {
    throw new CustomerApiError("Failed to create address.");
  }

  return normalizeAddress(customerAddress);
}

export async function updateCustomerAddress(
  id: string,
  address: CustomerAddressInput,
): Promise<CustomerAddress> {
  const token = await getCustomerToken();
  if (!token) {
    throw new CustomerApiError("Not authenticated");
  }

  if ((await getCustomerAuthProvider()) === "customer_account") {
    return customerAccount.updateCustomerAccountAddress(token, id, address);
  }

  const data = await customerShopifyFetch<{
    customerAddressUpdate: {
      customerAddress: CustomerAddress | null;
      customerUserErrors: CustomerUserError[];
    };
  }>(CUSTOMER_ADDRESS_UPDATE_MUTATION, {
    customerAccessToken: token,
    id,
    address: toMailingAddressInput(address),
  });

  const { customerAddress, customerUserErrors } = data.customerAddressUpdate;

  if (customerUserErrors.length > 0) {
    throw new CustomerApiError(formatUserErrors(customerUserErrors));
  }

  if (!customerAddress) {
    throw new CustomerApiError("Failed to update address.");
  }

  return normalizeAddress(customerAddress);
}

export async function deleteCustomerAddress(id: string): Promise<void> {
  const token = await getCustomerToken();
  if (!token) {
    throw new CustomerApiError("Not authenticated");
  }

  if ((await getCustomerAuthProvider()) === "customer_account") {
    await customerAccount.deleteCustomerAccountAddress(token, id);
    return;
  }

  const data = await customerShopifyFetch<{
    customerAddressDelete: {
      deletedCustomerAddressId: string | null;
      customerUserErrors: CustomerUserError[];
    };
  }>(CUSTOMER_ADDRESS_DELETE_MUTATION, {
    customerAccessToken: token,
    id,
  });

  const { customerUserErrors } = data.customerAddressDelete;

  if (customerUserErrors.length > 0) {
    throw new CustomerApiError(formatUserErrors(customerUserErrors));
  }
}

export async function setDefaultCustomerAddress(
  addressId: string,
): Promise<void> {
  const token = await getCustomerToken();
  if (!token) {
    throw new CustomerApiError("Not authenticated");
  }

  if ((await getCustomerAuthProvider()) === "customer_account") {
    await customerAccount.setDefaultCustomerAccountAddress(token, addressId);
    return;
  }

  const data = await customerShopifyFetch<{
    customerDefaultAddressUpdate: {
      customerUserErrors: CustomerUserError[];
    };
  }>(CUSTOMER_DEFAULT_ADDRESS_UPDATE_MUTATION, {
    customerAccessToken: token,
    addressId,
  });

  const { customerUserErrors } = data.customerDefaultAddressUpdate;

  if (customerUserErrors.length > 0) {
    throw new CustomerApiError(formatUserErrors(customerUserErrors));
  }
}
