import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'acs_staff',
  });

  try {
    const [rows] = await connection.execute(
      'SELECT id, firstname, lastname, username, role FROM users'
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching users' },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
}
