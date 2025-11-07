import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import axios from "axios";
import SecondaryHeader from "../../components/02-SecondaryHeader/SecondaryHeader";

interface QuotationPackage {
  quotation_package_id: number;
  service_name: string;
  description: string;
  quantity: number;
  price: number;
  created_at: string;
}

interface ApprovalQuotation {
  lead_id: number;
  full_name: string;
  email: string;
  phone_number: string;
  wedding_type: string;
  package_name: string;
  wedding_location: string;

  event_id: number;
  event_name: string;
  event_date: string;

  payment_amount: string;
  payment_type: string;
  total_package_amount: string;

  approval_status: string;

  packages: QuotationPackage[];
}

const Approval: React.FC = () => {
  const [quotations, setQuotations] = useState<ApprovalQuotation[]>([]);
  const [selectedQuotation, setSelectedQuotation] =
    useState<ApprovalQuotation | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    const fetchApprovalData = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_URL + "/quotation/approvalAll"
        );
        if (res.data.success) {
          console.log("res", res);
          setQuotations(res.data.data);
        } else {
          toast.current?.show({
            severity: "warn",
            summary: "No Data",
            detail: "No quotations found",
            life: 3000,
          });
        }
      } catch (err) {
        console.error(err);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch quotations",
          life: 3000,
        });
      }
    };

    fetchApprovalData();
  }, []);

  const handleRowSelect = (rowData: ApprovalQuotation) => {
    setSelectedQuotation(rowData);
    setSidebarVisible(true);
  };

  const handleSendToClient = async () => {
    if (!selectedQuotation) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/quotation/send-to-client/${
          selectedQuotation.lead_id
        }`
      );

      if (res.data.success) {
        toast.current?.show({
          severity: "success",
          summary: "Sent",
          detail: `Quotation sent to ${selectedQuotation.full_name}`,
          life: 3000,
        });
      } else {
        toast.current?.show({
          severity: "warn",
          summary: "Failed",
          detail: res.data.message || "Could not send quotation",
          life: 3000,
        });
      }
    } catch (err) {
      console.error("Error sending quotation:", err);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to send quotation to client",
        life: 3000,
      });
    }
  };

  const formatINR = (amount: number | string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(amount));
  };

  return (
    <div>
      <Toast ref={toast} />
      <SecondaryHeader title="Approval" />

      <div className="mt-3">
        <DataTable
          value={quotations}
          paginator
          rows={5}
          scrollable
          showGridlines
          selectionMode="single"
          selection={selectedQuotation}
          onSelectionChange={(e: any) => handleRowSelect(e.value)}
          emptyMessage="No quotations found."
        >
          <Column selectionMode="single" headerStyle={{ width: "3rem" }} />
          <Column header="S.No" body={(_, { rowIndex }) => rowIndex + 1} />
          <Column
            field="full_name"
            header="Lead Name"
            style={{ minWidth: "15rem" }}
          />
          <Column field="email" header="Email" style={{ minWidth: "15rem" }} />
          <Column
            field="phone_number"
            header="Mobile"
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="event_name"
            header="Event Name"
            style={{ minWidth: "15rem" }}
          />
          <Column
            field="approval_status"
            header="Approval Status"
            style={{ minWidth: "12rem" }}
          />
        </DataTable>
      </div>

      {/* Sidebar */}
      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        position="right"
        style={{ width: "40vw" }}
        header="Quotation Details"
      >
        {selectedQuotation && (
          <div className="space-y-2">
            <div>
              <strong>Lead Name:</strong> {selectedQuotation.full_name}
            </div>
            <div>
              <strong>Email:</strong> {selectedQuotation.email}
            </div>
            <div>
              <strong>Mobile:</strong> {selectedQuotation.phone_number}
            </div>
            <div>
              <strong>Wedding Type:</strong> {selectedQuotation.wedding_type}
            </div>
            <div>
              <strong>Event Name:</strong> {selectedQuotation.event_name}
            </div>
            <div>
              <strong>Event Date:</strong>{" "}
              {new Date(selectedQuotation.event_date).toLocaleString()}
            </div>
            <div>
              <strong>Packages:</strong>
              <ul className="list-disc pl-5">
                {selectedQuotation.packages?.map((pkg) => (
                  <li key={pkg.quotation_package_id}>
                    {pkg.service_name} ({pkg.quantity} x {formatINR(pkg.price)})
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Total Package Amount:</strong>{" "}
              {formatINR(selectedQuotation.total_package_amount)}
            </div>
            <div>
              <strong>Approval Status:</strong>{" "}
              {selectedQuotation.approval_status}
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                label="Approve & Send to Client"
                icon="pi pi-envelope"
                onClick={handleSendToClient}
              />
            </div>
          </div>
        )}
      </Sidebar>
    </div>
  );
};

export default Approval;
