import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@utils/database";
import User from "@models/user";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      // clientId: process.env.GOOGLE_ID,
      // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      clientId:
        "578942609778-pcic20ek5oief9vds5bbfgb6dj9d3ofg.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({
        email: session.user.email,
      });

      session.user.id = sessionUser._id.toString();

      return session;
    },
    async signIn({ profile }) {
      try {
        await connectToDB();

        // check if user exist, if yes then sign the user in
        const userExists = await User.findOne({
          email: profile.email,
        });

        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
          });
        }
        return true;

        // if not create a new user and save to database
      } catch (error) {
        console.log(error);
      }
    },
  },
});

export { handler as GET, handler as POST };
