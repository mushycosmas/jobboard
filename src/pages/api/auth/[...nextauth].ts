import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "../../../lib/db";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcryptjs";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username or Email", type: "text", placeholder: "username or email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error("No credentials provided.");
        const { username, password } = credentials;

        // Find user by email or username
        const [rows] = await db.query<RowDataPacket[]>(
          "SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1",
          [username, username]
        );

        const user = rows[0];
        if (!user) throw new Error("Invalid username or email.");

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new Error("Invalid password.");

        // Prepare extra info for session
        let employerId: number | null = null;
        let employerName: string | null = null;
        let applicantId: number | null = null;
        let applicantFirstname: string | null = null;
        let applicantLastname: string | null = null;

        if (user.userType === "employer") {
          // Correct join with employers table
          const [employerRows] = await db.query<RowDataPacket[]>(
            `SELECT ue.employer_id, e.company_name
             FROM user_employers ue
             LEFT JOIN employers e ON ue.employer_id = e.id
             WHERE ue.user_id = ? LIMIT 1`,
            [user.id]
          );

          if (employerRows.length > 0) {
            employerId = employerRows[0].employer_id;
            employerName = employerRows[0].company_name;
          }
        } else if (user.userType === "applicant") {
          const [applicantRows] = await db.query<RowDataPacket[]>(
            "SELECT id, first_name, last_name FROM applicants WHERE user_id = ? LIMIT 1",
            [user.id]
          );

          if (applicantRows.length > 0) {
            applicantId = applicantRows[0].id;
            applicantFirstname = applicantRows[0].first_name;
            applicantLastname = applicantRows[0].last_name;
          }
        }

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.userType,
          employerId,
          employerName,
          applicantId,
          applicantFirstname,
          applicantLastname,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "user";
        token.username = user.username;
        token.employerId = user.employerId ?? null;
        token.employerName = user.employerName ?? null;
        token.applicantId = user.applicantId ?? null;
        token.applicantFirstname = user.applicantFirstname ?? null;
        token.applicantLastname = user.applicantLastname ?? null;
      }

      // Google sign-in flow
      if (account?.provider === "google" && profile?.email) {
        const email = profile.email;

        const [rows] = await db.query<RowDataPacket[]>(
          "SELECT * FROM users WHERE email = ? LIMIT 1",
          [email]
        );

        if (rows.length > 0) {
          token.id = rows[0].id;
          token.role = rows[0].userType || "user";
        } else {
          const username = profile.name
            ? profile.name.replace(/\s+/g, "").toLowerCase()
            : email.split("@")[0];

          const [result]: any = await db.query(
            `INSERT INTO users (username, email, userType, created_at, updated_at)
             VALUES (?, ?, ?, NOW(), NOW())`,
            [username, email, "user"]
          );

          token.id = result.insertId;
          token.role = "user";
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.username = token.username;
        session.user.employerId = token.employerId;
        session.user.employerName = token.employerName;
        session.user.applicantId = token.applicantId;
        session.user.applicantFirstname = token.applicantFirstname;
        session.user.applicantLastname = token.applicantLastname;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
});
