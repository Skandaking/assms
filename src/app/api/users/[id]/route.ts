import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'acs_staff',
};

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { firstname, lastname, username, password, role } =
    await request.json();

  const connection = await mysql.createConnection(dbConfig);

  try {
    let query =
      'UPDATE users SET firstname = ?, lastname = ?, username = ?, role = ?';
    let values = [firstname, lastname, username, role];

    if (password) {
      query += ', password = ?';
      values.push(password);
    }

    query += ' WHERE id = ?';
    values.push(id);

    await connection.execute(query, values);

    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'An error occurred while updating the user' },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const connection = await mysql.createConnection(dbConfig);

  try {
    await connection.execute('DELETE FROM users WHERE id = ?', [id]);
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { message: 'An error occurred while deleting the user' },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
}
