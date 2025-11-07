import React, { useRef, useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import * as XLSX from "xlsx";
import axios from "axios";
import { Toast } from "primereact/toast";

interface Lead {
  S_No: number;
  created_time: string;
  what_type_of_your_wedding: string;
  choose_your_package: string;
  enter_your_contact_number: string;
  enter_your_wedding_location: string;
  enter_event_date_month: string;
  Phone_number: string;
  E_mail: string;
  full_name: string;
  Lead_followed_by_Client: string;
  Status1?: string;
}
interface AddNewLeadsProps {
  onClose: () => void;
}

const BulkUpdateLeads: React.FC<AddNewLeadsProps> = ({ onClose }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toastRef = useRef<Toast>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const mappedData: Lead[] = jsonData.map((item) => ({
        S_No: item["S_No"] || "",
        created_time: item["created_time"] || "",
        what_type_of_your_wedding: item["what_type_of_your_wedding?"] || "",
        choose_your_package: item["choose_your_package?"] || "",
        enter_your_contact_number: item["enter_your_contact_number"] || "",
        enter_your_wedding_location: item["enter_your_wedding_location"] || "",
        enter_event_date_month: item["enter_event_date_&_month"] || "",
        Phone_number: item["Phone_number"] || "",
        E_mail: item["E_mail"] || "",
        full_name: item["full_name"] || "",
        Lead_followed_by_Client: item["Lead follwed by Client"] || "",
        Status1: item["Status 1"] || "",
      }));

      setLeads(mappedData);
    };
    reader.readAsBinaryString(file);
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleSaveLeads = async () => {
    if (leads.length === 0) {
      toastRef.current?.show({
        severity: "warn",
        summary: "No Data",
        detail: "Please upload Excel data first",
        life: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        import.meta.env.VITE_API_URL + "/leads/updateBulk",
        leads
      );

      if (res.data.success) {
        toastRef.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Leads updated successfully",
          life: 3000,
        });
        setLeads([]); // clear the table after success
        onClose();
      } else {
        toastRef.current?.show({
          severity: "error",
          summary: "Failed",
          detail: res.data.message || "Failed to update leads",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error saving leads", error);
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error saving leads",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toast ref={toastRef} />

      <div className="shadow-lg rounded-lg">
        <div className="flex justify-end my-3 gap-3">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <Button label="Upload Excel Sheet" onClick={triggerFileInput} />
          <Button
            label={loading ? "Saving..." : "Save Lead Data"}
            severity="success"
            onClick={handleSaveLeads}
            disabled={loading || leads.length === 0}
          />
        </div>

        <DataTable
          value={leads}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 25, 50]}
          showGridlines
          scrollable
          className="mt-3"
        >
          <Column field="S_No" header="S.No" style={{ minWidth: "4rem" }} />
          <Column
            field="full_name"
            header="Full Name"
            frozen
            style={{ minWidth: "10rem" }}
          />
          <Column
            field="Lead_followed_by_Client"
            header="Lead Followed By"
            frozen
            style={{ minWidth: "14rem" }}
          />
          <Column
            field="created_time"
            header="Created Time"
            style={{ minWidth: "10rem" }}
          />
          <Column
            field="what_type_of_your_wedding"
            header="Wedding Type"
            style={{ minWidth: "10rem" }}
          />
          <Column
            field="choose_your_package"
            header="Package"
            style={{ minWidth: "10rem" }}
          />
          <Column
            field="enter_your_contact_number"
            header="Contact Number"
            style={{ minWidth: "14rem" }}
          />
          <Column
            field="enter_your_wedding_location"
            header="Location"
            style={{ minWidth: "16rem" }}
          />
          <Column
            field="enter_event_date_month"
            header="Date"
            style={{ minWidth: "14rem" }}
          />
          <Column
            field="Phone_number"
            header="Phone"
            style={{ minWidth: "10rem" }}
          />
          <Column field="E_mail" header="Email" style={{ minWidth: "12rem" }} />
          <Column
            field="Status1"
            header="Status 1"
            style={{ minWidth: "10rem" }}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default BulkUpdateLeads;
