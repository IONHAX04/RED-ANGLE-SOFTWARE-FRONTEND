import React from "react";
import SecondaryHeader from "../../components/02-SecondaryHeader/SecondaryHeader";
import { TabPanel, TabView } from "primereact/tabview";
import EmployeeDetails from "./EmployeeDetails";
import OverallEmployeeAttendance from "../../components/10-EmployeesComponents/OverallEmployeeAttendance/OverallEmployeeAttendance";
import EmployeeLeaveReq from "../../components/10-EmployeesComponents/EmployeeLeaveReq/EmployeeLeaveReq";

const Employees: React.FC = () => {
  return (
    <div>
      <SecondaryHeader title="Employees" />
      <div className="flex mt-3">
        <TabView>
          <TabPanel header="Employee Details">
            <EmployeeDetails />
          </TabPanel>
          <TabPanel header="Attendance">
            <OverallEmployeeAttendance />
          </TabPanel>
          <TabPanel header="Leave Request">
            <EmployeeLeaveReq />
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};

export default Employees;
