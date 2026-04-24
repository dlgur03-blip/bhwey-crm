import type {
  Customer,
  ProcessTemplate,
  Task,
  Activity,
  Note,
} from "@/types";

// ── 프로세스 템플릿 ──
export const MOCK_TEMPLATES: ProcessTemplate[] = [
  {
    id: "tpl-1",
    name: "정부지원사업",
    description: "중소기업 정부지원사업 진행 프로세스",
    color: "#2563EB",
    icon: "FileText",
    isDefault: true,
    stages: [
      { id: "s1-1", order: 1, name: "상담 접수", description: "초기 상담 및 사업 적격성 확인", checklist: ["사업 적격성 확인", "고객 요구사항 파악", "지원사업 매칭"] },
      { id: "s1-2", order: 2, name: "서류 준비", description: "신청 서류 수집 및 작성", checklist: ["사업자등록증", "재무제표", "사업계획서", "기술설명서"] },
      { id: "s1-3", order: 3, name: "신청·접수", description: "온라인 신청 및 서류 제출", checklist: ["온라인 신청 완료", "서류 제출", "접수 확인"] },
      { id: "s1-4", order: 4, name: "서류 심사", description: "접수 후 서류 심사 진행", checklist: ["보완 요청 대응", "추가 서류 제출", "심사 결과 확인"] },
      { id: "s1-5", order: 5, name: "현장 실사", description: "현장 방문 실사", checklist: ["실사 일정 조율", "현장 준비 안내", "실사 동행"] },
      { id: "s1-6", order: 6, name: "최종 결과", description: "결과 통보 및 후속 처리", checklist: ["결과 통보", "협약 체결", "사후 관리 안내"] },
    ],
  },
  {
    id: "tpl-2",
    name: "정책자금",
    description: "중소기업 정책자금 신청 프로세스",
    color: "#16A34A",
    icon: "Banknote",
    isDefault: true,
    stages: [
      { id: "s2-1", order: 1, name: "자격 확인", description: "업종·매출·신용 확인", checklist: ["업종 확인", "매출 기준", "신용등급 확인", "정책자금 종류 선정"] },
      { id: "s2-2", order: 2, name: "서류 준비", description: "신청 서류 수집", checklist: ["사업자등록증", "재무제표(3개년)", "자금 사용 계획서", "담보/보증 확인"] },
      { id: "s2-3", order: 3, name: "신청·심사", description: "접수 및 심사", checklist: ["신청서 작성", "접수", "심사 진행", "보완 서류 제출"] },
      { id: "s2-4", order: 4, name: "승인·실행", description: "승인 및 자금 실행", checklist: ["승인 통보", "약정 체결", "자금 실행", "사후관리 안내"] },
    ],
  },
  {
    id: "tpl-3",
    name: "창업지원",
    description: "예비·초기 창업자 지원 프로세스",
    color: "#9333EA",
    icon: "Rocket",
    isDefault: true,
    stages: [
      { id: "s3-1", order: 1, name: "예비 창업 상담", description: "아이템·자격 확인", checklist: ["창업 아이템 확인", "지원 프로그램 매칭", "자격 요건 확인"] },
      { id: "s3-2", order: 2, name: "사업계획서 작성", description: "사업계획 수립", checklist: ["사업 모델 수립", "시장 분석", "재무 계획", "사업계획서 완성"] },
      { id: "s3-3", order: 3, name: "신청·발표", description: "서류 및 PT 심사", checklist: ["온라인 신청", "서류 심사", "발표 심사 준비", "PT 심사"] },
      { id: "s3-4", order: 4, name: "선정·협약", description: "선정 및 협약", checklist: ["선정 통보", "협약 체결", "사업비 교부"] },
      { id: "s3-5", order: 5, name: "사업 수행", description: "사업 수행 및 점검", checklist: ["중간 점검", "멘토링 참여", "사업비 집행"] },
      { id: "s3-6", order: 6, name: "완료·정산", description: "최종 보고 및 정산", checklist: ["최종 보고서", "사업비 정산", "성과 보고"] },
    ],
  },
  {
    id: "tpl-4",
    name: "기술보증",
    description: "기술보증기금 보증서 발급 프로세스",
    color: "#EA580C",
    icon: "Shield",
    isDefault: true,
    stages: [
      { id: "s4-1", order: 1, name: "기술 상담", description: "기술성 사전 평가", checklist: ["보유 기술 확인", "기술성 사전 평가", "보증 한도 예상"] },
      { id: "s4-2", order: 2, name: "신청·접수", description: "보증 신청서 접수", checklist: ["보증 신청서", "기술 설명서", "특허/인증 서류", "재무 서류"] },
      { id: "s4-3", order: 3, name: "기술 평가", description: "기술성·사업성 평가", checklist: ["기술성 평가", "사업성 평가", "현장 평가"] },
      { id: "s4-4", order: 4, name: "보증서 발급", description: "보증서 발급 및 대출 연계", checklist: ["보증 심사 결과", "보증서 발급", "대출 실행 연계"] },
    ],
  },
];

