import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import axios from "axios";

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  secondaryMobile: string;
  doorNo: string;
  street: string;
  city: string;
  district: string;
  state: string;
  country: string;
  workLocation: string;
  salesType: string;
  availability: string;
  experience: string; // 👈 If you want strict typing, make it number instead
  skills: string[];
  portfolio: string;
  reason: string;
  createdAt: string; // ISO Date string
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
  isActive: "Y" | "N";
  isDelete: "Y" | "N";
}

const AssignLeadComponents: React.FC<{
  leads: any;
  onAssign: (employees: Employee[]) => void;
}> = ({ leads, onAssign }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          import.meta.env.VITE_API_URL + "/routes/employees"
        );
        console.log("res", res.data.data);
        if (res.data.success) {
          console.log("res.data.data", res.data.data);
          setEmployees(res.data.data);
        } else {
          console.error("Failed to fetch employees:", res.data.message);
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleAssign = () => {
    if (selectedEmployees.length === 0) {
      console.warn("⚠ No employees selected!");
      return;
    }
    onAssign(selectedEmployees);
  };

  return (
    <div className="">
      <div className="mb-3">
        <h3 className="font-bold mb-2">Assign employees to:</h3>
        <ul className="list-disc ml-5">
          {leads.map((lead:any) => (
            <li key={lead.id}>
              {lead.firstName} {lead.lastName} ({lead.email})
            </li>
          ))}
        </ul>
      </div>

      <DataTable
        value={employees}
        dataKey="id"
        selection={selectedEmployees}
        onSelectionChange={(e) => setSelectedEmployees(e.value as Employee[])}
        selectionMode="multiple"
        paginator
        rows={5}
        showGridlines
        loading={loading}
        className="mb-4"
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column
          header="S.No"
          body={(_, { rowIndex }) => rowIndex + 1}
          style={{ minWidth: "3rem" }}
        />
        <Column
          field="firstName"
          header="First Name"
          style={{ minWidth: "14rem" }}
        />
        <Column
          field="lastName"
          header="Last Name"
          style={{ minWidth: "14rem" }}
        />
        <Column field="email" header="Email" style={{ minWidth: "14rem" }} />
        <Column field="mobile" header="Mobile" style={{ minWidth: "14rem" }} />
        <Column field="city" header="City" style={{ minWidth: "14rem" }} />
        <Column field="state" header="State" style={{ minWidth: "14rem" }} />
        <Column
          field="workLocation"
          header="Work Location"
          style={{ minWidth: "14rem" }}
        />
      </DataTable>

      <div className="flex justify-end">
        <Button
          label="Assign"
          icon="pi pi-check"
          severity="success"
          onClick={handleAssign}
          disabled={employees.length === 0}
        />
      </div>
    </div>
  );
};

export default AssignLeadComponents;
