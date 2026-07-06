export const PRODUCT_CARD_FRAGMENT = `
  fragment ProductCard on Product {
    id
    title
    handle
    description
    availableForSale
    vendor
    productType
    tags
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 20) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;

export const PRODUCT_DETAIL_FRAGMENT = `
  fragment ProductDetail on Product {
    ...ProductCard
    descriptionHtml
    seo {
      title
      description
    }
    metafields(
      identifiers: [
        { namespace: "custom", key: "care_instructions" }
        { namespace: "custom", key: "features" }
        { namespace: "custom", key: "video_url" }
        { namespace: "custom", key: "product_videos" }
        { namespace: "custom", key: "specifications" }
      ]
    ) {
      namespace
      key
      value
      type
    }
    media(first: 10) {
      edges {
        node {
          mediaContentType
          alt
          ... on Video {
            id
            sources {
              url
              mimeType
            }
            previewImage {
              url
              altText
            }
          }
          ... on ExternalVideo {
            id
            embedUrl
            host
            originUrl
            previewImage {
              url
              altText
            }
          }
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

export const SEARCH_PRODUCTS_QUERY = `
  ${PRODUCT_CARD_FRAGMENT}
  query SearchProducts($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
      edges {
        node {
          ...ProductCard
        }
      }
    }
  }
`;

export const GET_PRODUCTS_QUERY = `
  ${PRODUCT_CARD_FRAGMENT}
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          ...ProductCard
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE_QUERY = `
  ${PRODUCT_DETAIL_FRAGMENT}
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductDetail
    }
  }
`;

export const GET_COLLECTIONS_QUERY = `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

export const GET_COLLECTION_PRODUCTS_QUERY = `
  ${PRODUCT_CARD_FRAGMENT}
  query GetCollectionProducts($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image {
        url
        altText
        width
        height
      }
      products(first: $first) {
        edges {
          node {
            ...ProductCard
          }
        }
      }
    }
  }
`;
