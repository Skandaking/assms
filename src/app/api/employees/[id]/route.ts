import { NextResponse } from 'next/server';
import { executeQuery } from '@/app/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const employeeData = await request.json();
  const { id } = params;

  try {
    const result: any = await executeQuery(
      `UPDATE acs_staff_return SET 
        NO_OF_ESTABLISHED_POST = ?, NO_OF_FILLED_POST = ?, NO_OF_VACANT_POST = ?,
        GRADE = ?, NAME_OF_POSITION = ?, NAME = ?, EMP_NUMBER = ?, GENDER = ?, 
        QUALIFICATION = ?, DATE_OF_BIRTH = ?, DATE_OF_FIRST_APPOINTMENT = ?, 
        DATE_OF_PROMOTION_TO_CURRENT_POSITION = ?, YEARS_ON_CURRENT_POSITION = ?,
        DUTY_STATION = ?, COST_CENTER = ?, VOTE = ?, PREVIOUS_DUTY_STATION = ?,
        DUTY_STATION_DISTRICT = ?, DATE_REPORTED_TO_CURRENT_STATION = ?,
        NUMBER_OF_YEARS_AT_DUTY_STATION = ?
      WHERE ID = ?`,
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
        employeeData.DATE_OF_BIRTH,
        employeeData.DATE_OF_FIRST_APPOINTMENT,
        employeeData.DATE_OF_PROMOTION_TO_CURRENT_POSITION,
        employeeData.YEARS_ON_CURRENT_POSITION,
        employeeData.DUTY_STATION,
        employeeData.COST_CENTER,
        employeeData.VOTE,
        employeeData.PREVIOUS_DUTY_STATION,
        employeeData.DUTY_STATION_DISTRICT,
        employeeData.DATE_REPORTED_TO_CURRENT_STATION,
        employeeData.NUMBER_OF_YEARS_AT_DUTY_STATION,
        id,
      ]
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const result: any = await executeQuery(
      'DELETE FROM acs_staff_return WHERE ID = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Employee deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      {
        message: 'An error occurred while deleting the employee',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
