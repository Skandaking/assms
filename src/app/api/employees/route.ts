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
      `INSERT INTO acs_staff_return (
        GRADE, NAME_OF_POSITION, NAME, EMP_NUMBER, GENDER, 
        QUALIFICATION, DATE_OF_BIRTH, DATE_OF_FIRST_APPOINTMENT, 
        DATE_OF_PROMOTION_TO_CURRENT_POSITION, DUTY_STATION, 
        DUTY_STATION_DISTRICT, NUMBER_OF_YEARS_AT_DUTY_STATION
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employeeData.GRADE,
        employeeData.NAME_OF_POSITION,
        employeeData.NAME,
        employeeData.EMP_NUMBER,
        employeeData.GENDER,
        employeeData.QUALIFICATION,
        employeeData.DATE_OF_BIRTH,
        employeeData.DATE_OF_FIRST_APPOINTMENT,
        employeeData.DATE_OF_PROMOTION_TO_CURRENT_POSITION,
        employeeData.DUTY_STATION,
        employeeData.DUTY_STATION_DISTRICT,
        employeeData.NUMBER_OF_YEARS_AT_DUTY_STATION,
      ]
    );

    return NextResponse.json(
      { id: result.insertId, ...employeeData },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      {
        message: 'An error occurred while creating the employee',
        error: error.message,
        sqlMessage: error.sqlMessage,
      },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
}
