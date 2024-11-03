import { NextResponse } from 'next/server';
import { executeQuery } from '@/app/lib/db';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  try {
    const rows: any = await executeQuery(
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
  }
}
