import { NextResponse } from "next/server";
import { MOCK_CUSTOMERS } from "@/lib/mock-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const customer = MOCK_CUSTOMERS.find((c) => c.id === id);

  if (!customer) {
    return NextResponse.json({ error: "고객을 찾을 수 없습니다" }, { status: 404 });
  }

  return NextResponse.json(customer);
}
