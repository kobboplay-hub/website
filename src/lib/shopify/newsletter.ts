import { CustomerApiError } from "./customer-errors";
import { getAdminAccessToken, getAdminShopDomain } from "./admin-auth";

const ADMIN_API_VERSION = "2024-10";
const NEWSLETTER_TAG = "newsletter";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface AdminCustomer {
  id: number;
  email: string;
  tags: string;
}

interface AdminCustomerSearchResponse {
  customers: AdminCustomer[];
}

interface AdminCustomerResponse {
  customer: AdminCustomer;
}

function marketingConsentPayload() {
  return {
    state: "subscribed",
    opt_in_level: "single_opt_in",
    consent_updated_at: new Date().toISOString(),
  };
}

function mergeNewsletterTag(existingTags: string): string {
  const tags = existingTags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  if (!tags.includes(NEWSLETTER_TAG)) {
    tags.push(NEWSLETTER_TAG);
  }

  return tags.join(", ");
}

async function adminFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const domain = getAdminShopDomain();
  const token = await getAdminAccessToken();

  const response = await fetch(
    `https://${domain}/admin/api/${ADMIN_API_VERSION}${path}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
        ...options.headers,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    let message = "Subscription failed. Please try again.";

    try {
      const body = (await response.json()) as {
        errors?: string | Record<string, string[]>;
      };

      if (typeof body.errors === "string") {
        message = body.errors;
      } else if (body.errors) {
        const firstError = Object.values(body.errors).flat()[0];
        if (firstError) message = firstError;
      }
    } catch {
      // Keep default message.
    }

    throw new CustomerApiError(message);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

async function findCustomerByEmail(email: string): Promise<AdminCustomer | null> {
  const data = await adminFetch<AdminCustomerSearchResponse>(
    `/customers/search.json?query=email:${encodeURIComponent(email)}`,
  );

  return (
    data.customers.find(
      (customer) => customer.email.toLowerCase() === email.toLowerCase(),
    ) ?? null
  );
}

async function createNewsletterCustomer(email: string): Promise<void> {
  try {
    await adminFetch<AdminCustomerResponse>("/customers.json", {
      method: "POST",
      body: JSON.stringify({
        customer: {
          email,
          tags: NEWSLETTER_TAG,
          email_marketing_consent: marketingConsentPayload(),
        },
      }),
    });
  } catch (error) {
    if (
      error instanceof CustomerApiError &&
      /already been taken|already exists/i.test(error.message)
    ) {
      const existingCustomer = await findCustomerByEmail(email);
      if (existingCustomer) {
        await updateNewsletterCustomer(existingCustomer);
        return;
      }
    }

    throw error;
  }
}

async function updateNewsletterCustomer(customer: AdminCustomer): Promise<void> {
  await adminFetch<AdminCustomerResponse>(`/customers/${customer.id}.json`, {
    method: "PUT",
    body: JSON.stringify({
      customer: {
        id: customer.id,
        tags: mergeNewsletterTag(customer.tags ?? ""),
        email_marketing_consent: marketingConsentPayload(),
      },
    }),
  });
}

export async function subscribeToNewsletter(
  email: string,
): Promise<{ message: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new CustomerApiError("Email is required.");
  }

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    throw new CustomerApiError("Please enter a valid email address.");
  }

  const existingCustomer = await findCustomerByEmail(normalizedEmail);

  if (existingCustomer) {
    await updateNewsletterCustomer(existingCustomer);
  } else {
    await createNewsletterCustomer(normalizedEmail);
  }

  return { message: "Thank you for subscribing!" };
}
