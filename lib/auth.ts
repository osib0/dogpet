import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { sendEmail } from "@/lib/send-email";

const client = new MongoClient(process.env.MONGODB_URI!, {
  appName: "libease",
});

const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification:true,
    expiresIn:3600,
    sendVerificationEmail: async ({ user, url, token }, request) => {
            void sendEmail({
                to: user.email,
                subject: 'Verify your email address',
                text: `Click the link to verify your email: ${url}`,
            })
        },

  },
  emailAndPassword: {
    requireEmailVerification: true,
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
      },
      membershipStatus: {
        type: "string",
        defaultValue: "active",
      },
    },

    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        console.log("Delete Account URL:", url);
      },
    },
  },

  security: {
    passwordHash: {
      algorithm: "bcrypt",
      saltRounds: 10,
    },
  },

});
