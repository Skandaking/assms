'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface Employee {
  DUTY_STATION: string;
  DUTY_STATION_DISTRICT: string;
}

interface StationCount {
  [key: string]: number;
}

const Home = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stationCounts, setStationCounts] = useState<StationCount>({});
  const [districtCounts, setDistrictCounts] = useState<StationCount>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const response = await fetch('/api/employees');
    const data = await response.json();
    setEmployees(data);
    processEmployeeData(data);
  };

  const processEmployeeData = (data: Employee[]) => {
    const stations: StationCount = {};
    const districts: StationCount = {};

    data.forEach((employee) => {
      const normalizedStation = normalizeStationName(employee.DUTY_STATION);
      const capitalizedStation = capitalizeWords(normalizedStation);
      stations[capitalizedStation] = (stations[capitalizedStation] || 0) + 1;

      const normalizedDistrict = employee.DUTY_STATION_DISTRICT.toLowerCase();
      const capitalizedDistrict = capitalizeWords(normalizedDistrict);
      districts[capitalizedDistrict] =
        (districts[capitalizedDistrict] || 0) + 1;
    });

    setStationCounts(stations);
    setDistrictCounts(districts);
  };

  const normalizeStationName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/^min\.?\s+of\s+/, 'ministry of ')
      .replace(/^ministry\s+of\s+/, 'ministry of ')
      .replace(/^accountant\s+general\s+-\s+/, 'accountant general - ')
      .trim();
  };

  const capitalizeWords = (str: string) => {
    return str.replace(
      /\b\w+/g,
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
  };

  const filteredStations = Object.entries(stationCounts)
    .filter(([station]) =>
      station.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b[1] - a[1]);

  const filteredDistricts = Object.entries(districtCounts)
    .filter(([district]) =>
      district.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Employee Analysis
      </h1>

      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search stations or districts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md overflow-hidden">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Employees by Duty Station
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Station
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Count
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStations.map(([station, count]) => (
                  <tr key={station} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {station}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md overflow-hidden">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Employees by District
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    District
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Count
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDistricts.map(([district, count]) => (
                  <tr key={district} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {district}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {count}
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

export default Home;