// ── 고객 Mock 데이터 ──
export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "cust-1", name: "김철수", phone: "010-1234-5678", email: "kim@abc.co.kr",
    company: "(주)ABC", position: "대표이사", assigneeId: "user-2", assigneeName: "이대리",
    grade: "VIP", tags: ["정책자금", "제조업"], bizNumber: "123-45-67890",
    bizType: "제조업", bizCategory: "전자부품", address: "서울시 강남구 테헤란로 123",
    foundedAt: "2015-03-15", ceoName: "김철수", revenue: 50000, employees: 12,
    source: "소개", lastContactAt: "2026-04-12", createdAt: "2026-01-15",
    processes: [
      { id: "cp-1", customerId: "cust-1", templateId: "tpl-1", templateName: "정부지원사업",
        currentStageOrder: 3, totalStages: 6, currentStageName: "신청·접수",
        status: "in_progress", startedAt: "2026-02-01", checklistStatus: { "온라인 신청 완료": true, "서류 제출": true, "접수 확인": false } },
    ],
  },
  {
    id: "cust-2", name: "이영희", phone: "010-2345-6789", email: "lee@def.co.kr",
    company: "DEF 기업", position: "이사", assigneeId: "user-1", assigneeName: "박팀장",
    grade: "A", tags: ["정책자금"], bizNumber: "234-56-78901",
    bizType: "서비스업", bizCategory: "IT서비스", address: "서울시 서초구 강남대로 456",
    foundedAt: "2018-07-20", ceoName: "이영희", revenue: 30000, employees: 8,
    source: "검색", lastContactAt: "2026-04-15", createdAt: "2026-02-10",
    processes: [
      { id: "cp-2", customerId: "cust-2", templateId: "tpl-2", templateName: "정책자금",
        currentStageOrder: 2, totalStages: 4, currentStageName: "서류 준비",
        status: "in_progress", startedAt: "2026-03-01", checklistStatus: { "사업자등록증": true, "재무제표(3개년)": false, "자금 사용 계획서": false, "담보/보증 확인": false } },
    ],
  },
  {
    id: "cust-3", name: "박민수", phone: "010-3456-7890", email: "park@ghi.com",
    company: "GHI 스타트업", position: "CEO", assigneeId: "user-2", assigneeName: "이대리",
    grade: "B", tags: ["창업지원", "IT"], address: "경기도 성남시 분당구 판교로 789",
    source: "광고", lastContactAt: "2026-04-17", createdAt: "2026-03-01",
    processes: [
      { id: "cp-3", customerId: "cust-3", templateId: "tpl-3", templateName: "창업지원",
        currentStageOrder: 1, totalStages: 6, currentStageName: "예비 창업 상담",
        status: "in_progress", startedAt: "2026-03-15", checklistStatus: { "창업 아이템 확인": true, "지원 프로그램 매칭": false, "자격 요건 확인": false } },
    ],
  },
  {
    id: "cust-4", name: "최지은", phone: "010-4567-8901", email: "choi@jkl.co.kr",
    company: "JKL기업", position: "팀장", assigneeId: "user-1", assigneeName: "박팀장",
    grade: "A", tags: ["기술보증", "바이오"], bizNumber: "345-67-89012",
    bizType: "제조업", bizCategory: "바이오", address: "대전시 유성구 대학로 101",
    foundedAt: "2020-01-10", ceoName: "최민호", revenue: 20000, employees: 15,
    source: "소개", lastContactAt: "2026-04-03", createdAt: "2026-01-20",
    processes: [
      { id: "cp-4", customerId: "cust-4", templateId: "tpl-4", templateName: "기술보증",
        currentStageOrder: 3, totalStages: 4, currentStageName: "기술 평가",
        status: "in_progress", startedAt: "2026-02-15", checklistStatus: { "기술성 평가": true, "사업성 평가": false, "현장 평가": false } },
    ],
  },
  {
    id: "cust-5", name: "한동욱", phone: "010-5678-9012", email: "han@mno.co.kr",
    company: "MNO텍", position: "대표", assigneeId: "user-2", assigneeName: "이대리",
    grade: "VIP", tags: ["정부지원사업", "IT"], bizNumber: "456-78-90123",
    bizType: "서비스업", bizCategory: "소프트웨어", address: "서울시 마포구 월드컵로 234",
    foundedAt: "2017-05-30", ceoName: "한동욱", revenue: 80000, employees: 25,
    source: "소개", lastContactAt: "2026-04-01", createdAt: "2025-11-05",
    processes: [
      { id: "cp-5", customerId: "cust-5", templateId: "tpl-1", templateName: "정부지원사업",
        currentStageOrder: 4, totalStages: 6, currentStageName: "서류 심사",
        status: "in_progress", startedAt: "2026-01-10", checklistStatus: { "보완 요청 대응": false, "추가 서류 제출": false, "심사 결과 확인": false } },
    ],
  },
  {
    id: "cust-6", name: "정수진", phone: "010-6789-0123", email: "jung@pqr.co.kr",
    company: "(주)PQR", position: "상무", assigneeId: "user-1", assigneeName: "박팀장",
    grade: "A", tags: ["정책자금", "유통"], bizNumber: "567-89-01234",
    bizType: "유통업", bizCategory: "온라인유통", address: "서울시 송파구 올림픽로 567",
    foundedAt: "2019-09-01", ceoName: "정수진", revenue: 45000, employees: 18,
    source: "검색", lastContactAt: "2026-04-20", createdAt: "2026-02-28",
    processes: [
      { id: "cp-6", customerId: "cust-6", templateId: "tpl-2", templateName: "정책자금",
        currentStageOrder: 3, totalStages: 4, currentStageName: "신청·심사",
        status: "in_progress", startedAt: "2026-03-10", checklistStatus: { "신청서 작성": true, "접수": true, "심사 진행": true, "보완 서류 제출": false } },
    ],
  },
  {
    id: "cust-7", name: "오세훈", phone: "010-7890-1234", email: "oh@stu.co.kr",
    company: "STU 산업", position: "부장", assigneeId: "user-2", assigneeName: "이대리",
    grade: "B", tags: ["정부지원사업"], bizNumber: "678-90-12345",
    bizType: "제조업", bizCategory: "기계", address: "인천시 남동구 논현로 890",
    foundedAt: "2012-11-15", ceoName: "오진석", revenue: 100000, employees: 45,
    source: "소개", lastContactAt: "2026-04-22", createdAt: "2026-03-05",
    processes: [
      { id: "cp-7", customerId: "cust-7", templateId: "tpl-1", templateName: "정부지원사업",
        currentStageOrder: 1, totalStages: 6, currentStageName: "상담 접수",
        status: "in_progress", startedAt: "2026-04-01", checklistStatus: { "사업 적격성 확인": true, "고객 요구사항 파악": true, "지원사업 매칭": false } },
    ],
  },
  {
    id: "cust-8", name: "이미정", phone: "010-8901-2345", email: "leem@vwx.co.kr",
    company: "VWX솔루션", position: "대표", assigneeId: "user-1", assigneeName: "박팀장",
    grade: "NEW", tags: ["창업지원"], address: "서울시 금천구 가산디지털1로 100",
    source: "광고", lastContactAt: "2026-04-10", createdAt: "2026-04-05",
    processes: [
      { id: "cp-8", customerId: "cust-8", templateId: "tpl-3", templateName: "창업지원",
        currentStageOrder: 2, totalStages: 6, currentStageName: "사업계획서 작성",
        status: "in_progress", startedAt: "2026-04-05", checklistStatus: { "사업 모델 수립": true, "시장 분석": false, "재무 계획": false, "사업계획서 완성": false } },
    ],
  },
  {
    id: "cust-9", name: "김하늘", phone: "010-9012-3456", email: "kimh@yza.co.kr",
    company: "YZA푸드", position: "대표", assigneeId: "user-2", assigneeName: "이대리",
    grade: "C", tags: ["정책자금", "요식업"], bizNumber: "789-01-23456",
    bizType: "요식업", bizCategory: "프랜차이즈", address: "부산시 해운대구 해운대로 456",
    foundedAt: "2021-06-01", ceoName: "김하늘", revenue: 15000, employees: 6,
    source: "기타", lastContactAt: "2026-04-08", createdAt: "2026-03-20",
    processes: [
      { id: "cp-9", customerId: "cust-9", templateId: "tpl-2", templateName: "정책자금",
        currentStageOrder: 1, totalStages: 4, currentStageName: "자격 확인",
        status: "in_progress", startedAt: "2026-03-25", checklistStatus: { "업종 확인": true, "매출 기준": true, "신용등급 확인": false, "정책자금 종류 선정": false } },
    ],
  },
  {
    id: "cust-10", name: "박상우", phone: "010-0123-4567", email: "parks@bcd.co.kr",
    company: "(주)BCD", position: "이사", assigneeId: "user-1", assigneeName: "박팀장",
    grade: "VIP", tags: ["기술보증", "IT"], bizNumber: "890-12-34567",
    bizType: "서비스업", bizCategory: "AI솔루션", address: "서울시 강서구 공항대로 678",
    foundedAt: "2016-02-28", ceoName: "박상우", revenue: 120000, employees: 50,
    source: "소개", lastContactAt: "2026-04-23", createdAt: "2025-12-01",
    processes: [
      { id: "cp-10", customerId: "cust-10", templateId: "tpl-4", templateName: "기술보증",
        currentStageOrder: 2, totalStages: 4, currentStageName: "신청·접수",
        status: "in_progress", startedAt: "2026-03-15", checklistStatus: { "보증 신청서": true, "기술 설명서": true, "특허/인증 서류": false, "재무 서류": false } },
    ],
  },
];

