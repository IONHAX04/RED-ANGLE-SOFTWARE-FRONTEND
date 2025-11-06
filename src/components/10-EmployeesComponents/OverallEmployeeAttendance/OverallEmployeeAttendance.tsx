import React, { useState, useEffect, useRef } from "react";
import { Toolbar } from "primereact/toolbar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";

interface Employee {
  id: number;
  name: string;
  date: string;
  punch_in_time: string;
  punch_out_time: string;
  total_hours: string;
  status: string;
}

const OverallEmployeeAttendance: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const dt = useRef<DataTable<any>>(null);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/attendance/get"
      );
      setEmployees(response.data.data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  // Toolbar contents
  const leftContents = (
    <div className="flex gap-2 items-center">
      <span className="p-input-icon-left">
        <InputText
          placeholder="Global Search"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </span>
      <Calendar
        value={fromDate}
        onChange={(e) => setFromDate(e.value as Date)}
        placeholder="From"
        dateFormat="yy-mm-dd"
      />
      <Calendar
        value={toDate}
        onChange={(e) => setToDate(e.value as Date)}
        placeholder="To"
        dateFormat="yy-mm-dd"
      />
      <Dropdown
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.value)}
        options={[
          { label: "Present", value: "Present" },
          { label: "Absent", value: "Absent" },
        ]}
        placeholder="Status"
        className="w-32"
      />

      <Button
        label="Clear Filters"
        className="p-button-sm p-button-secondary"
        onClick={() => {
          setGlobalFilter("");
          setFromDate(null);
          setToDate(null);
          setStatusFilter(null);
        }}
      />
    </div>
  );

  const rightContents = (
    <Button
      label="Export CSV"
      icon="pi pi-download"
      className="p-button-sm"
      onClick={() => dt.current?.exportCSV()}
    />
  );

  // Filter employees by date and status
  const filteredEmployees = employees.filter((emp) => {
    const empDate = new Date(emp.date);
    const afterFrom = fromDate ? empDate >= fromDate : true;
    const beforeTo = toDate ? empDate <= toDate : true;
    const statusMatch = statusFilter ? emp.status === statusFilter : true;
    return afterFrom && beforeTo && statusMatch;
  });

  return (
    <div>
      <div className="shadow-lg p-3">
        <Toolbar left={leftContents} right={rightContents} />

        <div className="flex my-3 gap-3">
          <div className="flex-1 bg-[#f9fafb] border-1 border-[#e5e7eb] p-2 rounded-md">
            <p>Total Employees</p>
            <p>{filteredEmployees.length}</p>
          </div>
          <div className="flex-1 bg-[#f9fafb] border-1 border-[#e5e7eb] p-2 rounded-md">
            <p>Present</p>
            <p>
              {filteredEmployees.filter((e) => e.status === "Present").length}
            </p>
          </div>
          <div className="flex-1 bg-[#f9fafb] border-1 border-[#e5e7eb] p-2 rounded-md">
            <p>Absent</p>
            <p>
              {filteredEmployees.filter((e) => e.status === "Absent").length}
            </p>
          </div>
          <div className="flex-1 bg-[#f9fafb] border-1 border-[#e5e7eb] p-2 rounded-md">
            <p>Average Hours</p>
            <p>
              {(
                filteredEmployees.reduce((acc, curr) => {
                  const hours = parseInt(curr.total_hours);
                  return acc + (isNaN(hours) ? 0 : hours);
                }, 0) / (filteredEmployees.length || 1)
              ).toFixed(1)}
              h
            </p>
          </div>
        </div>

        <DataTable
          ref={dt}
          value={filteredEmployees}
          paginator
          rows={10}
          globalFilter={globalFilter}
          showGridlines
          scrollable
        >
          <Column field="id" header="S.No" />
          <Column
            header="Employee Name"
            body={(rowData) => `${rowData.firstName} ${rowData.lastName}`}
          />
          <Column
            field="date"
            header="Date"
            body={(rowData) =>
              new Date(rowData.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            }
          />

          <Column
            field="punch_in_time"
            header="Punch In"
            body={(rowData) =>
              new Date(rowData.punch_in_time).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })
            }
          />

          <Column
            field="punch_out_time"
            header="Punch Out"
            body={(rowData) =>
              new Date(rowData.punch_out_time).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })
            }
          />
          <Column field="total_hours" header="Total Hours" />
          <Column field="status" header="Status" />
        </DataTable>
      </div>
    </div>
  );
};

export default OverallEmployeeAttendance;
