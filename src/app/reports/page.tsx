'use client';

import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Printer, X } from 'lucide-react';

interface FilterCriteria {
  grade: string;
  vote: string;
  currentStation: string;
  costCenter: string;
  district: string;
}

interface Employee {
  ID: number;
  GRADE: string;
  VOTE: string;
  CURRENT_DUTY_STATION: string;
  COST_CENTER: string;
  DUTY_STATION_DISTRICT: string;
  NAME: string;
  EMP_NUMBER: number;
  GENDER: string;
  QUALIFICATION: string;
  DATE_OF_BIRTH: string | null;
  DATE_OF_FIRST_APPOINTMENT: string | null;
}

const Reports = () => {
  const [filters, setFilters] = useState<FilterCriteria>({
    grade: '',
    vote: '',
    currentStation: '',
    costCenter: '',
    district: '',
  });

  const [uniqueValues, setUniqueValues] = useState({
    grades: new Set<string>(),
    votes: new Set<string>(),
    stations: new Set<string>(),
    costCenters: new Set<string>(),
    districts: new Set<string>(),
  });

  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    fetchUniqueValues();
  }, []);

  const fetchUniqueValues = async () => {
    try {
      const response = await fetch('/api/employees');
      const data = await response.json();

      const values = {
        grades: new Set(data.map((emp: Employee) => emp.GRADE).filter(Boolean)),
        votes: new Set(data.map((emp: Employee) => emp.VOTE).filter(Boolean)),
        stations: new Set(
          data.map((emp: Employee) => emp.CURRENT_DUTY_STATION).filter(Boolean)
        ),
        costCenters: new Set(
          data.map((emp: Employee) => emp.COST_CENTER).filter(Boolean)
        ),
        districts: new Set(
          data.map((emp: Employee) => emp.DUTY_STATION_DISTRICT).filter(Boolean)
        ),
      };

      setUniqueValues(values);
    } catch (error) {
      console.error('Error fetching unique values:', error);
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const generateReport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/employees');
      const data = await response.json();

      // Filter employees based on selected criteria
      const filtered = data.filter((employee: Employee) => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value) return true; // Skip empty filters

          const employeeValue = employee[mapFilterToEmployeeField(key)];
          return employeeValue && employeeValue.toString() === value;
        });
      });

      setFilteredEmployees(filtered);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const mapFilterToEmployeeField = (filterKey: string): string => {
    const mapping: { [key: string]: string } = {
      grade: 'GRADE',
      vote: 'VOTE',
      currentStation: 'CURRENT_DUTY_STATION',
      costCenter: 'COST_CENTER',
      district: 'DUTY_STATION_DISTRICT',
    };
    return mapping[filterKey];
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportToExcel = () => {
    // Create CSV content
    const headers = [
      'Name',
      'Employee Number',
      'Grade',
      'Vote',
      'Current Station',
      'Cost Center',
      'District',
      'Gender',
      'Qualification',
    ].join(',');

    const csvContent = filteredEmployees
      .map((emp) =>
        [
          emp.NAME,
          emp.EMP_NUMBER,
          emp.GRADE,
          emp.VOTE,
          emp.CURRENT_DUTY_STATION,
          emp.COST_CENTER,
          emp.DUTY_STATION_DISTRICT,
          emp.GENDER,
          emp.QUALIFICATION,
        ].join(',')
      )
      .join('\n');

    const blob = new Blob([headers + '\n' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `employee_report_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Employee Reports</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="grade"
                value={filters.grade}
                onChange={handleFilterChange}
                placeholder="Enter Grade"
                className="w-full p-2 border rounded-md"
              />
              <select
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, grade: e.target.value }))
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Grade</option>
                {[...uniqueValues.grades].sort().map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vote
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="vote"
                value={filters.vote}
                onChange={handleFilterChange}
                placeholder="Enter Vote"
                className="w-full p-2 border rounded-md"
              />
              <select
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, vote: e.target.value }))
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Vote</option>
                {[...uniqueValues.votes].sort().map((vote) => (
                  <option key={vote} value={vote}>
                    {vote}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Station
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="currentStation"
                value={filters.currentStation}
                onChange={handleFilterChange}
                placeholder="Enter Current Station"
                className="w-full p-2 border rounded-md"
              />
              <select
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    currentStation: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Current Station</option>
                {[...uniqueValues.stations].sort().map((station) => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cost Center
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="costCenter"
                value={filters.costCenter}
                onChange={handleFilterChange}
                placeholder="Enter Cost Center"
                className="w-full p-2 border rounded-md"
              />
              <select
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    costCenter: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Cost Center</option>
                {[...uniqueValues.costCenters].sort().map((center) => (
                  <option key={center} value={center}>
                    {center}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              District
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="district"
                value={filters.district}
                onChange={handleFilterChange}
                placeholder="Enter District"
                className="w-full p-2 border rounded-md"
              />
              <select
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, district: e.target.value }))
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select District</option>
                {[...uniqueValues.districts].sort().map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-span-full">
            <button
              onClick={() => {
                generateReport();
                setShowReportModal(true);
              }}
              disabled={isLoading}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-300"
            >
              {isLoading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>

      {showReportModal && filteredEmployees.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Report Results ({filteredEmployees.length} employees)
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrint}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 flex items-center"
                  >
                    <Printer className="h-4 w-4 mr-2" /> Print
                  </button>
                  <button
                    onClick={handleExportToExcel}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center"
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" /> Export to Excel
                  </button>
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="overflow-auto max-h-[calc(90vh-200px)]">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Emp Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vote
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Station
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost Center
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        District
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEmployees.map((employee) => (
                      <tr key={employee.ID}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.NAME}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.EMP_NUMBER}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.GRADE}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.VOTE}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.CURRENT_DUTY_STATION}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.COST_CENTER}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.DUTY_STATION_DISTRICT}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
