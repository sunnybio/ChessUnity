import NextAuth from 'next-auth'
import { authOptions } from 'backend/src/authOptions'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
