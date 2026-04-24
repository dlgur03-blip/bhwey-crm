"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GuideSection {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  descriptions: {
    label: string;
    text: string;
  }[];
}

const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: "dashboard",
    title: "1. 대시보드",
    subtitle: "로그인 후 가장 먼저 보이는 화면입니다",
    image: "/guide/01-dashboard.png",
    descriptions: [
      {
        label: "사이드바 메뉴",
        text: "각 기능 페이지로 이동합니다. 대시보드, 고객관리, 파이프라인, 템플릿, 알림톡, 업무관리를 선택하세요.",
      },
      {
        label: "통합 검색",
        text: "고객명, 업무명으로 빠르게 검색할 수 있습니다.",
      },
      {
        label: "미연락 고객 카드",
        text: "1주일 이상 연락하지 않은 고객이 표시됩니다. '연락' 버튼으로 바로 전화하거나, '알림톡' 버튼으로 메시지를 보낼 수 있습니다.",
      },
    ],
  },
  {
    id: "dashboard-bottom",
    title: "2. 대시보드 하단",
    subtitle: "업무 현황, 최근 활동, 캘린더를 확인합니다",
    image: "/guide/02-dashboard-calendar.png",
    descriptions: [
      {
        label: "오늘의 업무",
        text: "오늘 처리해야 할 업무 목록입니다. 완료 체크, 우선순위, 마감일을 한눈에 확인할 수 있습니다.",
      },
      {
        label: "프로세스 현황 / 최근 활동",
        text: "각 사업별 진행 중인 고객 수와 최근 활동 기록을 보여줍니다.",
      },
      {
        label: "일정 캘린더",
        text: "월간 캘린더에서 일정을 확인합니다. 날짜를 클릭하면 해당 일의 상세 일정이 표시되고, '일정 추가' 버튼으로 새 일정을 등록합니다.",
      },
    ],
  },
  {
    id: "customers",
    title: "3. 고객관리",
    subtitle: "모든 고객 정보를 한곳에서 관리합니다",
    image: "/guide/03-customers.png",
    descriptions: [
      {
        label: "검색 및 필터",
        text: "고객명으로 검색하고, 등급(VIP/A/B/C), 사업 유형, 담당자별로 필터링할 수 있습니다.",
      },
      {
        label: "고객 추가 버튼",
        text: "'+ 고객 추가' 버튼으로 신규 고객을 등록합니다.",
      },
      {
        label: "고객 목록",
        text: "고객명을 클릭하면 상세 페이지로 이동합니다. 등급 뱃지, 진행률, 마지막 연락일을 확인하세요.",
      },
    ],
  },
  {
    id: "customer-detail",
    title: "4. 고객 상세",
    subtitle: "고객의 모든 정보와 이력을 확인합니다",
    image: "/guide/04-customer-detail.png",
    descriptions: [
      {
        label: "고객 기본 정보",
        text: "고객명, 직함, 회사, 등급, 연락처를 확인합니다. '수정' 버튼으로 정보를 변경할 수 있습니다.",
      },
      {
        label: "탭 메뉴",
        text: "진행현황, 일정, 활동기록, 메모 탭을 전환하여 다양한 정보를 확인합니다.",
      },
      {
        label: "상세 내용 영역",
        text: "선택한 탭에 따라 프로세스 진행 상태, 일정 목록, 활동 기록, 메모가 표시됩니다.",
      },
    ],
  },
  {
    id: "pipeline",
    title: "5. 파이프라인",
    subtitle: "칸반 보드로 고객 진행 단계를 관리합니다",
    image: "/guide/05-pipeline.png",
    descriptions: [
      {
        label: "사업 선택 / 뷰 전환",
        text: "사업 유형을 선택하고, 칸반 뷰와 리스트 뷰를 전환할 수 있습니다.",
      },
      {
        label: "필터",
        text: "등급, 담당자별로 필터링하여 원하는 고객만 볼 수 있습니다.",
      },
      {
        label: "칸반 보드",
        text: "각 단계(상담접수 → 서류준비 → 신청접수 → 서류심사 ...)에 고객 카드가 배치됩니다. 드래그하여 단계를 변경할 수 있습니다.",
      },
    ],
  },
  {
    id: "tasks",
    title: "6. 업무관리",
    subtitle: "팀의 업무를 체계적으로 관리합니다",
    image: "/guide/06-tasks.png",
    descriptions: [
      {
        label: "업무 통계",
        text: "전체, 대기, 진행중, 완료 업무 수를 한눈에 확인합니다.",
      },
      {
        label: "검색 및 필터",
        text: "업무 상태, 우선순위, 담당자별로 필터링합니다.",
      },
      {
        label: "업무 목록",
        text: "각 업무의 제목, 설명, 관련 고객, 마감일, 담당자가 표시됩니다. 긴급/보통 뱃지로 우선순위를 구분합니다.",
      },
    ],
  },
  {
    id: "alimtalk",
    title: "7. 알림톡",
    subtitle: "카카오 알림톡 템플릿 관리 및 발송",
    image: "/guide/07-alimtalk.png",
    descriptions: [
      {
        label: "발송 통계",
        text: "전체 발송, 수신 완료, 실패 건수를 확인합니다.",
      },
      {
        label: "탭 메뉴",
        text: "템플릿 관리, 수동 발송, 발송 이력 탭을 전환합니다.",
      },
      {
        label: "템플릿 목록",
        text: "등록된 알림톡 템플릿입니다. #{변수}로 고객별 맞춤 메시지를 보낼 수 있습니다. 수정/삭제가 가능합니다.",
      },
    ],
  },
];

