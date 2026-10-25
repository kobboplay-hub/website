import {
  isIndiaCountry,
  normalizeCountry,
  normalizeIndianProvince,
} from "@/lib/data/india-provinces";
import { CustomerApiError } from "@/lib/shopify/customer-errors";
import { shopifyFetch } from "@/lib/shopify";
import type {
  CustomerAddress,
  CustomerAddressInput,
  CustomerOrder,
  CustomerProfile,
  CustomerUpdateInput,
} from "@/lib/shopify/customer-types";

interface CustomerAccountApiConfig {
  graphql_api: string;
}

interface UserError {
  field?: string[] | null;
  message: string;
}

interface CustomerAccountAddress {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  zoneCode?: string | null;
  territoryCode?: string | null;
  zip?: string | null;
  phoneNumber?: string | null;
}

function getShopDomain(): string {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  if (!domain) {
    throw new CustomerApiError(
      "Shopify is not configured. Please check environment variables.",
    );
  }
  return domain;
}

function formatUserErrors(errors: UserError[]): string {
  return errors.map((error) => error.message).join(", ");
}

async function getGraphqlEndpoint(): Promise<string> {
  const response = await fetch(
    `https://${getShopDomain()}/.well-known/customer-account-api`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new CustomerApiError(
      "Failed to load Customer Account API configuration.",
    );
  }

  const config = (await response.json()) as CustomerAccountApiConfig;
  if (!config.graphql_api) {
    throw new CustomerApiError("Customer Account API endpoint is unavailable.");
  }

  return config.graphql_api;
}

async function customerAccountFetch<T>(
  accessToken: string,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const endpoint = await getGraphqlEndpoint();
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new CustomerApiError(
      "We're having trouble connecting. Please check your internet and try again.",
    );
  }

  const json = (await response.json()) as {
    data?: T;
    errors?: { message: string }[];
  };

  if (json.errors?.length) {
    throw new CustomerApiError(json.errors.map((error) => error.message).join(", "));
  }

  if (!json.data) {
    throw new CustomerApiError("Customer Account API returned no data.");
  }

  return json.data;
}

function normalizeCustomerAccountAddress(
  address: CustomerAccountAddress,
): CustomerAddress {
  return {
    id: address.id,
    firstName: address.firstName ?? null,
    lastName: address.lastName ?? null,
    address1: address.address1 ?? null,
    address2: address.address2 ?? null,
    city: address.city ?? null,
    province: address.zoneCode ?? null,
    country: address.territoryCode ?? null,
    zip: address.zip ?? null,
    phone: address.phoneNumber ?? null,
  };
}

function toCustomerAccountAddressInput(address: CustomerAddressInput) {
  const territoryCode = normalizeCountry(address.country);
  let zoneCode = address.province.trim();

  if (isIndiaCountry(territoryCode)) {
    const code = normalizeIndianProvince(zoneCode);
    if (!code) {
      throw new CustomerApiError(
        "Please select a valid state. For India, use the state dropdown.",
        "INVALID_PROVINCE",
      );
    }
    zoneCode = code;
  }

  return {
    firstName: address.firstName,
    lastName: address.lastName,
    address1: address.address1,
    address2: address.address2 || undefined,
    city: address.city,
    zoneCode,
    territoryCode,
    zip: address.zip,
    phoneNumber: address.phone || undefined,
  };
}

const CUSTOMER_PROFILE_QUERY = `
  query CustomerProfile {
    customer {
      id
      firstName
      lastName
      emailAddress {
        emailAddress
      }
      phoneNumber {
        phoneNumber
      }
      defaultAddress {
        id
        firstName
        lastName
        address1
        address2
        city
        zoneCode
        territoryCode
        zip
        phoneNumber
      }
      addresses(first: 20) {
        nodes {
          id
          firstName
          lastName
          address1
          address2
          city
          zoneCode
          territoryCode
          zip
          phoneNumber
        }
      }
    }
  }
`;

const CUSTOMER_ORDERS_QUERY = `
  query CustomerOrders($first: Int!) {
    customer {
      orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          id
          number
          processedAt
          financialStatus
          fulfillmentStatus
          totalPrice {
            amount
            currencyCode
          }
          lineItems(first: 20) {
            nodes {
              name
              title
              quantity
              productId
              image {
                url
              }
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_HANDLES_QUERY = `
  query CustomerOrderProductHandles($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        id
        handle
      }
    }
  }
