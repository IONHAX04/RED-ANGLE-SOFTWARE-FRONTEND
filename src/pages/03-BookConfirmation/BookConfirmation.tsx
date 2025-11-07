import React, { useEffect, useState, useRef } from "react";
import { Toolbar } from "primereact/toolbar";
import { DataTable, type DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import SecondaryHeader from "../../components/02-SecondaryHeader/SecondaryHeader";
import BookConfirmationComponents from "../../components/05-BookConfirmationComponents/BookConfirmationComponents";

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

const BookConfirmation: React.FC = () => {
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
  const [assignSidebar, setAssignSidebar] = useState(false);
  const [leadDetails, setLeadDetails] = useState<Customer | null>(null);
  const toast = useRef<Toast>(null);

  const onGlobalFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFilters((prev) => ({ ...prev, global: { ...prev.global, value } }));
  };

  const onStatusFilterChange = (value: string | null) => {
    setFilters((prev) => ({ ...prev, status: { ...prev.status, value } }));
  };

  const onLeadSourceFilterChange = (value: string | null) => {
    setFilters((prev) => ({
      ...prev,
      leadSource: { ...prev.leadSource, value },
    }));
  };

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    leadSource: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem("leads");
    if (storedData) {
      try {
        const parsed: Customer[] = JSON.parse(storedData);
        const updated = parsed.map((lead, index) => ({
          ...lead,
          id: index + 1,
          status: lead.status || "New",
        }));
        setCustomers(updated);
      } catch (err) {
        console.error("Error parsing leads:", err);
      }
    }
  }, []);

  //   const handleAssignEmployees = (employees: any[]) => {
  //     console.log("employees", employees);

  //     toast.current?.show({
  //       severity: "success",
  //       summary: "Success",
  //       detail: "Leads assigned",
  //       life: 3000,
  //     });
  //   };

  const rightToolbarTemplate = () => {
    const selectionCount = selectedCustomers.length;
    return (
      <div className="flex gap-2">
        <Button
          label="Update"
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
      <div className="flex-1">
        <Dropdown
          value={(filters["status"] as any)?.value || null}
          options={[
            "New",
            "Contacted",
            "Booked",
            "Lost",
            "Awaiting Reply",
            "Proposal sent",
          ]}
          placeholder="All Status"
          className="w-full"
          onChange={(e) => onStatusFilterChange(e.value)}
          showClear
        />
      </div>
      <div className="flex-1">
        <Dropdown
          value={(filters["leadSource"] as any)?.value || null}
          options={[
            { label: "Instagram", value: "Instagram" },
            { label: "LinkedIn", value: "Linkedin" },
            { label: "Facebook", value: "Facebook" },
            { label: "Referral", value: "Referral" },
            { label: "Other", value: "other" },
          ]}
          optionLabel="label"
          optionValue="value"
          className="w-full"
          placeholder="All Sources"
          onChange={(e) => onLeadSourceFilterChange(e.value)}
          showClear
        />
      </div>
      <div className="flex-1">
        <Calendar placeholder="Booking Date" className="w-full" />
      </div>
    </div>
  );

  const nameTemplate = (row: Customer) => (
    <div>
      <div className="font-bold">
        {row.firstName} {row.lastName}
      </div>
      <div className="text-sm text-gray-600 line-clamp-1">
        {row.eventType}
        {/* {row.doorNo}, {row.street}, {row.city}, {row.state},{" "} */}
        {/* {row.country} */}
      </div>
    </div>
  );

  // Fetch leads from backend API

  const fetchLeads = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_URL + "/leads/assigned"
      );
      if (res.data.success) {
        // Map API data to Customer interface
        const data = res.data.data.map((lead: any) => ({
          id: lead.id,
          firstName: lead.full_name.split(" ")[0] || "",
          lastName: lead.full_name.split(" ").slice(1).join(" ") || "",
          email: lead.email,
          mobile: lead.phone_number,
          eventType: lead.wedding_type,
          leadSource: lead.lead_source || "Other",
          budget: lead.package || undefined,
          notes: lead.notes || "",
          status: lead.status || "New",
          country: lead.country || "",
          doorNo: lead.door_no || "",
          street: lead.street || "",
          city: lead.city || "",
          state: lead.state || "",
        }));
        setCustomers(data);
        console.log("data", data);
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    }
  };
  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div>
      <Toast ref={toast} />
      <SecondaryHeader title="Book Confirmation" />
      <div className="mt-3">
        <Toolbar right={rightToolbarTemplate} />
        <DataTable
          value={customers}
          paginator
          dataKey="id"
          scrollable
          rows={5}
          rowsPerPageOptions={[5, 10, 25]}
          header={header}
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
          <Column field="budget" header="Budget" style={{ minWidth: "7rem" }} />
          <Column
            field="leadSource"
            header="Lead Source"
            filterField="leadSource"
            style={{ minWidth: "12rem" }}
          />
        </DataTable>
      </div>

      <Sidebar
        visible={assignSidebar}
        position="right"
        header="Book Confirmation"
        onHide={() => setAssignSidebar(false)}
        style={{ width: "80vw" }}
      >
        {leadDetails && (
          <BookConfirmationComponents
            onClose={() => {
              fetchLeads();
              setAssignSidebar(false);
            }}
            leadId={leadDetails.id} // 👈 pass leadId here
          />
        )}
      </Sidebar>
    </div>
  );
};

export default BookConfirmation;
