//import NextAuth, { type DefaultSession } from "next-auth";
//import { JWT } from "next-auth/jwt";
//import { DateTime } from "next-auth/providers/kakao";

export enum Role {
  ADMIN = "admin",
  TEACHER = "teacher",
  STUDENT = "student",
  GUEST = "guest",
  MANAGER = "manager",
}
/*
declare module "next-auth" {
  export interface Session {
    user: {
      role?: string;
      department?: string;
      id: string;
    } & DefaultSession["user"];
  }
  export interface User {
    id?: string;
    role: string;
    department?: string;
    givenName: string;
    surname: string;
  }
  export interface Profile {
    //id?: string | null
    image?: string;
    role?: string;
    department?: string;
    givenName: string;
    surname: string;
    birthDate?: DateTime;
    phone?: BigInt;
    //jobTitle?: string
  }
}

declare module "next-auth/jwt" {
  export interface JWT {
    oid: string;
    role?: string;
    department?: string;
  }
}
*/