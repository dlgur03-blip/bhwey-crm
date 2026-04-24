import { NextResponse } from "next/server";
import { MOCK_ACTIVITIES } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get("customerId");

  let result = [...MOCK_ACTIVITIES];

  if (customerId) {
    result = result.filter((a) => a.customerId === customerId);
  }

  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json(result);
}
