import React, { useEffect, useState } from "react";
import { Toolbar } from "primereact/toolbar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import RequestPermission from "../../components/13-LeaveRequestRaise/RequestPermission";
import RequestLeave from "../../components/13-LeaveRequestRaise/RequestLeave";
import { getAllRequests } from "./LeaveRequest.function";
import SecondaryHeader from "../../components/02-SecondaryHeader/SecondaryHeader";

const LeaveReq: React.FC = () => {
  const [requestPermission, setRequestPermission] = useState(false);
  const [requestLeave, setRequestLeave] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  // Get userId from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("userDetails");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserId(parsed.userId);
    }
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const result = await getAllRequests(userId); // pass userId to backend
      if (result.success) {
        setRequests(result.data);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchRequests(); // fetch only after userId is loaded
  }, [userId]);

  const rightToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button
        label="Request Permission"
        icon="pi pi-clock"
        className="p-button-outlined p-button-sm"
        onClick={() => setRequestPermission(true)}
      />
      <Button
        label="Request Leave"
        icon="pi pi-calendar"
        className="p-button-sm"
        onClick={() => setRequestLeave(true)}
      />
    </div>
  );

  return (
    <div>
      <SecondaryHeader title="Leave Request" />

      <div className="mt-3 p-3 rounded-lg shadow-lg">
        <Toolbar right={rightToolbarTemplate} />

        <DataTable
          value={requests}
          loading={loading}
          showGridlines
          scrollable
          className="mt-3"
        >
          <Column
            header="S.No"
            body={(_, options) => options.rowIndex + 1}
            style={{ width: "70px" }}
          />
          <Column
            header="Date"
            body={(row) =>
              row.date
                ? new Date(row.date).toLocaleDateString()
                : row.fromDate
                ? `${new Date(row.fromDate).toLocaleDateString()} - ${new Date(
                    row.toDate
                  ).toLocaleDateString()}`
                : "-"
            }
          />
          <Column
            header="Details"
            body={(row) => row.reason || row.description || "-"}
          />
          <Column header="Type" field="type" />
          <Column header="From Time" field="fromTime" />
          <Column header="To Time" field="toTime" />
          <Column header="Status" field="status" />
        </DataTable>
      </div>

      <Sidebar
        visible={requestPermission}
        position="right"
        style={{ width: "70vw" }}
        header="Request Permission"
        onHide={() => setRequestPermission(false)}
      >
        {userId && (
          <RequestPermission onSuccess={fetchRequests} initialData={userId} />
        )}
      </Sidebar>

      <Sidebar
        visible={requestLeave}
        position="right"
        style={{ width: "70vw" }}
        header="Request Leave"
        onHide={() => setRequestLeave(false)}
      >
        {userId && <RequestLeave onSuccess={fetchRequests} />}
      </Sidebar>
    </div>
  );
};

export default LeaveReq;
