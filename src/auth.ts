import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { Session, User, Profile, JWT, Role } from "@/types/auth";
import PrismaSingleton from "@/utils/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const PROFILE_PHOTO_SIZE = 48;

const prisma = PrismaSingleton;
//const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      tenantId: process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID,
      authorization: {
        params: {
          scope: "openid email profile User.Read User.ReadBasic.All",
          endpoint:
            "https://login.microsoftonline.com/pslib.cz/oauth2/v2.0/authorize",
        },
      },
      async profile(profile, tokens) {
        console.info("PROFILE:", profile, "TOKENS:", tokens);
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
        console.log("DATA:", response);
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
});
