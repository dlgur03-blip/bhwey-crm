"use client";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-200/20 blur-3xl" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