// ── 업무 Mock ──
export const MOCK_TASKS: Task[] = [
  { id: "task-1", title: "서류 보완 요청 연락", description: "김철수 고객 재무제표 추가 요청", customerId: "cust-1", customerName: "김철수", assigneeId: "user-2", assigneeName: "이대리", dueDate: "2026-04-24", priority: "high", status: "pending", createdAt: "2026-04-23" },
  { id: "task-2", title: "정책자금 신청서 검토", description: "이영희 고객 정책자금 신청서 최종 검토", customerId: "cust-2", customerName: "이영희", assigneeId: "user-1", assigneeName: "박팀장", dueDate: "2026-04-24", priority: "high", status: "pending", createdAt: "2026-04-22" },
  { id: "task-3", title: "사업계획서 초안 확인", description: "박민수 고객 창업지원 사업계획서", customerId: "cust-3", customerName: "박민수", assigneeId: "user-2", assigneeName: "이대리", dueDate: "2026-04-24", priority: "medium", status: "completed", createdAt: "2026-04-21", completedAt: "2026-04-24" },
  { id: "task-4", title: "기술보증 심사 결과 안내", description: "최지은 고객 기술보증 결과 통보", customerId: "cust-4", customerName: "최지은", assigneeId: "user-1", assigneeName: "박팀장", dueDate: "2026-04-25", priority: "medium", status: "pending", createdAt: "2026-04-23" },
  { id: "task-5", title: "현장 실사 일정 조율", description: "한동욱 고객 정부지원사업 실사 일정", customerId: "cust-5", customerName: "한동욱", assigneeId: "user-2", assigneeName: "이대리", dueDate: "2026-04-26", priority: "high", status: "pending", createdAt: "2026-04-24" },
  { id: "task-6", title: "보완 서류 제출 확인", description: "정수진 고객 정책자금 보완 서류", customerId: "cust-6", customerName: "정수진", assigneeId: "user-1", assigneeName: "박팀장", dueDate: "2026-04-24", priority: "low", status: "pending", createdAt: "2026-04-23" },
  { id: "task-7", title: "창업지원 멘토링 안내", description: "이미정 고객 멘토링 프로그램 안내", customerId: "cust-8", customerName: "이미정", assigneeId: "user-1", assigneeName: "박팀장", dueDate: "2026-04-27", priority: "low", status: "pending", createdAt: "2026-04-24" },
  { id: "task-8", title: "신규 고객 상담 진행", description: "오세훈 고객 정부지원사업 초기 상담", customerId: "cust-7", customerName: "오세훈", assigneeId: "user-2", assigneeName: "이대리", dueDate: "2026-04-24", priority: "medium", status: "pending", createdAt: "2026-04-22" },
];

