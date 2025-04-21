import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();

  // Clear the userId cookie
  cookieStore.delete('userId');

  return NextResponse.json({ success: true });
}
