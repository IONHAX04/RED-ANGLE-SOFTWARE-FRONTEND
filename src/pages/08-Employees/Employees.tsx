import React from "react";
import SecondaryHeader from "../../components/02-SecondaryHeader/SecondaryHeader";
import { TabPanel, TabView } from "primereact/tabview";

const Employees: React.FC = () => {
  return (
    <div>
      <SecondaryHeader title="Employees" />
      <div className="flex mt-3">
        <TabView>
          <TabPanel header="Employee Details">
            <p className="m-0">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </TabPanel>
          <TabPanel header="Attendance"></TabPanel>
          <TabPanel header="Leave Request"></TabPanel>
        </TabView>
      </div>
    </div>
  );
};

export default Employees;
