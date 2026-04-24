# BH WEY 고객관리 — 디자인 시스템

## 1. 디자인 컨셉

**밝고 깨끗한 프로페셔널 CRM** — 화이트 베이스에 블루 포인트 컬러로 신뢰감과 가독성 극대화.

### 원칙
1. **화이트 베이스**: 배경은 `#FFFFFF` ~ `#F8FAFC`. 어두운 사이드바 금지.
2. **블루 포인트**: 버튼, 활성 메뉴, 링크에만 `#2563EB` 사용.
3. **그림자 최소**: `shadow-sm` 수준. 과도한 elevation 금지.
4. **둥근 카드**: `rounded-xl` 기본. 부드러운 느낌.
5. **충분한 여백**: 카드 내부 `p-6`, 섹션 간격 `gap-6`.
6. **Pretendard 폰트**: 한글 최적 가독성.

---

## 2. 컬러 토큰

### Primary
| 토큰 | HEX | 용도 |
|------|-----|------|
| `primary` | `#2563EB` | 메인 버튼, 활성 메뉴, 링크 |
| `primary-hover` | `#1D4ED8` | 호버 상태 |
| `primary-light` | `#EFF6FF` | 블루 틴트 배경, 활성 탭 배경 |

### Neutral
| 토큰 | HEX | 용도 |
|------|-----|------|
| `background` | `#FFFFFF` | 메인 배경 |
| `surface` | `#F8FAFC` | 카드/섹션 배경 |
| `sidebar` | `#F1F5F9` | 사이드바 배경 |
| `border` | `#E2E8F0` | 구분선, 카드 테두리 |
| `text-primary` | `#1E293B` | 제목, 본문 |
| `text-secondary` | `#64748B` | 보조 텍스트 |
| `text-muted` | `#94A3B8` | 플레이스홀더, 비활성 |

### Semantic
| 토큰 | HEX | 용도 |
|------|-----|------|
| `success` | `#22C55E` | 완료, 성공 |
| `warning` | `#F59E0B` | 주의, 경고 (미연락 7일) |
| `danger` | `#EF4444` | 삭제, 에러, 미연락 21일+ |
| `info` | `#3B82F6` | 정보, 링크 |

### 미연락 기간 색상
| 기간 | 색상 | Tailwind |
|------|------|----------|
| 7~13일 | `#F59E0B` (앰버) | `text-warning` / `bg-amber-50` |
| 14~20일 | `#F97316` (오렌지) | `text-orange-500` / `bg-orange-50` |
| 21일+ | `#EF4444` (레드) | `text-danger` / `bg-red-50` |

---

## 3. 타이포그래피

| 용도 | 폰트 | 크기 | 무게 | Tailwind |
|------|------|------|------|----------|
| 페이지 제목 | Pretendard | 24px | Bold (700) | `text-2xl font-bold` |
| 섹션 제목 | Pretendard | 18px | SemiBold (600) | `text-lg font-semibold` |
| 카드 제목 | Pretendard | 16px | SemiBold (600) | `text-base font-semibold` |
| 본문 | Pretendard | 14px | Regular (400) | `text-sm` |
| 보조 텍스트 | Pretendard | 13px | Regular (400) | `text-[13px] text-muted-foreground` |
| 뱃지/라벨 | Pretendard | 12px | Medium (500) | `text-xs font-medium` |
| 숫자/통계 | Pretendard | 28px | Bold (700) | `text-[28px] font-bold` |

---

## 4. 간격 시스템

| 용도 | 값 | Tailwind |
|------|-----|----------|
| 카드 내부 패딩 | 24px | `p-6` |
| 섹션 간격 | 24px | `gap-6` |
| 요소 간격 (좁은) | 8px | `gap-2` |
| 요소 간격 (보통) | 12px | `gap-3` |
| 요소 간격 (넓은) | 16px | `gap-4` |
| 페이지 패딩 | 24px~32px | `p-6 lg:p-8` |
| 사이드바 너비 | 256px | `w-64` |

---

## 5. 컴포넌트 스펙

### 카드
```tsx
<Card className="rounded-xl border border-border bg-card shadow-sm">
  <CardHeader className="p-6 pb-3">
    <CardTitle className="text-lg font-semibold">제목</CardTitle>
  </CardHeader>
  <CardContent className="p-6 pt-0">
    ...
  </CardContent>
</Card>
```

### 버튼
- Primary: `bg-primary text-white hover:bg-primary/90 rounded-lg px-4 py-2`
- Secondary: `bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg`
- Ghost: `hover:bg-accent rounded-lg`
- Destructive: `bg-destructive text-white rounded-lg`

### 뱃지
- 등급 VIP: `bg-amber-100 text-amber-800`
- 등급 A: `bg-blue-100 text-blue-800`
- 등급 B: `bg-green-100 text-green-800`
- 등급 C: `bg-gray-100 text-gray-800`
- 신규: `bg-purple-100 text-purple-800`

### 사이드바
```
배경: #F1F5F9 (bg-sidebar)
메뉴 아이템: py-2.5 px-3 rounded-lg text-sm
활성: bg-primary/10 text-primary font-medium
호버: bg-accent
아이콘: 20px (w-5 h-5), mr-3
```

### 미연락 고객 카드
```
크기: min-w-[260px]
배경: bg-card
테두리: border border-border
라운드: rounded-xl
패딩: p-5
그림자: shadow-sm hover:shadow-md transition-shadow
```

### 프로그레스 바
```
높이: h-2
배경: bg-muted
채움: bg-primary rounded-full
```

---

## 6. 레이아웃

### 데스크톱 (1280px+)
```
┌──────────┬────────────────────────────┐
│          │  헤더 (h-16)               │
│ 사이드바  ├────────────────────────────┤
│ (w-64)   │                            │
│ 고정     │  메인 콘텐츠               │
│          │  (p-6 lg:p-8)             │
│          │                            │
└──────────┴────────────────────────────┘
```

### 태블릿 (768px~1279px)
- 사이드바: Sheet (슬라이드 오버레이)
- 햄버거 메뉴로 토글

### 모바일 (~767px)
- 바텀 네비게이션 (5개 메뉴)
- 전체 너비 카드 (1열)

---

## 7. 아이콘

lucide-react 사용. 크기: `w-5 h-5` (20px) 기본, `w-4 h-4` (16px) 인라인.

| 메뉴 | 아이콘 |
|------|--------|
| 대시보드 | `LayoutDashboard` |
| 고객관리 | `Users` |
| 파이프라인 | `Kanban` |
| 템플릿 | `FileText` |
| 알림톡 | `MessageSquare` |
| 업무관리 | `CheckSquare` |
| 마이페이지 | `UserCircle` |
| 설정 | `Settings` |
| 로그아웃 | `LogOut` |

---

## 8. 반응형 브레이크포인트

| 디바이스 | 너비 | Tailwind |
|----------|------|----------|
| 모바일 | ~767px | `default` |
| 태블릿 | 768px~1279px | `md:` |
| 데스크톱 | 1280px+ | `lg:` / `xl:` |

---

## 9. 애니메이션

- 호버 전환: `transition-colors duration-150`
- 카드 호버: `transition-shadow duration-200`
- 사이드바 열기/닫기: `transition-transform duration-300`
- 모달: `animate-in fade-in-0 zoom-in-95`
- 토스트: `animate-in slide-in-from-bottom-5`
