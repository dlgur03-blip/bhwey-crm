// Prisma v7 — Supabase 연결 시 활성화
// import { PrismaClient } from "@/generated/prisma/client";
//
// DB 연동 시 아래와 같이 사용:
// import { PrismaPg } from "@prisma/adapter-pg"
// const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
// export const prisma = new PrismaClient({ adapter })

// 현재는 Mock 데이터 사용 중 — DB 연동 시 위 코드로 교체
export const prisma = null;
