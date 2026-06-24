import { NextResponse } from "next/server";
import {
  createCustomerAddress,
  deleteCustomerAddress,
  getCustomerAddresses,
  setDefaultCustomerAddress,
  updateCustomerAddress,
} from "@/lib/shopify/customer";
import { apiErrorResponse } from "@/lib/auth/errors";

export async function GET() {
  try {
    const addresses = await getCustomerAddresses();
    return NextResponse.json({ addresses });
  } catch (error) {
    return apiErrorResponse(error, "Failed to fetch addresses");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "setDefault") {
      const { addressId } = body;
      if (!addressId) {
        return NextResponse.json(
          { error: "Address ID is required." },
          { status: 400 },
        );
      }
      await setDefaultCustomerAddress(addressId);
      const addresses = await getCustomerAddresses();
      return NextResponse.json({ addresses });
    }

    const address = await createCustomerAddress(body);
    return NextResponse.json({ address });
  } catch (error) {
    return apiErrorResponse(error, "Failed to save address");
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...address } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Address ID is required." },
        { status: 400 },
      );
    }

    const updated = await updateCustomerAddress(id, address);
    return NextResponse.json({ address: updated });
  } catch (error) {
    return apiErrorResponse(error, "Failed to update address");
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Address ID is required." },
        { status: 400 },
      );
    }

    await deleteCustomerAddress(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiErrorResponse(error, "Failed to delete address");
  }
}
