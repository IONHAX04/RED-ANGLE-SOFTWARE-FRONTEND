import React, { useEffect, useState, useRef } from "react";
import { Toolbar } from "primereact/toolbar";
import { DataTable, type DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import CreateQuotation from "../CreateQuotation/CreateQuotation";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import SecondaryHeader from "../../02-SecondaryHeader/SecondaryHeader";

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  eventType: string;
  leadSource: string;
  budget?: number | string;
  notes?: string;
  status?: string;
  country: string;
  doorNo: string;
  street: string;
  city: string;
  state: string;
}

const AddQuotation: React.FC = () => {
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
  const [assignSidebar, setAssignSidebar] = useState(false);
  const [leadDetails, setLeadDetails] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const toast = useRef<Toast>(null);

  // Filters for global + column-level
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    leadSource: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  // Fetch booked leads from API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_URL + "/leads/booked"
        );

        if (res.data.success) {
          console.log("res.data", res.data);
          // Normalize API response to Customer interface
          const data: Customer[] = res.data.data.map(
            (lead: any, index: number) => ({
              id: index + 1,
              firstName: lead.full_name?.split(".")[0] || "",
              lastName: lead.full_name?.split(".").slice(1).join(".") || "",
              email: lead.email || "",
              mobile: lead.phone_number || "",
              eventType: lead.wedding_type || "",
              leadSource: lead.lead_source || "Other",
              budget: lead.package || "",
              notes: lead.notes || "",
              status: lead.status || "Booked",

              // Additional mapped fields from booked event
              leadId: lead.lead_id,
              eventId: lead.event_id,
              eventName: lead.event_name,
              eventDateTime: lead.date_time,
              eventHighlights: lead.highlights,
              eventNotes: lead.event_notes,
              eventCreatedAt: lead.event_created_at,

              paymentId: lead.payment_id,
              paymentType: lead.payment_type,
              paymentAmount: lead.amount,
              paymentDate: lead.payment_date,
              paymentNotes: lead.payment_notes,
              paymentCreatedAt: lead.payment_created_at,

              // Address / location fields if exist
              country: lead.country || "",
              doorNo: lead.door_no || "",
              street: lead.street || "",
              city: lead.city || "",
              state: lead.state || "",
              weddingLocation: lead.wedding_location || "",
              eventDates: lead.event_dates || [],
            })
          );

          setCustomers(data);
        }
      } catch (err) {
        console.error("Error fetching leads:", err);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch leads",
          life: 3000,
        });
      }
    };

    fetchLeads();
  }, []);

  // Right side toolbar (Add button)
  const rightToolbarTemplate = () => {
    const selectionCount = selectedCustomers.length;
    return (
      <div className="flex gap-2">
        <Button
          label="Add"
          icon="pi pi-plus"
          severity="success"
          disabled={selectionCount !== 1}
          onClick={() => {
            if (selectionCount === 1) {
              setLeadDetails(selectedCustomers[0]);
              setAssignSidebar(true);
            }
          }}
        />
      </div>
    );
  };

  // Left side toolbar (Global Search)
  const leftToolbarTemplate = () => {
    return (
      <span className="p-input-icon-left">
        <InputText
          type="search"
          onInput={(e) =>
            setFilters({
              ...filters,
              global: {
                value: (e.target as HTMLInputElement).value,
                matchMode: FilterMatchMode.CONTAINS,
              },
            })
          }
          placeholder="Global Search"
        />
      </span>
    );
  };

  // Custom template for Name + Event type
  const nameTemplate = (row: Customer) => (
    <div>
      <div className="font-bold">
        {row.firstName} {row.lastName}
      </div>
      <div className="text-sm text-gray-600 line-clamp-1">{row.eventType}</div>
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      <SecondaryHeader title="Add Quotations" />

      <div className="mt-3">
        {/* Toolbar */}
        <Toolbar right={rightToolbarTemplate} left={leftToolbarTemplate} />

        {/* DataTable */}
        <DataTable
          value={customers}
          paginator
          dataKey="id"
          scrollable
          rows={5}
          rowsPerPageOptions={[5, 10, 25]}
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
          selection={selectedCustomers}
          onSelectionChange={(e) => setSelectedCustomers(e.value as Customer[])}
          selectionMode="multiple"
          showGridlines
          className="mt-3 p-datatable-sm"
          emptyMessage="No leads found."
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} leads"
        >
          <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
          <Column
            header="S.No"
            body={(_, { rowIndex }) => rowIndex + 1}
            style={{ minWidth: "4rem" }}
          />
          <Column
            header="Lead Details"
            body={nameTemplate}
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
            field="paymentAmount"
            header="Amount Paid"
            style={{ minWidth: "10rem" }}
          />
          <Column
            field="leadSource"
            header="Lead Source"
            filterField="leadSource"
            style={{ minWidth: "12rem" }}
          />
        </DataTable>

        {/* Sidebar for Quotation */}
        <Sidebar
          visible={assignSidebar}
          position="right"
          header="Quotation"
          onHide={() => setAssignSidebar(false)}
          style={{ width: "80vw" }}
        >
          {leadDetails && (
            <CreateQuotation
              lead={leadDetails}
              onClose={() => setAssignSidebar(false)}
            />
          )}
        </Sidebar>
      </div>
    </div>
  );
};

export default AddQuotation;
