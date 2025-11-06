import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import {
  getAllRequests,
  updateRequestStatus,
} from "./EmployeeLeaveReq.function";

const EmployeeLeaveReq: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const result = await getAllRequests();
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
    fetchRequests();
  }, []);

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "-";
    const date = new Date(timeStr);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const actionBodyTemplate = (rowData: any) => {
    const disabled = rowData.status !== "pending";

    return (
      <div className="flex gap-2">
        <Button
          label="Approve"
          className="p-button-success p-button-sm"
          onClick={() => handleAction(rowData.id, "approved")}
          disabled={disabled}
        />
        <Button
          label="Reject"
          className="p-button-danger p-button-sm"
          onClick={() => handleAction(rowData.id, "rejected")}
          disabled={disabled}
        />
      </div>
    );
  };

  const handleAction = async (id: number, action: "approved" | "rejected") => {
    try {
      const result = await updateRequestStatus(id, action);
      console.log("result", result);
      if (result.success) {
        setRequests((prev) =>
          prev.map((req) => (req.id === id ? { ...req, status: action } : req))
        );
      }
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  const capitalize = (text: string) => {
    if (!text) return "-";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <div>
      <div className="p-3 rounded-lg shadow-lg">
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
          <Column header="Type" body={(row) => capitalize(row.type)} />
          <Column header="From Time" body={(row) => formatTime(row.fromTime)} />
          <Column header="To Time" body={(row) => formatTime(row.toTime)} />
          <Column header="Status" body={(row) => capitalize(row.status)} />
          <Column header="Actions" body={actionBodyTemplate} />
        </DataTable>
      </div>
    </div>
  );
};

export default EmployeeLeaveReq;
