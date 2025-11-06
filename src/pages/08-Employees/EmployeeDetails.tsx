import React, { useEffect, useRef, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";

import type { DataTableFilterMeta } from "primereact/datatable";
// import { useNavigate } from "react-router-dom";
import AddNewEmployees from "../../components/10-EmployeesComponents/AddNewEmployees/AddNewEmployees";
import { CalendarCheck, Eye, Plus, Trash2 } from "lucide-react";
import Attendance from "../../components/10-EmployeesComponents/Attendance/Attendance";
import { getEmployees, deleteEmployee } from "./EmployeeDetails.function";

import type { Employee } from "./EmployeeDetails.interface";

const EmployeeDetails: React.FC = () => {
  // const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const [selectedCustomers, setSelectedCustomers] = useState<Employee[]>([]);
  const [addEmployeeSidebar, setAddEmployeeSidebar] = useState(false);
  const [employeeAttendanceSidebar, setEmployeeAttendanceSidebar] =
    useState(false);
  const [viewDetailsSidebar, setViewDetailsSidebar] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    leadSource: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      // Add fullName field
      const dataWithFullName = data.map((emp) => ({
        ...emp,
        fullName: `${emp.firstName} ${emp.lastName}`,
      }));
      setEmployees(dataWithFullName);
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 3000,
      });
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [addEmployeeSidebar, viewDetailsSidebar]);

  // ✅ Delete selected employees
  const handleDelete = async () => {
    try {
      for (const emp of selectedCustomers) {
        await deleteEmployee(emp.id);
      }
      toast.current?.show({
        severity: "success",
        summary: "Deleted",
        detail: `${selectedCustomers.length} employee(s) deleted successfully`,
        life: 3000,
      });
      setSelectedCustomers([]);
      fetchEmployees();
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 3000,
      });
    }
  };

  const onGlobalFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFilters((prev) => ({
      ...prev,
      global: { ...prev.global, value },
    }));
  };

  const selectionCount = selectedCustomers.length;
  const isAddDisabled = selectionCount > 0;
  const isSingleSelected = selectionCount === 1;

  const rightToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button
        label="Add"
        icon={<Plus />}
        severity="success"
        className="gap-2"
        disabled={isAddDisabled}
        onClick={() => setAddEmployeeSidebar(true)}
      />
      <Button
        label="Update"
        icon={<Eye />}
        severity="info"
        className="gap-2"
        disabled={!isSingleSelected}
        onClick={() => {
          if (isSingleSelected) {
            setEditEmployee(selectedCustomers[0]);
            setViewDetailsSidebar(true);
          }
        }}
      />
      <Button
        label="Attendance"
        hidden
        icon={<CalendarCheck />}
        severity="warning"
        disabled={!isSingleSelected}
        onClick={() => setEmployeeAttendanceSidebar(true)}
      />
      <Button
        label="Delete"
        className="gap-2"
        icon={<Trash2 />}
        severity="danger"
        disabled={selectionCount === 0}
        onClick={handleDelete}
      />
    </div>
  );

  const header = (
    <div className="flex gap-3">
      <div className="flex-1">
        <IconField iconPosition="left" className="w-full">
          <InputIcon className="pi pi-search" />
          <InputText
            type="search"
            value={(filters["global"] as any)?.value || ""}
            onChange={onGlobalFilterChange}
            placeholder="Global Search"
          />
        </IconField>
      </div>
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />

      <div className="">
        <Toolbar right={rightToolbarTemplate} />
        <DataTable
          value={employees}
          paginator
          scrollable
          rows={5}
          rowsPerPageOptions={[5, 10, 25]}
          header={header}
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
          globalFilterFields={["fullName", "email", "mobile", "salesType"]}
          selection={selectedCustomers}
          onSelectionChange={(e) => setSelectedCustomers(e.value as Employee[])}
          selectionMode="multiple"
          dataKey="id"
          showGridlines
          className="mt-3 p-datatable-sm"
          emptyMessage="No employees found."
        >
          <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
          <Column
            header="S.No"
            body={(_, { rowIndex }) => rowIndex + 1}
            style={{ minWidth: "4rem" }}
          />
          <Column
            header="Employee Name"
            field="fullName" // use fullName here
            style={{ minWidth: "18rem" }}
          />
          <Column
            field="email"
            header="Email"
            sortable
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="mobile"
            header="Mobile"
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="salesType"
            header="Sales Type"
            style={{ minWidth: "12rem", textTransform: "capitalize" }}
          />
        </DataTable>
      </div>

      <Sidebar
        visible={addEmployeeSidebar}
        position="right"
        header="Add New Employee Details"
        style={{ width: "80vw" }}
        onHide={() => setAddEmployeeSidebar(false)}
      >
        <AddNewEmployees
          onSuccess={() => {
            setAddEmployeeSidebar(false);
            setSelectedCustomers([]);
            fetchEmployees();
            toast.current?.show({
              severity: "success",
              summary: "Success",
              detail: "Employee added successfully",
              life: 3000,
            });
          }}
        />
      </Sidebar>

      <Sidebar
        visible={viewDetailsSidebar}
        position="right"
        header="Update Employee Details"
        style={{ width: "80vw" }}
        onHide={() => setViewDetailsSidebar(false)}
      >
        <AddNewEmployees
          initialData={editEmployee}
          onSuccess={() => {
            setViewDetailsSidebar(false);
            setSelectedCustomers([]);
            fetchEmployees();
            toast.current?.show({
              severity: "success",
              summary: "Updated",
              detail: "Employee updated successfully",
              life: 3000,
            });
          }}
        />
      </Sidebar>

      <Sidebar
        visible={employeeAttendanceSidebar}
        position="right"
        header="Employee Attendance"
        style={{ width: "80vw" }}
        onHide={() => setEmployeeAttendanceSidebar(false)}
      >
        <Attendance />
      </Sidebar>
    </div>
  );
};

export default EmployeeDetails;
