"use server";

import { NextResponse } from "next/server"; 
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

 
const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);
 
// Create the JWT
export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Date.now() + 60 * 1000) // JWT expiration (1 minute)
    .sign(key);
}
 
// Read the JWT
export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}
 
// Create the cookie
export async function createCookie(sessionData: object) {
  const encryptedSessionData = await encrypt(sessionData);
 
  cookies().set("session", encryptedSessionData, {
    httpOnly: true,
    secure: false,
    path: "/",
  });
}
 
// Destroy the cookie
export async function logout() {
  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) });
}
 
// Read the cookie
export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function checkAuth() {
    const session = await getSession();
   
    if (!session) { // If no session set
      return NextResponse.json(
        { message: "User is not authenticated" },
        { status: 403 }
      );
    }
   
    if (session.exp < Date.now()) { // If JWT expired
      return NextResponse.json({ message: "Session expired" }, { status: 403 });
    }
   
    return NextResponse.json({ message: "Logged" }, { status: 200 });
  }