export const CUSTOMER_USER_ERRORS = `
  field
  message
  code
`;

export const CUSTOMER_ADDRESS_FRAGMENT = `
  id
  firstName
  lastName
  address1
  address2
  city
  province
  country
  zip
  phone
`;

export const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        firstName
        lastName
        email
      }
      customerUserErrors {
        ${CUSTOMER_USER_ERRORS}
      }
    }
  }
`;

export const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        ${CUSTOMER_USER_ERRORS}
      }
    }
  }
`;

export const CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION = `
  mutation customerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      deletedCustomerAccessTokenId
      userErrors {
        field
        message
      }
    }
  }
`;

export const CUSTOMER_RECOVER_MUTATION = `
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        ${CUSTOMER_USER_ERRORS}
      }
    }
  }
`;

export const CUSTOMER_RESET_BY_URL_MUTATION = `
  mutation customerResetByUrl($resetUrl: URL!, $password: String!) {
    customerResetByUrl(resetUrl: $resetUrl, password: $password) {
      customer {
        id
        firstName
        lastName
        email
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        ${CUSTOMER_USER_ERRORS}
      }
    }
  }
`;

export const CUSTOMER_RESET_MUTATION = `
  mutation customerReset($id: ID!, $input: CustomerResetInput!) {
    customerReset(id: $id, input: $input) {
      customer {
        id
        firstName
        lastName
        email
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        ${CUSTOMER_USER_ERRORS}
      }
    }
  }
`;

export const CUSTOMER_UPDATE_MUTATION = `
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        id
        firstName
        lastName
        email
        phone
      }
      customerUserErrors {
        ${CUSTOMER_USER_ERRORS}
      }
    }
  }
`;

export const CUSTOMER_ADDRESS_CREATE_MUTATION = `
  mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
      customerAddress {
        ${CUSTOMER_ADDRESS_FRAGMENT}
      }
      customerUserErrors {
        ${CUSTOMER_USER_ERRORS}
      }
    }
  }
`;

export const CUSTOMER_ADDRESS_UPDATE_MUTATION = `
  mutation customerAddressUpdate(
    $customerAccessToken: String!
    $id: ID!
    $address: MailingAddressInput!
  ) {
    customerAddressUpdate(
      customerAccessToken: $customerAccessToken
      id: $id
      address: $address
    ) {
      customerAddress {
        ${CUSTOMER_ADDRESS_FRAGMENT}
      }
      customerUserErrors {
        ${CUSTOMER_USER_ERRORS}
      }
    }
  }
`;

export const CUSTOMER_ADDRESS_DELETE_MUTATION = `
  mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      deletedCustomerAddressId
      customerUserErrors {
        ${CUSTOMER_USER_ERRORS}
      }
    }
  }
`;

export const CUSTOMER_DEFAULT_ADDRESS_UPDATE_MUTATION = `
  mutation customerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
    customerDefaultAddressUpdate(
      customerAccessToken: $customerAccessToken
      addressId: $addressId
    ) {
      customer {
        id
        defaultAddress {
          ${CUSTOMER_ADDRESS_FRAGMENT}
        }
      }
      customerUserErrors {
        ${CUSTOMER_USER_ERRORS}
      }
    }
  }
`;

export const GET_CUSTOMER_QUERY = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      defaultAddress {
        ${CUSTOMER_ADDRESS_FRAGMENT}
      }
      addresses(first: 20) {
        edges {
          node {
            ${CUSTOMER_ADDRESS_FRAGMENT}
          }
        }
      }
    }
  }
`;

export const GET_CUSTOMER_ORDERS_QUERY = `
  query getCustomerOrders($customerAccessToken: String!, $first: Int!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 25) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    image {
                      url
                    }
                    product {
                      handle
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
