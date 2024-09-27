import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'acs_staff',
  });

  try {
    const [rows]: any = await connection.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: 'Username does not exist' },
        { status: 400 }
      );
    }

    const user = rows[0];

    if (user.password !== password) {
      return NextResponse.json(
        { message: 'Password does not match the username' },
        { status: 400 }
      );
    }

    return NextResponse.json({ role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'An error occurred during login' },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
}
