export interface CustomerUserError {
  field: string[] | null;
  message: string;
  code?: string | null;
}

export interface CustomerAccessToken {
  accessToken: string;
  expiresAt: string;
}

export interface CustomerAddress {
  id: string;
  firstName: string | null;
  lastName: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  country: string | null;
  zip: string | null;
  phone: string | null;
}

export interface CustomerProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  defaultAddress: CustomerAddress | null;
  addresses: CustomerAddress[];
}

export interface CustomerOrderLineItem {
  title: string;
  quantity: number;
  imageUrl: string | null;
  productHandle: string | null;
  productId: string | null;
}

export interface CustomerOrder {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: number;
  currencyCode: string;
  lineItems: CustomerOrderLineItem[];
}

export interface CustomerRegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface CustomerUpdateInput {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface CustomerAddressInput {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone?: string;
}
