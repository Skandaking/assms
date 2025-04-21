import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { executeQuery } from '@/app/lib/db';
import { RowDataPacket } from 'mysql2';

interface UserRow extends RowDataPacket {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  role: string;
}

export async function GET() {
  // In a real app, you'd use the session token to get the user ID
  // For demo purposes, we'll check for a userId cookie
  const cookieStore = cookies();
  const userId = cookieStore.get('userId');

  if (!userId || !userId.value) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const result = await executeQuery(
      'SELECT id, firstname, lastname, username, role FROM users WHERE id = ?',
      [userId.value]
    );

    const rows = Array.isArray(result) ? (result as UserRow[]) : [];

    if (rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching the current user' },
      { status: 500 }
    );
  }
}