// ── 활동 Mock ──
export const MOCK_ACTIVITIES: Activity[] = [
  { id: "act-1", customerId: "cust-1", type: "phone", content: "서류 보완 요청, 재무제표 추가 필요", createdBy: "user-2", createdByName: "이대리", createdAt: "2026-04-24T14:30:00" },
  { id: "act-2", customerId: "cust-1", type: "alimtalk", content: "서류 보완 안내 템플릿 발송", createdBy: "user-2", createdByName: "이대리", createdAt: "2026-04-24T14:35:00" },
  { id: "act-3", customerId: "cust-2", type: "email", content: "정책자금 신청 가이드 발송", createdBy: "user-1", createdByName: "박팀장", createdAt: "2026-04-23T10:00:00" },
  { id: "act-4", customerId: "cust-5", type: "stage_change", content: "서류 준비 → 서류 심사", metadata: { from: "서류 준비", to: "서류 심사" }, createdBy: "user-2", createdByName: "이대리", createdAt: "2026-04-22T11:00:00" },
  { id: "act-5", customerId: "cust-3", type: "visit", content: "사업장 방문 상담 (창업 아이템 검토)", createdBy: "user-2", createdByName: "이대리", createdAt: "2026-04-21T15:00:00" },
  { id: "act-6", customerId: "cust-6", type: "note", content: "정책자금 3차 보완 요청, 매출증빙 추가 필요", createdBy: "user-1", createdByName: "박팀장", createdAt: "2026-04-20T09:30:00" },
];

