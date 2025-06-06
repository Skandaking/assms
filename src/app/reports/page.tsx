'use client';

import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Printer, X, AlertCircle } from 'lucide-react';

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
  NAME_OF_POSITION: string;
  NO_OF_ESTABLISHED_POST: number;
  NO_OF_FILLED_POST: number;
  NO_OF_VACANT_POST: number;
  DATE_OF_PROMOTION_TO_CURRENT_POSITION: string | null;
  YEARS_ON_CURRENT_POSITION: number;
  PREVIOUS_DUTY_STATION: string;
  DATE_REPORTED_TO_CURRENT_STATION: string | null;
  NUMBER_OF_YEARS_AT_DUTY_STATION: number;
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
  const [showNoResultsError, setShowNoResultsError] = useState(false);
  const [noResultsMessage, setNoResultsMessage] = useState('');

  useEffect(() => {
    fetchUniqueValues();
  }, []);

  const fetchUniqueValues = async () => {
    try {
      const response = await fetch('/api/employees');
      const data = await response.json();

      const values = {
        grades: new Set(
          data.map((emp: Employee) => emp.GRADE).filter(Boolean) as string[]
        ),
        votes: new Set(
          data.map((emp: Employee) => emp.VOTE).filter(Boolean) as string[]
        ),
        stations: new Set(
          data
            .map((emp: Employee) => emp.CURRENT_DUTY_STATION)
            .filter(Boolean) as string[]
        ),
        costCenters: new Set(
          data
            .map((emp: Employee) => emp.COST_CENTER)
            .filter(Boolean) as string[]
        ),
        districts: new Set(
          data
            .map((emp: Employee) => emp.DUTY_STATION_DISTRICT)
            .filter(Boolean) as string[]
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

      if (filtered.length === 0) {
        const activeFilters = Object.entries(filters)
          .filter(([, value]) => value)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
        setNoResultsMessage(`No results found for ${activeFilters}`);
        setShowNoResultsError(true);
        setShowReportModal(false);
      } else {
        setFilteredEmployees(filtered);
        setShowReportModal(true);
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const mapFilterToEmployeeField = (filterKey: string): keyof Employee => {
    const mapping: { [key: string]: keyof Employee } = {
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
    const headers = [
      'Name',
      'Employee Number',
      'Grade',
      'Position',
      'Established Posts',
      'Filled Posts',
      'Vacant Posts',
      'Gender',
      'Qualification',
      'Date of Birth',
      'First Appointment',
      'Promotion Date',
      'Years in Position',
      'Previous Station',
      'Current Station',
      'Cost Center',
      'Vote',
      'District',
      'Date Reported',
      'Years at Station',
    ].join(',');

    const csvContent = filteredEmployees
      .map((emp) =>
        [
          emp.NAME,
          emp.EMP_NUMBER,
          emp.GRADE,
          emp.NAME_OF_POSITION,
          emp.NO_OF_ESTABLISHED_POST,
          emp.NO_OF_FILLED_POST,
          emp.NO_OF_VACANT_POST,
          emp.GENDER,
          emp.QUALIFICATION,
          emp.DATE_OF_BIRTH
            ? new Date(emp.DATE_OF_BIRTH).toLocaleDateString()
            : '',
          emp.DATE_OF_FIRST_APPOINTMENT
            ? new Date(emp.DATE_OF_FIRST_APPOINTMENT).toLocaleDateString()
            : '',
          emp.DATE_OF_PROMOTION_TO_CURRENT_POSITION
            ? new Date(
                emp.DATE_OF_PROMOTION_TO_CURRENT_POSITION
              ).toLocaleDateString()
            : '',
          emp.YEARS_ON_CURRENT_POSITION,
          emp.PREVIOUS_DUTY_STATION,
          emp.CURRENT_DUTY_STATION,
          emp.COST_CENTER,
          emp.VOTE,
          emp.DUTY_STATION_DISTRICT,
          emp.DATE_REPORTED_TO_CURRENT_STATION
            ? new Date(
                emp.DATE_REPORTED_TO_CURRENT_STATION
              ).toLocaleDateString()
            : '',
          emp.NUMBER_OF_YEARS_AT_DUTY_STATION,
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
                {Array.from(uniqueValues.grades)
                  .sort()
                  .map((grade) => (
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
                {Array.from(uniqueValues.votes)
                  .sort()
                  .map((vote) => (
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
                {Array.from(uniqueValues.stations)
                  .sort()
                  .map((station) => (
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
                {Array.from(uniqueValues.costCenters)
                  .sort()
                  .map((center) => (
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
                {Array.from(uniqueValues.districts)
                  .sort()
                  .map((district) => (
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[95vw] max-h-[85vh] overflow-hidden mt-16">
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
                        Established Posts
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Filled Posts
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vacant Posts
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Position
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Emp Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gender
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qualification
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        First Appointment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Promotion Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Years in Position
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Previous Station
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Station
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost Center
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vote
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        District
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Reported
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Years at Station
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Age
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEmployees.map((employee) => (
                      <tr key={employee.ID}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.NO_OF_ESTABLISHED_POST}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.NO_OF_FILLED_POST}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.NO_OF_VACANT_POST}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.GRADE}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.NAME_OF_POSITION}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.NAME}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.EMP_NUMBER}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.GENDER}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.QUALIFICATION}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.DATE_OF_FIRST_APPOINTMENT
                            ? new Date(
                                employee.DATE_OF_FIRST_APPOINTMENT
                              ).toLocaleDateString()
                            : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.DATE_OF_PROMOTION_TO_CURRENT_POSITION
                            ? new Date(
                                employee.DATE_OF_PROMOTION_TO_CURRENT_POSITION
                              ).toLocaleDateString()
                            : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.YEARS_ON_CURRENT_POSITION}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.PREVIOUS_DUTY_STATION}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.CURRENT_DUTY_STATION}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.COST_CENTER}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.VOTE}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.DUTY_STATION_DISTRICT}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.DATE_REPORTED_TO_CURRENT_STATION
                            ? new Date(
                                employee.DATE_REPORTED_TO_CURRENT_STATION
                              ).toLocaleDateString()
                            : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.NUMBER_OF_YEARS_AT_DUTY_STATION}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.DATE_OF_BIRTH
                            ? Math.floor(
                                (new Date().getTime() -
                                  new Date(employee.DATE_OF_BIRTH).getTime()) /
                                  (365.25 * 24 * 60 * 60 * 1000)
                              )
                            : ''}
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

      {showNoResultsError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
                <h2 className="text-xl font-semibold">No Results Found</h2>
              </div>
              <button
                onClick={() => setShowNoResultsError(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-600">{noResultsMessage}</p>
            <button
              onClick={() => setShowNoResultsError(false)}
              className="mt-4 w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
