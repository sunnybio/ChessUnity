import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";
import dbConnect from "db/src/mongodb/connect/connectMongodb";
import User from "db/src/mongodb/Models/Users";

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_GOOGLE_CLIENT_ID,
            clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            id: "credentials",
            name: "Credentials",
            type: "credentials",
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "Username",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await dbConnect();
                console.log(credentials);
                const username = credentials?.username;
                const password = credentials?.password;

                const userq = await User.findOne({
                    username,
                });
                if (userq) {
                    if (userq.password !== password) {
                        return null;
                    }

                    // Any object returned will be saved in `user` property of the JWT
                    return {
                        id: userq._id,
                        username: userq.username,
                    };
                }
                const newUser = new User({
                    username,
                    password,
                });
                await newUser.save();
                console.log("check new user", newUser);
                if (newUser) {
                    return {
                        id: newUser._id,
                        username: newUser.username,
                    };
                }
            },
        }),
        // ...add more providers here
    ] as Provider[],
    secret: process.env.NEXT_AUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    jwt: {
        encryption: true,
    },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
