import { NextResponse } from "next/server";
import { MOCK_TASKS } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const assignee = searchParams.get("assignee");
  const status = searchParams.get("status");

  let result = [...MOCK_TASKS];

  if (assignee && assignee !== "all") {
    result = result.filter((t) => t.assigneeId === assignee);
  }
  if (status && status !== "all") {
    result = result.filter((t) => t.status === status);
  }

  return NextResponse.json(result);
}
