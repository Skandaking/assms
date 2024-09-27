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
    const [rows] = await connection.execute('SELECT * FROM acs_staff_return');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching employees' },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
}

export async function POST(request: Request) {
  const employeeData = await request.json();
  const connection = await mysql.createConnection(dbConfig);

  try {
    const [result]: any = await connection.execute(
      'INSERT INTO acs_staff_return SET ?',
      [employeeData]
    );

    return NextResponse.json(
      { id: result.insertId, ...employeeData },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { message: 'An error occurred while creating the employee' },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
}
