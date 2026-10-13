import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.BETTER_AUTH_MONGO_URI);
const db = client.db("bazar-dor-project2");
const googleOAuthConfigured = Boolean(
  process.env.BETTER_AUTH_GOOGLE_CLIENT_ID
  && process.env.BETTER_AUTH_GOOGLE_CLIENT_SECRET
);
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  socialProviders: {
    ...(googleOAuthConfigured && {
      google: {
        clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.BETTER_AUTH_GOOGLE_CLIENT_SECRET,
      },
    }),
  },
  database: mongodbAdapter(db, {
    client,
  }),
});