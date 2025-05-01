'use server';

import {db, auth } from "@/firebase/admin";
import {cookies} from "next/headers";

const ONE_WEEK = 60*60*24*7;//60 sec 60 mins 24 hrs 7 days, expires in 1 week


export async function signUp(params: SignUpParams){
    const { uid, name, email} = params;

    try{
        const userRecord = await db.collection('users').doc(uid).get();

        if(userRecord.exists){
            return {
                success: false,
                message: 'User already exists. Please Sign In!'
            }
        }

        await db.collection('users').doc(uid).set({
            name, email
        })

        return {
                success: true,
                message: 'Account Created Successfully. Please Sign in!'
        }

    } catch(e: any){
        console.error('Error creating a user', e);

        if(e.code === 'auth/email-already-exists'){
            return{
                success: false,
                message: 'Email already in use'
            }
        }
        return {
            success: false,
            message: 'Account creation Failed'
        }
    }
}

export async function signIn(params: SignInParams){
    const {email, idToken}  = params;

    try{
        const userRecord = await auth.getUserByEmail(email);

        if(!userRecord){
            return{
                success: false,
                message: 'User does not exist! Create an account first'
            }
        }

        await setSessionCookie(idToken);

    } catch(e){
        console.log(e);
        
        return{
            success: false,
            message: 'Failed to log into the account'
        }
    }
}

export async function setSessionCookie(idToken: string){
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken,{
        expiresIn: ONE_WEEK *1000, 
    })

    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    })
}


//only allows homepage for auntheticated users
export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if(!sessionCookie) return null;

    try{
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true)

        const userRecord = await db. 
        collection('users')
        .doc(decodedClaims.uid)
        .get();

        if(!userRecord.exists) return null;

        return{
            ... userRecord.data(),
            id: userRecord.id,
        } as User;

    } catch (e){
        console.log(e)
        return null;
    }
}

//check if user has been authenticated or not
export async function isAuthenticated(){
    const user = await getCurrentUser();

    return !!user;
}