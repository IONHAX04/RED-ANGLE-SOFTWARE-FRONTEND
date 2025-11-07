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

interface QuotationLead {
  lead_id: number;
  full_name: string;
  email: string;
  phone_number: string;
  wedding_type: string;
  package: string;
  wedding_location: string;
  event_dates: number[];

  event_id: number;
  event_name: string;
  date_time: string;
  highlights: string;
  event_notes: string;
  event_created_at: string;

  payment_id: number;
  payment_type: string;
  payment_amount: string;
  payment_date: string;
  payment_notes: string;
  payment_created_at: string;

  packages: QuotationPackage[];
  total_package_amount: string;
}

const Invoice: React.FC = () => {
  const [quotationLeads, setQuotationLeads] = useState<QuotationLead[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<QuotationLead[]>([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    const fetchQuotationLeads = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_URL + "/leads/quotation-created"
        );

        if (res.data.success) {
          setQuotationLeads(res.data.data);
        } else {
          toast.current?.show({
            severity: "warn",
            summary: "No Data",
            detail: "No quotation leads found",
            life: 3000,
          });
        }
      } catch (err) {
        console.error("Error fetching quotation leads:", err);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch quotation leads",
          life: 3000,
        });
      }
    };

    fetchQuotationLeads();
  }, []);

  const eventDateTemplate = (row: QuotationLead) => {
    const date = new Date(row.date_time);
    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const leadTemplate = (row: QuotationLead) => (
    <div>
      <div className="font-bold">{row.full_name}</div>
      <div className="text-sm text-gray-600">{row.wedding_type}</div>
    </div>
  );

  const packageTemplate = (row: QuotationLead) => (
    <ul className="list-disc pl-5">
      {row.packages.map((pkg) => (
        <li key={pkg.quotation_package_id}>
          {pkg.service_name} ({pkg.quantity} x ${pkg.price})
        </li>
      ))}
    </ul>
  );

  const handleViewClick = () => {
    if (selectedLeads.length === 1) {
      setSidebarVisible(true);
    }
  };

  const handleSendForApproval = async () => {
    if (selectedLeads.length !== 1) return;

    try {
      const lead = selectedLeads[0];
      await axios.post(
        import.meta.env.VITE_API_URL + "/quotation/send-approval",
        {
          lead_id: lead.lead_id,
          event_id: lead.event_id,
        }
      );

      toast.current?.show({
        severity: "success",
        summary: "Sent for Approval",
        detail: `Quotation sent for approval for ${lead.full_name}`,
        life: 3000,
      });

      // Optionally, refresh the leads table to show status
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to send for approval",
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
    <div className="">
      <Toast ref={toast} />
      <SecondaryHeader title="Invoice" />
      <div className="mt-3">
        {/* Toolbar */}
        <div className="mb-3 flex justify-end">
          <Button
            label="View"
            icon="pi pi-eye"
            disabled={selectedLeads.length !== 1}
            onClick={handleViewClick}
          />
        </div>

        <DataTable
          value={quotationLeads}
          paginator
          rows={5}
          scrollable
          showGridlines
          selectionMode="multiple"
          selection={selectedLeads}
          onSelectionChange={(e) => setSelectedLeads(e.value)}
          className="shadow-md rounded-lg"
          emptyMessage="No quotation leads found."
        >
          <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
          <Column header="S.No" body={(_, { rowIndex }) => rowIndex + 1} />
          <Column
            header="Lead Details"
            body={leadTemplate}
            style={{ minWidth: "18rem" }}
          />
          <Column field="email" header="Email" style={{ minWidth: "18rem" }} />
          <Column
            field="phone_number"
            header="Mobile"
            style={{ minWidth: "18rem" }}
          />
          <Column
            field="wedding_location"
            header="Wedding Location"
            style={{ minWidth: "18rem" }}
          />
          <Column
            field="event_name"
            header="Event Name"
            style={{ minWidth: "18rem" }}
          />
          <Column
            field="date_time"
            header="Event Date"
            body={eventDateTemplate}
            style={{ minWidth: "18rem" }}
          />
          <Column
            field="payment_amount"
            header="Amount Paid"
            style={{ minWidth: "10rem" }}
          />
          <Column
            header="Packages"
            body={packageTemplate}
            style={{ minWidth: "20rem" }}
          />
          <Column
            field="total_package_amount"
            header="Total Package Amount"
            style={{ minWidth: "10rem" }}
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
        {selectedLeads.length === 1 && (
          <div className="space-y-2">
            <div>
              <strong>Lead Name:</strong> {selectedLeads[0].full_name}
            </div>
            <div>
              <strong>Email:</strong> {selectedLeads[0].email}
            </div>
            <div>
              <strong>Mobile:</strong> {selectedLeads[0].phone_number}
            </div>
            <div>
              <strong>Wedding Type:</strong> {selectedLeads[0].wedding_type}
            </div>
            <div>
              <strong>Event Name:</strong> {selectedLeads[0].event_name}
            </div>
            <div>
              <strong>Event Date:</strong> {eventDateTemplate(selectedLeads[0])}
            </div>
            <div>
              <strong>Packages:</strong>
              <ul className="list-disc pl-5">
                {selectedLeads[0].packages.map((pkg) => (
                  <li key={pkg.quotation_package_id}>
                    {pkg.service_name} ({pkg.quantity} x {formatINR(pkg.price)})
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Total Package Amount:</strong>{" "}
              {formatINR(selectedLeads[0].total_package_amount)}
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                label="Send For Approval"
                icon="pi pi-envelope"
                onClick={handleSendForApproval}
              />
            </div>
          </div>
        )}
      </Sidebar>
    </div>
  );
};

export default Invoice;
