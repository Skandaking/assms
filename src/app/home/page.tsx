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
      stations[employee.DUTY_STATION] =
        (stations[employee.DUTY_STATION] || 0) + 1;

      districts[employee.DUTY_STATION_DISTRICT] =
        (districts[employee.DUTY_STATION_DISTRICT] || 0) + 1;
    });

    setStationCounts(stations);
    setDistrictCounts(districts);
  };

  const filteredStations = Object.entries(stationCounts).filter(([station]) =>
    station.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDistricts = Object.entries(districtCounts).filter(
    ([district]) => district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedStations = filteredStations.reduce(
    (acc, [station, count]) => {
      if (station.includes('Accountant General')) {
        if (!acc['Accountant General']) {
          acc['Accountant General'] = { total: 0, divisions: {} };
        }
        acc['Accountant General'].total += count;
        acc['Accountant General'].divisions[station] = count;
      } else {
        acc[station] = count;
      }
      return acc;
    },
    {} as {
      [key: string]:
        | number
        | { total: number; divisions: { [key: string]: number } };
    }
  );

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
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Employees by Duty Station (MDA)
          </h2>
          <ul className="space-y-2">
            {Object.entries(groupedStations).map(([station, count]) => (
              <li key={station} className="flex justify-between items-center">
                <span className="text-gray-800">{station}</span>
                {typeof count === 'number' ? (
                  <span className="font-semibold text-blue-600">{count}</span>
                ) : (
                  <div>
                    <span className="font-semibold text-blue-600">
                      {count.total}
                    </span>
                    <ul className="ml-4 mt-2 space-y-1">
                      {Object.entries(count.divisions).map(
                        ([division, divCount]) => (
                          <li
                            key={division}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-gray-600">
                              {division.replace('Accountant General - ', '')}
                            </span>
                            <span className="font-semibold text-green-600">
                              {divCount}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Employees by District
          </h2>
          <ul className="space-y-2">
            {filteredDistricts.map(([district, count]) => (
              <li key={district} className="flex justify-between items-center">
                <span className="text-gray-800">{district}</span>
                <span className="font-semibold text-blue-600">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