// ── 메모 Mock ──
export const MOCK_NOTES: Note[] = [
  { id: "note-1", customerId: "cust-1", content: "김철수 대표 — 재무제표 보완 후 3차 심사 예정. 매출 10억 이상이라 가산점 기대.", isPinned: true, createdBy: "user-2", createdByName: "이대리", createdAt: "2026-04-24T10:00:00", updatedAt: "2026-04-24T10:00:00" },
  { id: "note-2", customerId: "cust-1", content: "사업계획서 수정본 메일로 받음. 기술개발 부분 보강 필요.", isPinned: false, createdBy: "user-2", createdByName: "이대리", createdAt: "2026-04-22T14:30:00", updatedAt: "2026-04-22T14:30:00" },
  { id: "note-3", customerId: "cust-2", content: "정책자금 금리 우대 가능 여부 확인 중. 신용보증재단 연계 검토.", isPinned: true, createdBy: "user-1", createdByName: "박팀장", createdAt: "2026-04-23T09:00:00", updatedAt: "2026-04-23T11:00:00" },
  { id: "note-4", customerId: "cust-3", content: "창업지원 멘토링 1회차 완료. 사업 모델 피벗 검토 필요.", isPinned: false, createdBy: "user-2", createdByName: "이대리", createdAt: "2026-04-20T16:00:00", updatedAt: "2026-04-20T16:00:00" },
  { id: "note-5", customerId: "cust-5", content: "현장 실사 일정 4월 28일로 확정. 대표자 동석 필수.", isPinned: true, createdBy: "user-2", createdByName: "이대리", createdAt: "2026-04-24T11:30:00", updatedAt: "2026-04-24T11:30:00" },
];

// ── 파일 Mock (UI용) ──
export interface MockFile {
  id: string;
  customerId: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;
}

export const MOCK_FILES: MockFile[] = [
  { id: "file-1", customerId: "cust-1", name: "사업계획서_v3.pdf", type: "application/pdf", size: 2450000, uploadedBy: "user-2", uploadedByName: "이대리", uploadedAt: "2026-04-22T14:30:00" },
  { id: "file-2", customerId: "cust-1", name: "재무제표_2025.xlsx", type: "application/xlsx", size: 850000, uploadedBy: "user-2", uploadedByName: "이대리", uploadedAt: "2026-04-20T10:00:00" },
  { id: "file-3", customerId: "cust-1", name: "사업자등록증.jpg", type: "image/jpeg", size: 1200000, uploadedBy: "user-2", uploadedByName: "이대리", uploadedAt: "2026-04-18T09:00:00" },
  { id: "file-4", customerId: "cust-2", name: "정책자금_신청서.pdf", type: "application/pdf", size: 3100000, uploadedBy: "user-1", uploadedByName: "박팀장", uploadedAt: "2026-04-23T10:00:00" },
  { id: "file-5", customerId: "cust-5", name: "기술사업계획서.pdf", type: "application/pdf", size: 4200000, uploadedBy: "user-2", uploadedByName: "이대리", uploadedAt: "2026-04-21T15:00:00" },
];

// ── 통계 계산 ──
export function getUncontactedCustomers(days: number = 7): Customer[] {
  const now = new Date();
  return MOCK_CUSTOMERS.filter((c) => {
    const diff = Math.floor((now.getTime() - new Date(c.lastContactAt).getTime()) / (1000 * 60 * 60 * 24));
    return diff >= days;
  }).sort((a, b) => new Date(a.lastContactAt).getTime() - new Date(b.lastContactAt).getTime());
}

export function getTodayTasks(): Task[] {
  const today = new Date().toISOString().split("T")[0];
  return MOCK_TASKS.filter((t) => t.dueDate <= today || t.status === "completed");
}

export function getProcessStats() {
  const stats: Record<string, number> = {};
  for (const c of MOCK_CUSTOMERS) {
    for (const p of c.processes) {
      stats[p.templateName] = (stats[p.templateName] || 0) + 1;
    }
  }
  return Object.entries(stats).map(([name, count]) => ({ name, count }));
}
