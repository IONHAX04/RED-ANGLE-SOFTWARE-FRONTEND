import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import React, { useRef, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Editor } from "primereact/editor";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import axios from "axios";

interface AddNewLeadsProps {
  onClose: () => void;
}

const AddNewLeads: React.FC<AddNewLeadsProps> = ({ onClose }) => {
  const toast = useRef<Toast>(null);

  const eventTypes = [
    { label: "Wedding", value: "wedding" },
    { label: "Engagement", value: "engagement" },
    { label: "Birthday", value: "birthday" },
    { label: "Corporate", value: "corporate" },
    { label: "Other", value: "other" },
  ];

  const leadSources = [
    { label: "Instagram", value: "instagram" },
    { label: "LinkedIn", value: "linkedin" },
    { label: "Facebook", value: "facebook" },
    { label: "Referral", value: "referral" },
    { label: "Other", value: "other" },
  ];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    secondaryMobile: "",
    doorNo: "",
    street: "",
    city: "",
    district: "",
    state: "",
    country: "",
    eventType: "",
    leadSource: "",
    budget: "",
    eventDate: null as Date | null,
    advance: "",
    paymentDate: null as Date | null,
    notes: "",
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (formData.budget) {
      const budgetNum = Number(formData.budget);
      const advanceNum = Number(formData.advance);

      if (advanceNum > budgetNum) {
        toast.current?.show({
          severity: "warn",
          summary: "Validation Error",
          detail: `Advance cannot exceed budget (${budgetNum})`,
          life: 3000,
        });
        return; // Stop further processing
      }
    }

    if (
      formData.eventDate &&
      new Date(formData.eventDate) < new Date(new Date().setHours(0, 0, 0, 0))
    ) {
      toast.current?.show({
        severity: "warn",
        summary: "Validation Error",
        detail: "Event date cannot be in the past",
        life: 3000,
      });
      return;
    }
    try {
      // Call your backend API
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/leads/addNew",
        formData
      );

      if (res.data.success) {
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Lead added successfully",
          life: 3000,
        });

        handleClear(); // Clear form after success

        // Navigate after short delay
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Failed",
          detail: res.data.message || "Failed to add lead",
          life: 3000,
        });
      }
    } catch (error: any) {
      console.error("Error adding lead:", error);

      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Internal server error",
        life: 3000,
      });
    }
  };

  const handleClear = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      secondaryMobile: "",
      doorNo: "",
      street: "",
      city: "",
      district: "",
      state: "",
      country: "",
      eventType: "",
      leadSource: "",
      budget: "",
      eventDate: null,
      advance: "",
      paymentDate: null,
      notes: "",
    });
  };

  return (
    <div>
      <Toast ref={toast} />

      <div className="">
        <div className="p-3 shadow-lg rounded-lg">
          {/* Basic Details */}
          <p className="underline uppercase font-semibold text-md">
            Basic Details
          </p>
          <div className="flex gap-3">
            <div className="flex flex-1 flex-column gap-2">
              <label>First Name</label>
              <InputText
                type="text"
                className="p-inputtext-sm"
                placeholder="Enter First Name"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
            </div>
            <div className="flex flex-1 flex-column gap-2">
              <label>Last Name</label>
              <InputText
                type="text"
                className="p-inputtext-sm"
                placeholder="Enter Last Name"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
            </div>
            <div className="flex-1"></div>
          </div>

          <Divider />

          {/* Communication Details */}
          <p className="mt-2 underline uppercase font-semibold text-md">
            Communication Details
          </p>
          <div className="flex gap-3">
            <div className="flex flex-1 flex-column gap-2">
              <label>Email</label>
              <InputText
                type="text"
                className="p-inputtext-sm"
                placeholder="Enter Email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
            <div className="flex flex-1 flex-column gap-2">
              <label>Mobile</label>
              <InputMask
                className="p-inputtext-sm"
                mask="999-999-9999"
                placeholder="Enter Mobile"
                value={formData.mobile}
                onChange={(e) => handleChange("mobile", e.value)}
              />
            </div>
            <div className="flex flex-1 flex-column gap-2">
              <label>Secondary Mobile</label>
              <InputMask
                className="p-inputtext-sm"
                mask="999-999-9999"
                placeholder="Enter Secondary Mobile"
                value={formData.secondaryMobile}
                onChange={(e) => handleChange("secondaryMobile", e.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-3">
            <div className="flex flex-1 flex-column gap-2">
              <label>Door No</label>
              <InputText
                type="text"
                className="p-inputtext-sm"
                placeholder="Enter Door Number"
                value={formData.doorNo}
                onChange={(e) => handleChange("doorNo", e.target.value)}
              />
            </div>
            <div className="flex flex-1 flex-column gap-2">
              <label>Street</label>
              <InputText
                type="text"
                className="p-inputtext-sm"
                placeholder="Enter Street"
                value={formData.street}
                onChange={(e) => handleChange("street", e.target.value)}
              />
            </div>
            <div className="flex flex-1 flex-column gap-2">
              <label>City</label>
              <InputText
                type="text"
                className="p-inputtext-sm"
                placeholder="Enter City"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-3">
            <div className="flex flex-1 flex-column gap-2">
              <label>District</label>
              <InputText
                type="text"
                className="p-inputtext-sm"
                placeholder="Enter District"
                value={formData.district}
                onChange={(e) => handleChange("district", e.target.value)}
              />
            </div>
            <div className="flex flex-1 flex-column gap-2">
              <label>State</label>
              <InputText
                type="text"
                className="p-inputtext-sm"
                placeholder="Enter State"
                value={formData.state}
                onChange={(e) => handleChange("state", e.target.value)}
              />
            </div>
            <div className="flex flex-1 flex-column gap-2">
              <label>Country</label>
              <InputText
                type="text"
                className="p-inputtext-sm"
                placeholder="Enter Country"
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
              />
            </div>
          </div>

          <Divider />

          {/* Event Details */}
          <p className="mt-2 underline uppercase font-semibold text-md">
            Event Details
          </p>
          <div className="flex gap-3">
            <div className="flex flex-1 flex-column gap-2">
              <label>Event Type</label>
              <Dropdown
                options={eventTypes}
                placeholder="Select Event Type"
                className="p-inputtext-sm"
                value={formData.eventType}
                onChange={(e) => handleChange("eventType", e.value)}
              />
            </div>
            <div className="flex flex-1 flex-column gap-2">
              <label>Lead Source</label>
              <Dropdown
                options={leadSources}
                placeholder="Select Lead Source"
                className="p-inputtext-sm"
                value={formData.leadSource}
                onChange={(e) => handleChange("leadSource", e.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-3">
            <div className="flex flex-1 flex-column gap-2">
              <label>Budget (Optional)</label>
              <InputText
                type="number"
                placeholder="Enter Budget"
                className="p-inputtext-sm"
                value={formData.budget}
                onChange={(e) => handleChange("budget", e.target.value)}
              />
            </div>
            <div className="flex flex-1 flex-column gap-2">
              <label>Event Date</label>
              <Calendar
                placeholder="Choose Event Date"
                className="p-inputtext-sm"
                value={formData.eventDate}
                onChange={(e) => handleChange("eventDate", e.value)}
                minDate={new Date()}
              />
            </div>
          </div>

          <Divider />

          {/* Advance Details */}
          <p className="mt-2 underline uppercase font-semibold text-md">
            Advance Details
          </p>
          <div className="flex gap-3">
            <div className="flex flex-1 flex-column gap-2">
              <label>Advance Payment</label>
              <InputText
                type="number"
                placeholder="Enter Advance"
                className="p-inputtext-sm"
                value={formData.advance}
                onChange={(e) => {
                  const value = e.target.value;
                  if (
                    formData.budget &&
                    Number(value) > Number(formData.budget)
                  ) {
                    toast.current?.show({
                      severity: "warn",
                      summary: "Validation Error",
                      detail: `Advance cannot exceed budget (${formData.budget})`,
                      life: 2000,
                    });
                    return;
                  }
                  handleChange("advance", value);
                }}
              />
            </div>
            <div className="flex flex-1 flex-column gap-2">
              <label>Payment Date</label>
              <Calendar
                placeholder="Amount Given Date"
                className="p-inputtext-sm"
                value={formData.paymentDate}
                onChange={(e) => handleChange("paymentDate", e.value)}
              />
            </div>
          </div>

          <Divider />

          {/* Notes */}
          <p className="mt-2 underline uppercase font-semibold text-md">
            Other Important Notes
          </p>
          <Editor
            value={formData.notes}
            onTextChange={(e) => handleChange("notes", e.htmlValue ?? "")}
            style={{ height: "320px" }}
          />

          {/* Actions */}
          <div className="buttonActions gap-3 flex mt-3 justify-end">
            <Button
              icon="pi pi-times"
              label="Clear"
              outlined
              className="w-[10rem]"
              onClick={handleClear}
            />
            <Button
              icon="pi pi-save"
              label="Save Lead"
              className="w-[10rem]"
              onClick={handleSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewLeads;
