import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { Role } from "@/types/auth";
import PrismaSingleton from "@/utils/db";
//import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaAdapter } from "@auth/prisma-adapter";

const PROFILE_PHOTO_SIZE = 48;

const prisma = PrismaSingleton;

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      //issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID,
      authorization: {
        params: {
          scope: "openid email profile User.Read User.ReadBasic.All",
          endpoint:
            "https://login.microsoftonline.com/pslib.cz/oauth2/v2.0/authorize",
        },
      },
      async profile(profile, tokens) {
        const response = await fetch(
          "https://graph.microsoft.com/v1.0/me?$select=displayName,givenName,surname,department,jobTitle,mobilePhone",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
            },
          },
        )
          .then((response) => response.json())
          .catch((error) => console.error("Chyba:", error));
        //console.log("DATA:", response);
        const imageResponse = await fetch(
          `https://graph.microsoft.com/v1.0/me/photos/${PROFILE_PHOTO_SIZE}x${PROFILE_PHOTO_SIZE}/$value`,
          { headers: { Authorization: `Bearer ${tokens.access_token}` } },
        )
          .then((response) => response.arrayBuffer())
          .then((buffer) => Buffer.from(buffer).toString("base64"))
          .catch((error) => console.error("Chyba:", error));
        let role = Role.GUEST;
        if (response.department !== null) role = Role.STUDENT;
        if (response.jobTitle === "učitel" || response.department === "PZAM")
          role = Role.TEACHER;
        return {
          id: profile.oid,
          name: profile.name,
          email: profile.email,
          department: response.department,
          givenName: response.givenName,
          surname: response.surname,
          image: String(imageResponse),
          role: role,
          phone: response.mobilePhone,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (token !== undefined) {
        session.user.id = token.oid;
        session.user.role = token.role || Role.GUEST;
        session.user.department = token.department;
      } else if (user !== undefined) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.department = user.department;
      }
      return session;
    },
    async jwt({ token, user, account, profile, trigger }) {
      if (user) {
        // user z databáze
      }
      if (profile !== undefined) {
        const response = await fetch("https://graph.microsoft.com/v1.0/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${account!.access_token}`,
          },
        })
          .then((response) => response.json())
          .catch((error) => console.error("Chyba:", error));
        let role = Role.GUEST;
        if (response.department !== null) role = Role.STUDENT;
        if (response.jobTitle === "učitel" || response.department === "PZAM")
          role = Role.TEACHER;
        if (role === Role.TEACHER) {
          token.role = Role.TEACHER;
          token.department = response.officeLocation;
        } else if (role === Role.STUDENT) {
          token.role = Role.STUDENT;
          token.department = response.officeLocation;
        } else {
          token.role = Role.GUEST;
          token.department = undefined;
        }
      }
      return token;
    },
  },
});
