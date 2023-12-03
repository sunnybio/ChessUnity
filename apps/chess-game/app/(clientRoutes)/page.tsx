import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { ReactNode } from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Home(): Promise<ReactNode> {
    const session = await getServerSession(authOptions);

    console.log("in page", session);
    if (session) {
        return (
            <div className="h-screen">
                <nav className="flex justify-between">
                    signed in as {session.user.name}, {session.user.email}
                    <br />
                    <button
                        className="inline-block rounded bg-black px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                        type="button"
                    >
                        <Link href="/api/auth/signout">SignOut</Link>
                    </button>
                </nav>
                <div className="flex rounded justify-center items-center bg-black h-full">
                    <button
                        className="inline-block rounded justify-center bg-blue-50 px-6"
                        type="button"
                    >
                        Start Game
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full md:w-full xl:w-full">
            <div className="flex justify-between">
                Not signed in <br />
                <br />
                <button
                    className="inline-block rounded bg-black px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                    type="button"
                >
                    <Link href="/api/auth/signin">Sign In</Link>
                </button>
            </div>
        </div>
    );
}
