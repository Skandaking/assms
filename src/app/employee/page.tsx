'use client';

import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, X, Edit, Trash2 } from 'lucide-react';

interface Employee {
  ID: number;
  GRADE: string;
  NAME_OF_POSITION: string;
  NAME: string;
  EMP_NUMBER: number | null;
  GENDER: string;
  QUALIFICATION: string | null;
  DATE_OF_BIRTH: string | null;
  DATE_OF_FIRST_APPOINTMENT: string | null;
  DATE_OF_PROMOTION_TO_CURRENT_POSITION: string | null;
  DUTY_STATION: string;
  DUTY_STATION_DISTRICT: string;
  NUMBER_OF_YEARS_AT_DUTY_STATION: string | null;
}

const Employee = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Employee>({
    ID: 0,
    GRADE: '',
    NAME_OF_POSITION: '',
    NAME: '',
    EMP_NUMBER: null,
    GENDER: '',
    QUALIFICATION: '',
    DATE_OF_BIRTH: '',
    DATE_OF_FIRST_APPOINTMENT: '',
    DATE_OF_PROMOTION_TO_CURRENT_POSITION: '',
    DUTY_STATION: '',
    DUTY_STATION_DISTRICT: '',
    NUMBER_OF_YEARS_AT_DUTY_STATION: '',
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const response = await fetch('/api/employees');
    const data = await response.json();
    setEmployees(data);
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.NAME.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.NAME_OF_POSITION.toLowerCase().includes(
        searchTerm.toLowerCase()
      ) ||
      employee.DUTY_STATION.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEmployee),
    });
    if (response.ok) {
      const addedEmployee = await response.json();
      setEmployees([...employees, addedEmployee]);
      setNewEmployee({
        ID: 0,
        GRADE: '',
        NAME_OF_POSITION: '',
        NAME: '',
        EMP_NUMBER: null,
        GENDER: '',
        QUALIFICATION: '',
        DATE_OF_BIRTH: '',
        DATE_OF_FIRST_APPOINTMENT: '',
        DATE_OF_PROMOTION_TO_CURRENT_POSITION: '',
        DUTY_STATION: '',
        DUTY_STATION_DISTRICT: '',
        NUMBER_OF_YEARS_AT_DUTY_STATION: '',
      });
      setShowAddForm(false);
    } else {
      console.error('Failed to add employee');
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-none bg-white shadow-md p-6 sticky top-0 z-10">
        <h1 className="text-3xl font-bold mb-6">Employee Management</h1>
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search employees..."
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
            <PlusCircle className="mr-2 h-4 w-4" /> Add Employee
          </button>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
            <div className="bg-white p-6 rounded-lg shadow-xl w-3/4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add New Employee</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <form
                onSubmit={handleAddEmployee}
                className="grid grid-cols-3 gap-4"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter full name"
                    value={newEmployee.NAME}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, NAME: e.target.value })
                    }
                    className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                  />
                </div>
                <div>
                  <label
                    htmlFor="grade"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Grade
                  </label>
                  <input
                    id="grade"
                    type="text"
                    placeholder="Enter grade"
                    value={newEmployee.GRADE}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, GRADE: e.target.value })
                    }
                    className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                  />
                </div>
                <div>
                  <label
                    htmlFor="position"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Position
                  </label>
                  <input
                    id="position"
                    type="text"
                    placeholder="Enter position"
                    value={newEmployee.NAME_OF_POSITION}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        NAME_OF_POSITION: e.target.value,
                      })
                    }
                    className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                  />
                </div>
                <div>
                  <label
                    htmlFor="empNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Employee Number
                  </label>
                  <input
                    id="empNumber"
                    type="number"
                    placeholder="Enter employee number"
                    value={newEmployee.EMP_NUMBER || ''}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        EMP_NUMBER: parseInt(e.target.value) || null,
                      })
                    }
                    className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                  />
                </div>
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    value={newEmployee.GENDER}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, GENDER: e.target.value })
                    }
                    className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                  >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="qualification"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Qualification
                  </label>
                  <input
                    id="qualification"
                    type="text"
                    placeholder="Enter qualification"
                    value={newEmployee.QUALIFICATION || ''}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        QUALIFICATION: e.target.value,
                      })
                    }
                    className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                  />
                </div>
                <div>
                  <label
                    htmlFor="dateOfBirth"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date of Birth
                  </label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    value={newEmployee.DATE_OF_BIRTH || ''}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        DATE_OF_BIRTH: e.target.value,
                      })
                    }
                    className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                  />
                </div>
                <div>
                  <label
                    htmlFor="dateOfFirstAppointment"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date of First Appointment
                  </label>
                  <input
                    id="dateOfFirstAppointment"
                    type="date"
                    value={newEmployee.DATE_OF_FIRST_APPOINTMENT || ''}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        DATE_OF_FIRST_APPOINTMENT: e.target.value,
                      })
                    }
                    className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                  />
                </div>
                <div>
                  <label
                    htmlFor="dateOfPromotion"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date of Promotion to Current Position
                  </label>
                  <input
                    id="dateOfPromotion"
                    type="date"
                    value={
                      newEmployee.DATE_OF_PROMOTION_TO_CURRENT_POSITION || ''
                    }
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        DATE_OF_PROMOTION_TO_CURRENT_POSITION: e.target.value,
                      })
                    }
                    className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                  />
                </div>
                <div>
                  <label
                    htmlFor="dutyStation"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Duty Station
                  </label>
                  <input
                    id="dutyStation"
                    type="text"
                    placeholder="Enter duty station"
                    value={newEmployee.DUTY_STATION}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        DUTY_STATION: e.target.value,
                      })
                    }
                    className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                  />
                </div>
                <div>
                  <label
                    htmlFor="dutyStationDistrict"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Duty Station District
                  </label>
                  <input
                    id="dutyStationDistrict"
                    type="text"
                    placeholder="Enter duty station district"
                    value={newEmployee.DUTY_STATION_DISTRICT}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        DUTY_STATION_DISTRICT: e.target.value,
                      })
                    }
                    className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                  />
                </div>
                <div>
                  <label
                    htmlFor="yearsAtStation"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Number of Years at Duty Station
                  </label>
                  <input
                    id="yearsAtStation"
                    type="text"
                    placeholder="Enter number of years"
                    value={newEmployee.NUMBER_OF_YEARS_AT_DUTY_STATION || ''}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        NUMBER_OF_YEARS_AT_DUTY_STATION: e.target.value,
                      })
                    }
                    className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                  />
                </div>
                <button
                  type="submit"
                  className="col-span-3 mt-4 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out"
                >
                  Add Employee
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="flex-grow overflow-auto">
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full bg-white table-fixed">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 capitalize tracking-wider w-1/12">
                    Emp. no
                  </th>
                  <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 capitalize tracking-wider w-1/12">
                    Grade
                  </th>
                  <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 capitalize tracking-wider w-2/12">
                    Name
                  </th>
                  <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 capitalize tracking-wider w-2/12">
                    Position
                  </th>
                  <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 capitalize tracking-wider w-1/12">
                    Gender
                  </th>
                  <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 capitalize tracking-wider w-2/12">
                    Qualification
                  </th>
                  <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 capitalize tracking-wider w-1/12">
                    First appt.
                  </th>
                  <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 capitalize tracking-wider w-1/12">
                    Current pos.
                  </th>
                  <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 capitalize tracking-wider w-2/12">
                    Duty station
                  </th>
                  <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 capitalize tracking-wider w-2/12">
                    District
                  </th>
                  <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 capitalize tracking-wider w-1/12">
                    Years at station
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.ID} className="hover:bg-gray-50">
                    <td className="py-2 px-2 text-xs whitespace-normal">
                      {employee.EMP_NUMBER}
                    </td>
                    <td className="py-2 px-2 text-xs whitespace-normal">
                      {employee.GRADE}
                    </td>
                    <td className="py-2 px-2 text-xs whitespace-normal">
                      {employee.NAME}
                    </td>
                    <td className="py-2 px-2 text-xs whitespace-normal">
                      {employee.NAME_OF_POSITION}
                    </td>
                    <td className="py-2 px-2 text-xs whitespace-normal">
                      {employee.GENDER}
                    </td>
                    <td className="py-2 px-2 text-xs whitespace-normal">
                      {employee.QUALIFICATION}
                    </td>
                    <td className="py-2 px-2 text-xs whitespace-normal">
                      {employee.DATE_OF_FIRST_APPOINTMENT
                        ? new Date(employee.DATE_OF_FIRST_APPOINTMENT)
                            .toISOString()
                            .split('T')[0]
                        : ''}
                    </td>
                    <td className="py-2 px-2 text-xs whitespace-normal">
                      {employee.DATE_OF_PROMOTION_TO_CURRENT_POSITION
                        ? new Date(
                            employee.DATE_OF_PROMOTION_TO_CURRENT_POSITION
                          )
                            .toISOString()
                            .split('T')[0]
                        : ''}
                    </td>
                    <td className="py-2 px-2 text-xs whitespace-normal">
                      {employee.DUTY_STATION}
                    </td>
                    <td className="py-2 px-2 text-xs whitespace-normal">
                      {employee.DUTY_STATION_DISTRICT}
                    </td>
                    <td className="py-2 px-2 text-xs whitespace-normal">
                      {employee.NUMBER_OF_YEARS_AT_DUTY_STATION}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employee;