export default function GuidePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const section = GUIDE_SECTIONS[currentIndex];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 헤더 */}
      <div>
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">사용 가이드</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          BH WEY 고객관리 프로그램의 주요 기능을 안내합니다
        </p>
      </div>

      {/* 목차 */}
      <div className="flex flex-wrap gap-2">
        {GUIDE_SECTIONS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setCurrentIndex(i)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              i === currentIndex
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-accent"
            )}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* 가이드 콘텐츠 */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {/* 섹션 타이틀 */}
        <div className="px-6 py-4 border-b border-border bg-slate-50/50">
          <h2 className="text-lg font-bold text-foreground">{section.title}</h2>
          <p className="text-sm text-muted-foreground">{section.subtitle}</p>
        </div>

        {/* 스크린샷 (빨간 박스 포함) */}
        <div className="p-4 sm:p-6">
          <div className="rounded-xl overflow-hidden border border-border shadow-sm">
            <Image
              src={section.image}
              alt={section.title}
              width={1280}
              height={900}
              className="w-full h-auto"
              priority
            />
          </div>

          {/* 설명 카드 */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {section.descriptions.map((desc, i) => (
              <div
                key={i}
                className="flex gap-3 p-3 rounded-xl border border-red-200 bg-red-50/50"
              >
                <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-red-500 text-white text-xs font-bold">
                  {i + 1}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {desc.label}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {desc.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 네비게이션 */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-slate-50/50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            이전
          </Button>
          <span className="text-xs text-muted-foreground">
            {currentIndex + 1} / {GUIDE_SECTIONS.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentIndex((i) =>
                Math.min(GUIDE_SECTIONS.length - 1, i + 1)
              )
            }
            disabled={currentIndex === GUIDE_SECTIONS.length - 1}
            className="gap-1.5"
          >
            다음
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 추가 안내 */}
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
        <h3 className="text-sm font-semibold text-blue-800">
          추가 도움이 필요하신가요?
        </h3>
        <p className="text-xs text-blue-600 mt-1 leading-relaxed">
          각 페이지 상단의 검색창을 활용하면 고객명이나 업무명으로 빠르게 검색할
          수 있습니다. 궁금한 점이 있으시면 관리자에게 문의해 주세요.
        </p>
      </div>
    </div>
  );
}
