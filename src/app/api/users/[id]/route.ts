import { NextResponse } from 'next/server';
import { executeQuery } from '@/app/lib/db';
import { cookies } from 'next/headers';

// Get user by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies();
  const userId = cookieStore.get('userId');

  // Basic security check - users can only access their own data
  // (more sophisticated auth like JWT would be better in a real app)
  if (!userId || userId.value !== params.id) {
    return NextResponse.json(
      { message: 'Not authorized to access this user' },
      { status: 403 }
    );
  }

  try {
    const rows: any[] = await executeQuery(
      'SELECT id, firstname, lastname, username, role FROM users WHERE id = ?',
      [params.id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching the user' },
      { status: 500 }
    );
  }
}

// Update user
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies();
  const userId = cookieStore.get('userId');

  // Basic security check
  if (!userId || userId.value !== params.id) {
    return NextResponse.json(
      { message: 'Not authorized to update this user' },
      { status: 403 }
    );
  }

  const updateData = await request.json();
  const { currentPassword, newPassword, ...userData } = updateData;

  try {
    // If user is trying to change password, verify the current password
    if (newPassword) {
      const user: any[] = await executeQuery(
        'SELECT password FROM users WHERE id = ?',
        [params.id]
      );

      if (user.length === 0) {
        return NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }

      if (user[0].password !== currentPassword) {
        return NextResponse.json(
          { message: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      // Add new password to userData for the update
      userData.password = newPassword;
    }

    const result: any = await executeQuery('UPDATE users SET ? WHERE id = ?', [
      userData,
      params.id,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: 'User not found or no changes were made' },
        { status: 404 }
      );
    }

    // Get the updated user data
    const updatedUser: any[] = await executeQuery(
      'SELECT id, firstname, lastname, username, role FROM users WHERE id = ?',
      [params.id]
    );

    return NextResponse.json(updatedUser[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      {
        message: 'An error occurred while updating the user',
        error: error instanceof Error ? error.message : 'Unknown error',
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
