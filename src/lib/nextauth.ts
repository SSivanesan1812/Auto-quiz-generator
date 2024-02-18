import { Prisma } from "@prisma/client";
import {DefaultSession, NextAuthOptions} from "next-auth";
import {PrismaAdapter} from "@next-auth/prisma-adapter"
import {prisma} from "./db"
import GoogleProvider from "next-auth/providers/google";


declare module "next-auth"{
    interface Session extends DefaultSession{
        user:{
            id:String
            
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt'{
    interface JWT{
        id:String
    }
}

export const authOptions:NextAuthOptions={
    session:{
        strategy:"jwt"
    },
    callbacks:{
        jwt:async({token})=>{
            const db_user=await prisma.user.findFirst({
                where:{
                    email:token?.email
                }
            })
            if(db_user){
                token.id=db_user.id.toString()
            }
            return token
        },
        session:({session,token})=>{
            if(token){
                session.user.id=token.id
                session.user.name=token.name
                session.user.email=token.email
                session.user.image=token.picture
            }
            return session
        }

    },
    secret:process.env.NEXT_AUTH_SECRET,
    adapter:PrismaAdapter(prisma),
    providers:[GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
      })]

}