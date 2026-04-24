import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        // TODO: DB 연동 후 실제 인증 로직으로 교체
        // 현재는 데모 계정만 허용
        if (
          credentials?.email === "admin@bhwey.com" &&
          credentials?.password === "admin1234"
        ) {
          return {
            id: "user-1",
            name: "박팀장",
            email: "admin@bhwey.com",
            role: "ADMIN",
          };
        }
        if (
          credentials?.email === "staff@bhwey.com" &&
          credentials?.password === "staff1234"
        ) {
          return {
            id: "user-2",
            name: "이대리",
            email: "staff@bhwey.com",
            role: "STAFF",
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "STAFF";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
