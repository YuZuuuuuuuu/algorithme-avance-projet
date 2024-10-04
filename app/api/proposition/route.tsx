"use server";
 
import { NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";



export async function POST(req: Request) {
  // Get body request
  const body = await req.json();
  const { lastname, proposition, horaire } = body;
 
  // Call register function (see below)
  const response = await saveproposition(lastname, proposition, horaire);
 
  return NextResponse.json({ response });
}
 
async function saveproposition(
  lastname: string,
  proposition: string,
  horaire: Date,
) {
  let db = null;
 
  // Check if the database instance has been initialized
  if (!db) {
    // If the database instance is not initialized, open the database connection
    db = await open({
      filename: process.env.DATABASE_NAME || "", // Specify the database file path
      driver: sqlite3.Database, // Specify the database driver (sqlite3 in this case)
    });
  }
 
  // Insert the new user
  const sql = `INSERT INTO proposition (lastname, proposition, horaire) VALUES (?, ?, ?)`;
  const insert = await db.get(sql, lastname, proposition, horaire);
 
  return insert;
}
