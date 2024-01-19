import { Authenticator, AuthorizationError } from "remix-auth/build";
import { sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";
import { prisma } from "./prisma.server";

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const authenticator = new Authenticator<any>(sessionStorage);
