import { NextResponse } from 'next/server';
import { executeQuery } from '@/app/lib/db';

export async function GET() {
  try {
    const rows = await executeQuery('SELECT * FROM acs_staff_return');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching employees' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const employeeData = await request.json();

  try {
    const result: any = await executeQuery(
      `INSERT INTO acs_staff_return (
        NO_OF_ESTABLISHED_POST, NO_OF_FILLED_POST, NO_OF_VACANT_POST,
        GRADE, NAME_OF_POSITION, NAME, EMP_NUMBER, GENDER, 
        QUALIFICATION, DATE_OF_FIRST_APPOINTMENT, 
        DATE_OF_PROMOTION_TO_CURRENT_POSITION, YEARS_ON_CURRENT_POSITION,
        PREVIOUS_DUTY_STATION, CURRENT_DUTY_STATION, COST_CENTER, 
        VOTE, DUTY_STATION_DISTRICT, DATE_REPORTED_TO_CURRENT_STATION,
        NUMBER_OF_YEARS_AT_DUTY_STATION, DATE_OF_BIRTH
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employeeData.NO_OF_ESTABLISHED_POST,
        employeeData.NO_OF_FILLED_POST,
        employeeData.NO_OF_VACANT_POST,
        employeeData.GRADE,
        employeeData.NAME_OF_POSITION,
        employeeData.NAME,
        employeeData.EMP_NUMBER,
        employeeData.GENDER,
        employeeData.QUALIFICATION,
        employeeData.DATE_OF_FIRST_APPOINTMENT,
        employeeData.DATE_OF_PROMOTION_TO_CURRENT_POSITION,
        employeeData.YEARS_ON_CURRENT_POSITION,
        employeeData.PREVIOUS_DUTY_STATION,
        employeeData.CURRENT_DUTY_STATION,
        employeeData.COST_CENTER,
        employeeData.VOTE,
        employeeData.DUTY_STATION_DISTRICT,
        employeeData.DATE_REPORTED_TO_CURRENT_STATION,
        employeeData.NUMBER_OF_YEARS_AT_DUTY_STATION,
        employeeData.DATE_OF_BIRTH,
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
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const employeeData = await request.json();
  const { id } = params;

  try {
    const result: any = await executeQuery(
      'UPDATE acs_staff_return SET ? WHERE ID = ?',
      [employeeData, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Employee updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json(
      {
        message: 'An error occurred while updating the employee',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
