import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'acs_staff',
};

export async function GET() {
  const connection = await mysql.createConnection(dbConfig);

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

export async function POST(request: Request) {
  const { firstname, lastname, username, password, role } =
    await request.json();

  const connection = await mysql.createConnection(dbConfig);

  try {
    const [result]: any = await connection.execute(
      'INSERT INTO users (firstname, lastname, username, password, role) VALUES (?, ?, ?, ?, ?)',
      [firstname, lastname, username, password, role]
    );

    const newUser = {
      id: result.insertId,
      firstname,
      lastname,
      username,
      role,
    };

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: 'An error occurred while creating the user' },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
}
