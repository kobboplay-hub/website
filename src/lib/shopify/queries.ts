const AGE_GROUP_FIELDS = `
  id
  handle
  name: field(key: "name") {
    value
  }
`;

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
    ageGroup: metafield(namespace: "custom", key: "age_group") {
      reference {
        ... on Metaobject {
          ${AGE_GROUP_FIELDS}
        }
      }
    }
    merchandisingFlags: metafields(
      identifiers: [
        { namespace: "custom", key: "featured_product" }
        { namespace: "custom", key: "trending_toys" }
        { namespace: "custom", key: "best_selling_toys" }
      ]
    ) {
      key
      value
    }
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
        { namespace: "custom", key: "product_video" }
        { namespace: "custom", key: "product_videos" }
        { namespace: "custom", key: "specifications" }
        { namespace: "custom", key: "product_faqs" }
      ]
    ) {
      namespace
      key
      value
      type
      reference {
        ... on Video {
          id
          alt
          sources {
            url
            mimeType
          }
          previewImage {
            url
            altText
            width
            height
          }
        }
        ... on GenericFile {
          id
          url
          mimeType
        }
      }
      references(first: 10) {
        edges {
          node {
            ... on Video {
              id
              alt
              sources {
                url
                mimeType
              }
              previewImage {
                url
                altText
                width
                height
              }
            }
            ... on GenericFile {
              id
              url
              mimeType
            }
          }
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

export const PRODUCT_WITH_VIDEO_FRAGMENT = `
  fragment ProductWithVideo on Product {
    ...ProductCard
    metafields(
      identifiers: [
        { namespace: "custom", key: "video_url" }
        { namespace: "custom", key: "product_video" }
        { namespace: "custom", key: "product_videos" }
      ]
    ) {
      namespace
      key
      value
      type
      reference {
        ... on Video {
          id
          alt
          sources {
            url
            mimeType
          }
          previewImage {
            url
            altText
            width
            height
          }
        }
        ... on GenericFile {
          id
          url
          mimeType
        }
      }
      references(first: 10) {
        edges {
          node {
            ... on Video {
              id
              alt
              sources {
                url
                mimeType
              }
              previewImage {
                url
                altText
                width
                height
              }
            }
            ... on GenericFile {
              id
              url
              mimeType
            }
          }
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

export const GET_PRODUCTS_WITH_VIDEOS_QUERY = `
  ${PRODUCT_WITH_VIDEO_FRAGMENT}
  query GetProductsWithVideos($first: Int!) {
    products(first: $first) {
      edges {
        node {
          ...ProductWithVideo
        }
      }
    }
  }
`;

/** Homepage age-group products; merchandising and review metafields are intentionally omitted. */
export const GET_HOMEPAGE_AGE_PRODUCTS_QUERY = `
  query GetHomepageAgeProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          id
          handle
          title
          description
          availableForSale
          vendor
          productType
          tags
          ageGroup: metafield(namespace: "custom", key: "age_group") {
            reference {
              ... on Metaobject {
                id
                handle
                name: field(key: "name") { value }
              }
            }
          }
          featuredImage { url altText width height }
          images(first: 50) { edges { node { url altText width height } } }
          priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
          compareAtPriceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
          variants(first: 20) {
            edges { node {
              id title availableForSale
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
              selectedOptions { name value }
            } }
          }
        }
      }
    }
  }
`;

export const GET_RECENT_PRODUCTS_QUERY = `
  ${PRODUCT_CARD_FRAGMENT}
  query GetRecentProducts($first: Int!) {
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          ...ProductCard
        }
      }
    }
  }
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

export const SEARCH_PRODUCTS_PAGINATED_QUERY = `
  ${PRODUCT_CARD_FRAGMENT}
  query SearchProductsPaginated($query: String!, $first: Int!, $after: String, $sortKey: ProductSortKeys!, $reverse: Boolean!) {
    products(first: $first, after: $after, query: $query, sortKey: $sortKey, reverse: $reverse) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ...ProductCard
        }
      }
    }
  }
`;

export const PRODUCTS_SORTED_PAGINATED_QUERY = `
  ${PRODUCT_CARD_FRAGMENT}
  query ProductsSortedPaginated($first: Int!, $after: String, $sortKey: ProductSortKeys!, $reverse: Boolean!) {
    products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse) {
      pageInfo {
        hasNextPage
        endCursor
      }
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

export const GET_PRODUCTS_PAGINATED_QUERY = `
  ${PRODUCT_CARD_FRAGMENT}
  query GetProductsPaginated($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
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

export const GET_AGE_GROUPS_QUERY = `
  query GetAgeGroups($first: Int!) {
    metaobjects(type: "age_group", first: $first) {
      nodes {
        ${AGE_GROUP_FIELDS}
      }
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
