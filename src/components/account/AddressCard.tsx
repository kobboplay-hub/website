import { Pencil, Trash2 } from "lucide-react";
import type { CustomerAddress } from "@/lib/shopify/customer-types";
import {
  getIndianProvinceName,
  isIndiaCountry,
} from "@/lib/data/india-provinces";

interface AddressCardProps {
  address: CustomerAddress;
  isDefault: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
  isDeleting?: boolean;
}

export default function AddressCard({
  address,
  isDefault,
  onEdit,
  onDelete,
  onSetDefault,
  isDeleting,
}: AddressCardProps) {
  const name = [address.firstName, address.lastName].filter(Boolean).join(" ");
  const provinceLabel = isIndiaCountry(address.country ?? "")
    ? getIndianProvinceName(address.province)
    : address.province;

  return (
    <div className="relative rounded-2xl bg-kobbo-white p-5 shadow-soft">
      {isDefault && (
        <span className="absolute right-4 top-4 rounded-full bg-kobbo-yellow/30 px-2.5 py-0.5 text-[10px] font-bold uppercase text-kobbo-black">
          Default
        </span>
      )}
      <p className="font-heading font-bold text-kobbo-black">
        {address.city || "Address"}
      </p>
      <p className="mt-2 text-sm font-semibold text-kobbo-black">{name}</p>
      <p className="mt-1 text-sm leading-relaxed text-kobbo-muted">
        {address.address1}
        {address.address2 && <>, {address.address2}</>}
        <br />
        {address.city}, {provinceLabel} {address.zip}
        <br />
        {address.country}
        {address.phone && (
          <>
            <br />
            {address.phone}
          </>
        )}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-full border border-kobbo-beige px-3 py-1.5 text-xs font-semibold text-kobbo-black transition-colors hover:border-kobbo-yellow"
        >
          <Pencil className="h-3 w-3" />
          Edit
        </button>
        {!isDefault && (
          <button
            type="button"
            onClick={onSetDefault}
            className="inline-flex items-center gap-1.5 rounded-full border border-kobbo-beige px-3 py-1.5 text-xs font-semibold text-kobbo-black transition-colors hover:border-kobbo-yellow"
          >
            Set Default
          </button>
        )}
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="inline-flex items-center gap-1.5 rounded-full border border-kobbo-beige px-3 py-1.5 text-xs font-semibold text-kobbo-muted transition-colors hover:border-red-200 hover:text-red-600 disabled:opacity-50"
        >
          <Trash2 className="h-3 w-3" />
          Delete
        </button>
      </div>
    </div>
  );
}
