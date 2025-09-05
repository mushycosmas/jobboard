import NextAuth from "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      username: string;
      email?: string | null;
      role: string;

      // Add your extra user properties here:
      employerId?: number | null;
      employerName?: string | null;
      applicantId?: number | null;
      applicantFirstname?: string | null;
      applicantLastname?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: number;
    username: string;
    email?: string | null;
    role: string;

    // Add your extra user properties here:
    employerId?: number | null;
    employerName?: string | null;
    applicantId?: number | null;
    applicantFirstname?: string | null;
    applicantLastname?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: number;
    username: string;
    role: string;

    // Add your extra JWT properties here:
    employerId?: number | null;
    employerName?: string | null;
    applicantId?: number | null;
    applicantFirstname?: string | null;
    applicantLastname?: string | null;
  }
}
