import React, { useEffect, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import type { DataTableFilterMeta } from "primereact/datatable";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LeadDetails from "../LeadDetails/LeadDetails";
import UpdateLeads from "../UpdateLeads/UpdateLeads";
import SecondaryHeader from "../../02-SecondaryHeader/SecondaryHeader";
import AddNewLeads from "../AddNewLeads/AddNewLeads";
import BulkUpdateLeads from "../BulkUpdateLeads/BulkUpdateLeads";

interface Customer {
  budget: string;
  city: string;
  country: string;
  doorNo: string;
  email: string;
  eventType: string;
  firstName: string;
  id: number;
  lastName: string;
  leadSource: string;
  mobile: string;
  notes: string;
  state: string;
  status: string;
  street: string;
}

const ViewLeads: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
  const navigate = useNavigate();
  console.log("navigate", navigate);

  const [viewDetailsSidebar, setViewDetailsSidebar] = useState(false);
  const [updateLeadDetailsSidebar, setUpdateLeadDetailsSidebar] =
    useState(false);

  // ✅ new sidebars
  const [addLeadSidebar, setAddLeadSidebar] = useState(false);
  const [bulkUpdateSidebar, setBulkUpdateSidebar] = useState(false);

  const [leadDetails, setLeadDetails] = useState<Customer | null>(null);

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    leadSource: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

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

  const selectionCount = selectedCustomers.length;
  const isAddDisabled = selectionCount > 0;
  const isSingleSelected = selectionCount === 1;

  // ✅ Toolbar buttons
  const rightToolbarTemplate = () => (
    <div className="flex gap-2">
      {/* ✅ Modified Add button to open sidebar instead of navigate */}
      <Button
        label="Add"
        icon="pi pi-plus"
        severity="success"
        disabled={isAddDisabled}
        onClick={() => setAddLeadSidebar(true)}
      />

      <Button
        label="Bulk Update"
        icon="pi pi-upload"
        severity="secondary"
        disabled={isAddDisabled}
        onClick={() => setBulkUpdateSidebar(true)}
      />

      <Button
        label="Details"
        icon="pi pi-eye"
        severity="info"
        disabled={!isSingleSelected}
        onClick={() => {
          if (isSingleSelected) {
            setLeadDetails(selectedCustomers[0]);
            setViewDetailsSidebar(true);
          }
        }}
      />

      <Button
        label="Update Events"
        icon="pi pi-refresh"
        severity="warning"
        disabled={!isSingleSelected}
        onClick={() => {
          if (isSingleSelected) {
            setLeadDetails(selectedCustomers[0]);
            setUpdateLeadDetailsSidebar(true);
          }
        }}
      />

      <Button
        label="Update Lead Details"
        icon="pi pi-refresh"
        severity="warning"
        disabled={!isSingleSelected}
        onClick={() => {
          if (isSingleSelected) {
            setLeadDetails(selectedCustomers[0]);
            setUpdateLeadDetailsSidebar(true);
          }
        }}
      />

      <Button
        label="Delete"
        icon="pi pi-trash"
        severity="danger"
        disabled={selectionCount === 0}
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
      <div className="text-sm text-gray-600 line-clamp-1">{row.eventType}</div>
    </div>
  );

  // Fetch leads from backend API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_URL + "/leads/getAll"
        );
        if (res.data.success) {
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
        }
      } catch (err) {
        console.error("Error fetching leads:", err);
      }
    };
    fetchLeads();
  }, []);

  return (
    <div>
      <SecondaryHeader title="View Leads" />
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
          <Column
            field="status"
            header="Status"
            filterField="status"
            style={{ minWidth: "10rem" }}
            body={(row) => (
              <Tag value={row.status} severity={getSeverity(row.status)} />
            )}
          />
        </DataTable>

        {/* ✅ Sidebars */}
        <Sidebar
          visible={viewDetailsSidebar}
          position="right"
          onHide={() => setViewDetailsSidebar(false)}
          style={{ width: "80vw" }}
        >
          {leadDetails && <LeadDetails data={leadDetails} />}
        </Sidebar>

        <Sidebar
          visible={updateLeadDetailsSidebar}
          position="right"
          onHide={() => setUpdateLeadDetailsSidebar(false)}
          style={{ width: "80vw" }}
        >
          {leadDetails && <UpdateLeads data={leadDetails} />}
        </Sidebar>

        {/* ✅ Add Lead Sidebar */}
        <Sidebar
          visible={addLeadSidebar}
          position="right"
          header="Add New Lead"
          onHide={() => setAddLeadSidebar(false)}
          style={{ width: "80vw" }}
        >
          <AddNewLeads onClose={() => setAddLeadSidebar(false)} />
        </Sidebar>

        {/* ✅ Bulk Update Sidebar */}
        <Sidebar
          visible={bulkUpdateSidebar}
          position="right"
          header="Bulk Update Leads"
          onHide={() => setBulkUpdateSidebar(false)}
          style={{ width: "80vw" }}
        >
          <BulkUpdateLeads onClose={() => setBulkUpdateSidebar(false)} />
        </Sidebar>
      </div>
    </div>
  );
};

// Helper for severity
const getSeverity = (status: string) => {
  switch (status.toLowerCase()) {
    case "lost":
      return "danger";
    case "booked":
      return "success";
    case "new":
      return "info";
    case "awaiting reply":
      return "warning";
    case "contacted":
      return "secondary";
    case "proposal sent":
      return "info";
    default:
      return null;
  }
};

export default ViewLeads;
