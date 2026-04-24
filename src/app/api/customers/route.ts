import { NextResponse } from "next/server";
import { MOCK_CUSTOMERS } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase();
  const grade = searchParams.get("grade");
  const assignee = searchParams.get("assignee");
  const sort = searchParams.get("sort") || "name";

  let result = [...MOCK_CUSTOMERS];

  if (search) {
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.company.toLowerCase().includes(search) ||
        c.phone.includes(search) ||
        c.email.toLowerCase().includes(search)
    );
  }

  if (grade && grade !== "all") {
    result = result.filter((c) => c.grade === grade);
  }

  if (assignee && assignee !== "all") {
    result = result.filter((c) => c.assigneeId === assignee);
  }

  result.sort((a, b) => {
    switch (sort) {
      case "lastContact":
        return new Date(a.lastContactAt).getTime() - new Date(b.lastContactAt).getTime();
      case "created":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return NextResponse.json(result);
}
