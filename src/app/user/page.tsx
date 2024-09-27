'use client';

import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, X, Edit, Trash2 } from 'lucide-react';

interface User {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  role: 'administrator' | 'user';
}

const User = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    id: 0,
    firstname: '',
    lastname: '',
    username: '',
    password: '',
    role: 'user' as 'administrator' | 'user',
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    'delete' | 'update' | null
  >(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    setUsers(data);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.id) {
      setSelectedUser(newUser);
      setConfirmAction('update');
      setShowConfirmDialog(true);
    } else {
      await addOrUpdateUser();
    }
  };

  const addOrUpdateUser = async () => {
    const url = newUser.id ? `/api/users/${newUser.id}` : '/api/users';
    const method = newUser.id ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });

    if (response.ok) {
      fetchUsers();
      setNewUser({
        id: 0,
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        role: 'user',
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setConfirmAction('delete');
    setShowConfirmDialog(true);
  };

  const handleEditUser = (user: User) => {
    setNewUser({ ...user, password: '' });
    setShowAddForm(true);
  };

  const confirmDelete = async () => {
    if (selectedUser) {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchUsers();
      }
    }
    setShowConfirmDialog(false);
  };

  const confirmUpdate = async () => {
    await addOrUpdateUser();
    setShowConfirmDialog(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button
          className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md flex items-center transition duration-300 ease-in-out shadow-md"
          onClick={() => setShowAddForm(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add User
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {newUser.id ? 'Edit User' : 'Add New User'}
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddUser}>
              <input
                type="text"
                placeholder="First Name"
                value={newUser.firstname}
                onChange={(e) =>
                  setNewUser({ ...newUser, firstname: e.target.value })
                }
                className="mb-3 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={newUser.lastname}
                onChange={(e) =>
                  setNewUser({ ...newUser, lastname: e.target.value })
                }
                className="mb-3 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              />
              <input
                type="text"
                placeholder="Username"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                className="mb-3 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="mb-3 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              />
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    role: e.target.value as 'administrator' | 'user',
                  })
                }
                className="mb-4 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              >
                <option value="user">User</option>
                <option value="administrator">Administrator</option>
              </select>
              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out"
              >
                {newUser.id ? 'Update User' : 'Add User'}
              </button>
            </form>
          </div>
        </div>
      )}

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4">Confirm Action</h2>
            <p>
              Are you sure you want to{' '}
              {confirmAction === 'delete' ? 'delete' : 'update'} user{' '}
              {selectedUser?.firstname} {selectedUser?.lastname}?
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={
                  confirmAction === 'delete' ? confirmDelete : confirmUpdate
                }
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No.
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                First Name
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Name
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user, index) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-4 px-4 whitespace-nowrap">{index + 1}</td>
                <td className="py-4 px-4 whitespace-nowrap">
                  {user.firstname}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">{user.lastname}</td>
                <td className="py-4 px-4 whitespace-nowrap">{user.username}</td>
                <td className="py-4 px-4 whitespace-nowrap">{user.role}</td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;