`;

async function getProductHandles(productIds: string[]): Promise<Map<string, string>> {
  const handles = new Map<string, string>();
  const uniqueIds = [...new Set(productIds)];

  // Shopify limits GraphQL input arrays. Resolve public product handles in batches.
  for (let offset = 0; offset < uniqueIds.length; offset += 100) {
    const ids = uniqueIds.slice(offset, offset + 100);
    try {
      const data = await shopifyFetch<{
        nodes: ({ id: string; handle: string } | null)[];
      }>({
        query: PRODUCT_HANDLES_QUERY,
        variables: { ids },
        revalidate: 60,
      });

      for (const product of data.nodes) {
        if (product?.id && product.handle) {
          handles.set(product.id, product.handle);
        }
      }
    } catch (error) {
      // Keep order history available when product lookup is temporarily unavailable.
      console.error("Could not resolve order product handles", error);
    }
  }

  return handles;
}

export async function getCustomerAccountProfile(
  accessToken: string,
): Promise<CustomerProfile | null> {
  const data = await customerAccountFetch<{
    customer: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      emailAddress: { emailAddress: string } | null;
      phoneNumber: { phoneNumber: string | null } | null;
      defaultAddress: CustomerAccountAddress | null;
      addresses: { nodes: CustomerAccountAddress[] };
    } | null;
  }>(accessToken, CUSTOMER_PROFILE_QUERY);

  if (!data.customer) return null;

  const email = data.customer.emailAddress?.emailAddress;
  if (!email) return null;

  return {
    id: data.customer.id,
    firstName: data.customer.firstName,
    lastName: data.customer.lastName,
    email,
    phone: data.customer.phoneNumber?.phoneNumber ?? null,
    defaultAddress: data.customer.defaultAddress
      ? normalizeCustomerAccountAddress(data.customer.defaultAddress)
      : null,
    addresses: data.customer.addresses.nodes.map(normalizeCustomerAccountAddress),
  };
}

export async function getCustomerAccountOrders(
  accessToken: string,
  first = 20,
): Promise<CustomerOrder[]> {
  const data = await customerAccountFetch<{
    customer: {
      orders: {
        nodes: {
          id: string;
          number: number;
          processedAt: string;
          financialStatus: string;
          fulfillmentStatus: string;
          totalPrice: { amount: string; currencyCode: string };
          lineItems: {
            nodes: {
              name: string;
              title: string;
              quantity: number;
              productId: string | null;
              image: { url: string } | null;
            }[];
          };
        }[];
      };
    } | null;
  }>(accessToken, CUSTOMER_ORDERS_QUERY, { first });

  if (!data.customer) {
    throw new CustomerApiError("Session expired. Please log in again.");
  }

  const productIds = data.customer.orders.nodes.flatMap((order) =>
    order.lineItems.nodes.flatMap((item) => item.productId ? [item.productId] : []),
  );
  const productHandles = await getProductHandles(productIds);

  return data.customer.orders.nodes.map((order) => ({
    id: order.id,
    orderNumber: order.number,
    processedAt: order.processedAt,
    financialStatus: order.financialStatus,
    fulfillmentStatus: order.fulfillmentStatus,
    totalPrice: parseFloat(order.totalPrice.amount),
    currencyCode: order.totalPrice.currencyCode,
    lineItems: order.lineItems.nodes.map((item) => ({
      title: item.name || item.title,
      quantity: item.quantity,
      imageUrl: item.image?.url ?? null,
      productHandle: item.productId
        ? productHandles.get(item.productId) ?? null
        : null,
      productId: item.productId,
    })),
  }));
}

export async function updateCustomerAccountProfile(
  accessToken: string,
  input: CustomerUpdateInput,
): Promise<CustomerProfile> {
  const data = await customerAccountFetch<{
    customerUpdate: {
      customer: {
        id: string;
        firstName: string | null;
        lastName: string | null;
      } | null;
      userErrors: UserError[];
    };
  }>(
    accessToken,
    `
      mutation CustomerUpdate($input: CustomerUpdateInput!) {
        customerUpdate(input: $input) {
          userErrors {
            field
            message
          }
          customer {
            id
            firstName
            lastName
          }
        }
      }
    `,
    { input },
  );

  if (data.customerUpdate.userErrors.length > 0) {
    throw new CustomerApiError(formatUserErrors(data.customerUpdate.userErrors));
  }

  const profile = await getCustomerAccountProfile(accessToken);
  if (!profile) {
    throw new CustomerApiError("Failed to update profile.");
  }

  return profile;
}

export async function createCustomerAccountAddress(
  accessToken: string,
  address: CustomerAddressInput,
): Promise<CustomerAddress> {
  const data = await customerAccountFetch<{
    customerAddressCreate: {
      customerAddress: CustomerAccountAddress | null;
      userErrors: UserError[];
    };
  }>(
    accessToken,
    `
      mutation CustomerAddressCreate($address: CustomerAddressInput!) {
        customerAddressCreate(address: $address) {
          userErrors {
            field
            message
          }
          customerAddress {
            id
            firstName
            lastName
            address1
            address2
            city
            zoneCode
            territoryCode
            zip
            phoneNumber
          }
        }
      }
    `,
    { address: toCustomerAccountAddressInput(address) },
  );

  if (data.customerAddressCreate.userErrors.length > 0) {
    throw new CustomerApiError(
      formatUserErrors(data.customerAddressCreate.userErrors),
    );
  }

  if (!data.customerAddressCreate.customerAddress) {
    throw new CustomerApiError("Failed to create address.");
  }

  return normalizeCustomerAccountAddress(data.customerAddressCreate.customerAddress);
}

export async function updateCustomerAccountAddress(
  accessToken: string,
  id: string,
  address: CustomerAddressInput,
): Promise<CustomerAddress> {
  const data = await customerAccountFetch<{
    customerAddressUpdate: {
      customerAddress: CustomerAccountAddress | null;
      userErrors: UserError[];
    };
  }>(
    accessToken,
    `
      mutation CustomerAddressUpdate($id: ID!, $address: CustomerAddressInput!) {
        customerAddressUpdate(addressId: $id, address: $address) {
          userErrors {
            field
            message
          }
          customerAddress {
            id
            firstName
            lastName
            address1
            address2
            city
            zoneCode
            territoryCode
            zip
            phoneNumber
          }
        }
      }
    `,
    { id, address: toCustomerAccountAddressInput(address) },
  );

  if (data.customerAddressUpdate.userErrors.length > 0) {
    throw new CustomerApiError(
      formatUserErrors(data.customerAddressUpdate.userErrors),
    );
  }

  if (!data.customerAddressUpdate.customerAddress) {
    throw new CustomerApiError("Failed to update address.");
  }

  return normalizeCustomerAccountAddress(data.customerAddressUpdate.customerAddress);
}

export async function deleteCustomerAccountAddress(
  accessToken: string,
  id: string,
): Promise<void> {
  const data = await customerAccountFetch<{
    customerAddressDelete: {
      deletedAddressId: string | null;
      userErrors: UserError[];
    };
  }>(
    accessToken,
    `
      mutation CustomerAddressDelete($id: ID!) {
        customerAddressDelete(addressId: $id) {
          userErrors {
            field
            message
          }
          deletedAddressId
        }
      }
    `,
    { id },
  );

  if (data.customerAddressDelete.userErrors.length > 0) {
    throw new CustomerApiError(
      formatUserErrors(data.customerAddressDelete.userErrors),
    );
  }
}

export async function setDefaultCustomerAccountAddress(
  accessToken: string,
  addressId: string,
): Promise<void> {
  const data = await customerAccountFetch<{
    customerDefaultAddressUpdate: {
      userErrors: UserError[];
    };
  }>(
    accessToken,
    `
      mutation CustomerDefaultAddressUpdate($addressId: ID!) {
        customerDefaultAddressUpdate(addressId: $addressId) {
          userErrors {
            field
            message
          }
        }
      }
    `,
    { addressId },
  );

  if (data.customerDefaultAddressUpdate.userErrors.length > 0) {
    throw new CustomerApiError(
      formatUserErrors(data.customerDefaultAddressUpdate.userErrors),
    );
  }
}
