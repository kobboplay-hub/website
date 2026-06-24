"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import AccountLayoutShell from "@/components/account/AccountLayoutShell";
import AddressCard from "@/components/account/AddressCard";
import { useAuth } from "@/context/auth-context";
import type {
  CustomerAddress,
  CustomerAddressInput,
} from "@/lib/shopify/customer-types";
import {
  INDIA_PROVINCES,
  isIndiaCountry,
  normalizeIndianProvince,
} from "@/lib/data/india-provinces";

const emptyForm: CustomerAddressInput = {
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  city: "",
  province: "",
  country: "India",
  zip: "",
  phone: "",
};

export default function AddressesPageContent() {
  const { user, refreshUser } = useAuth();
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CustomerAddressInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const defaultAddressId = user?.defaultAddress?.id;

  const loadAddresses = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/customer/addresses");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to load addresses");
      }
      const data = await response.json();
      setAddresses(data.addresses ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load addresses",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const openCreateForm = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
    });
    setShowForm(true);
  };

  const openEditForm = (address: CustomerAddress) => {
    const country = address.country ?? "India";
    const province =
      isIndiaCountry(country) && address.province
        ? normalizeIndianProvince(address.province) ?? address.province
        : address.province ?? "";

    setEditingId(address.id);
    setForm({
      firstName: address.firstName ?? "",
      lastName: address.lastName ?? "",
      address1: address.address1 ?? "",
      address2: address.address2 ?? "",
      city: address.city ?? "",
      province,
      country,
      zip: address.zip ?? "",
      phone: address.phone ?? "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/customer/addresses", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to save address");
      }

      await loadAddresses();
      await refreshUser();
      closeForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save address",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError("");
    try {
      const response = await fetch(
        `/api/customer/addresses?id=${encodeURIComponent(id)}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to delete address");
      }
      await loadAddresses();
      await refreshUser();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete address",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    setError("");
    try {
      const response = await fetch("/api/customer/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setDefault", addressId }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to set default address");
      }
      await loadAddresses();
      await refreshUser();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to set default address",
      );
    }
  };

  const updateField = (field: keyof CustomerAddressInput, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "country" && !isIndiaCountry(value)) {
        next.province = "";
      }
      return next;
    });
  };

  const showIndiaProvinces = isIndiaCountry(form.country);

  return (
    <AccountLayoutShell title="Saved Addresses">
      <button
        type="button"
        onClick={openCreateForm}
        className="mb-6 inline-flex items-center gap-2 rounded-full bg-kobbo-yellow px-5 py-2.5 text-sm font-bold text-kobbo-black shadow-soft transition-all hover:bg-kobbo-yellow-light"
      >
        <Plus className="h-4 w-4" />
        Add New Address
      </button>

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {showForm && (
        <div className="mb-6 rounded-2xl bg-kobbo-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading font-bold text-kobbo-black">
              {editingId ? "Edit Address" : "New Address"}
            </h2>
            <button
              type="button"
              onClick={closeForm}
              aria-label="Close form"
              className="rounded-full p-1 hover:bg-kobbo-beige"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
            <input
              placeholder="First name"
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              required
              className="rounded-2xl border-2 border-kobbo-beige bg-kobbo-cream px-4 py-2.5 text-sm outline-none focus:border-kobbo-yellow"
            />
            <input
              placeholder="Last name"
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              required
              className="rounded-2xl border-2 border-kobbo-beige bg-kobbo-cream px-4 py-2.5 text-sm outline-none focus:border-kobbo-yellow"
            />
            <input
              placeholder="Address line 1"
              value={form.address1}
              onChange={(e) => updateField("address1", e.target.value)}
              required
              className="sm:col-span-2 rounded-2xl border-2 border-kobbo-beige bg-kobbo-cream px-4 py-2.5 text-sm outline-none focus:border-kobbo-yellow"
            />
            <input
              placeholder="Address line 2 (optional)"
              value={form.address2}
              onChange={(e) => updateField("address2", e.target.value)}
              className="sm:col-span-2 rounded-2xl border-2 border-kobbo-beige bg-kobbo-cream px-4 py-2.5 text-sm outline-none focus:border-kobbo-yellow"
            />
            <input
              placeholder="City"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              required
              className="rounded-2xl border-2 border-kobbo-beige bg-kobbo-cream px-4 py-2.5 text-sm outline-none focus:border-kobbo-yellow"
            />
            {showIndiaProvinces ? (
              <select
                value={form.province}
                onChange={(e) => updateField("province", e.target.value)}
                required
                className="rounded-2xl border-2 border-kobbo-beige bg-kobbo-cream px-4 py-2.5 text-sm outline-none focus:border-kobbo-yellow"
              >
                <option value="">Select state</option>
                {INDIA_PROVINCES.map((province) => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                placeholder="State / Province"
                value={form.province}
                onChange={(e) => updateField("province", e.target.value)}
                required
                className="rounded-2xl border-2 border-kobbo-beige bg-kobbo-cream px-4 py-2.5 text-sm outline-none focus:border-kobbo-yellow"
              />
            )}
            <select
              value={form.country}
              onChange={(e) => updateField("country", e.target.value)}
              required
              className="rounded-2xl border-2 border-kobbo-beige bg-kobbo-cream px-4 py-2.5 text-sm outline-none focus:border-kobbo-yellow"
            >
              <option value="India">India</option>
            </select>
            <input
              placeholder="ZIP / PIN code"
              value={form.zip}
              onChange={(e) => updateField("zip", e.target.value)}
              required
              className="rounded-2xl border-2 border-kobbo-beige bg-kobbo-cream px-4 py-2.5 text-sm outline-none focus:border-kobbo-yellow"
            />
            <input
              placeholder="Phone (optional)"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="sm:col-span-2 rounded-2xl border-2 border-kobbo-beige bg-kobbo-cream px-4 py-2.5 text-sm outline-none focus:border-kobbo-yellow"
            />
            <div className="sm:col-span-2 flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-kobbo-yellow px-5 py-2.5 text-sm font-bold text-kobbo-black disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingId ? "Save Changes" : "Save Address"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-full border-2 border-kobbo-beige px-5 py-2.5 text-sm font-semibold text-kobbo-black"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-kobbo-yellow" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-3xl bg-kobbo-white px-6 py-16 text-center shadow-soft">
          <p className="font-heading text-xl font-bold text-kobbo-black">
            No saved addresses
          </p>
          <p className="mt-2 text-sm text-kobbo-muted">
            Add an address for faster checkout.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              isDefault={address.id === defaultAddressId}
              onEdit={() => openEditForm(address)}
              onDelete={() => handleDelete(address.id)}
              onSetDefault={() => handleSetDefault(address.id)}
              isDeleting={deletingId === address.id}
            />
          ))}
        </div>
      )}
    </AccountLayoutShell>
  );
}
