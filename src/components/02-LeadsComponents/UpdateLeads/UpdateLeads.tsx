import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Editor } from "primereact/editor";
import React from "react";

interface LeadDetailsProps {
  data: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    eventType: string;
    leadSource: string;
    budget?: string;
    notes?: string;
    status: string;
    doorNo: string;
    street: string;
    city: string;
    state: string;
    country: string;
  };
}

const UpdateLeads: React.FC<LeadDetailsProps> = ({ data }) => {
  console.log("data", data);
  const followUpsOption = [
    { label: "Follow Up 1", value: "wedding" },
    { label: "Follow Up 2", value: "engagement" },
    { label: "Follow Up 3", value: "birthday" },
    { label: "Booked", value: "corporate" },
    { label: "DND", value: "other" },
    { label: "In Discussion", value: "other" },
    { label: "Proposal Sent", value: "other" },
    { label: "Negotation", value: "other" },
    { label: "Closed", value: "other" },
  ];
  return (
    <div className="px-1">
      <p>Leads Update</p>
      <div className="border-1 p-2 rounded-lg mt-3">
        <div className="flex gap-3">
          <div className="flex flex-1 flex-column gap-2">
            <label>Follow Up</label>
            <Dropdown
              options={followUpsOption}
              placeholder="Select Event Type"
              className="p-inputtext-sm"
              // value={formData.eventType}
              // onChange={(e) => handleChange("eventType", e.value)}
            />
          </div>
          <div className="flex flex-1 flex-column gap-2">
            <label>First Name</label>
            <Calendar
              className="p-inputtext-sm"
              placeholder="Choose Next Date & Time"
              showTime
              hourFormat="24"
              // value={formData.firstName}
              // onChange={(e) => handleChange("firstName", e.target.value)}
            />
          </div>{" "}
        </div>

        <div className="mt-3">
          <p>Interaction Summary</p>
          <Editor
            // value={formData.notes}
            // onTextChange={(e) => handleChange("notes", e.htmlValue ?? "")}
            style={{ height: "220px" }}
            placeholder="Brief overview of the interaction"
          />
        </div>
        <div className="buttonActions gap-3 flex mt-3 justify-end">
          <Button
            icon="pi pi-times"
            label="Clear"
            outlined
            className="w-[10rem]"
            // onClick={handleClear}
          />
          <Button
            icon="pi pi-save"
            label="Update"
            className="w-[10rem]"
            // onClick={handleSave}
          />
        </div>
      </div>
    </div>
  );
};

export default UpdateLeads;
