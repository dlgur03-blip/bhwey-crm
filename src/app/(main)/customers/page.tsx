"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  ArrowUpDown,
  Phone,
  Mail,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GradeBadge } from "@/components/common/grade-badge";
import { ContactDaysBadge } from "@/components/common/contact-days-badge";
import { ProgressBar } from "@/components/common/progress-bar";
import { MOCK_CUSTOMERS } from "@/lib/mock-data";
import { formatRelativeDate } from "@/lib/constants";
import type { CustomerGrade } from "@/types";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  const filtered = useMemo(() => {
    let result = [...MOCK_CUSTOMERS];

    // 검색
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }

    // 등급 필터
    if (gradeFilter !== "all") {
      result = result.filter((c) => c.grade === gradeFilter);
    }

    // 정렬
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "lastContact":
          return new Date(a.lastContactAt).getTime() - new Date(b.lastContactAt).getTime();
        case "created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [search, gradeFilter, sortBy]);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">고객 관리</h1>
          <p className="text-sm text-muted-foreground mt-1">
            전체 {MOCK_CUSTOMERS.length}명의 고객을 관리합니다
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          고객 등록
        </Button>
      </div>

      {/* 필터/검색 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="이름, 회사, 연락처 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={gradeFilter} onValueChange={(v) => setGradeFilter(v ?? "all")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="등급" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 등급</SelectItem>
            <SelectItem value="VIP">VIP</SelectItem>
            <SelectItem value="A">A등급</SelectItem>
            <SelectItem value="B">B등급</SelectItem>
            <SelectItem value="C">C등급</SelectItem>
            <SelectItem value="NEW">신규</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v ?? "name")}>
          <SelectTrigger className="w-[160px]">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">이름순</SelectItem>
            <SelectItem value="lastContact">마지막 연락순</SelectItem>
            <SelectItem value="created">등록일순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 테이블 */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">고객</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">회사</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden lg:table-cell">등급</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden lg:table-cell">담당자</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden xl:table-cell">프로세스</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">마지막 연락</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 w-[100px]">액션</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => {
                const process = customer.processes[0];
                return (
                  <tr
                    key={customer.id}
                    className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link href={`/customers/${customer.id}`} className="block">
                        <div className="font-medium text-sm text-foreground hover:text-primary">
                          {customer.name}
                        </div>
                        <div className="text-xs text-muted-foreground md:hidden">
                          {customer.company}
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="text-sm text-foreground">{customer.company}</div>
                      <div className="text-xs text-muted-foreground">{customer.position}</div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <GradeBadge grade={customer.grade} />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm text-foreground">{customer.assigneeName}</span>
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      {process && (
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">{process.templateName}</div>
                          <ProgressBar current={process.currentStageOrder} total={process.totalStages} />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-foreground">
                        {formatRelativeDate(customer.lastContactAt)}
                      </div>
                      <ContactDaysBadge lastContactAt={customer.lastContactAt} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 hover:bg-accent rounded-md transition-colors" title="전화">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-1.5 hover:bg-accent rounded-md transition-colors" title="이메일">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
            검색 결과가 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
