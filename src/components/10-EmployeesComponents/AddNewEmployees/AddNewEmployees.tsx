import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Chips } from "primereact/chips";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { addEmployee, updateEmployee } from "./AddNewEmployees.function";

interface AddNewEmployeesProps {
  onSuccess?: () => void;
  initialData?: any;
}

const AddNewEmployees: React.FC<AddNewEmployeesProps> = ({
  onSuccess,
  initialData,
}) => {
  const toast = useRef<Toast>(null);

  const [isEditMode, setIsEditMode] = useState(false);

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
    workLocation: "",
    salesType: "",
    availability: "",
    experience: 0,
    skills: [] as string[],
    portfolio: "",
    reason: "",
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

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast.current?.show({
        severity: "error",
        summary: "Validation Error",
        detail: "First Name is required",
      });
      return false;
    }
    if (!formData.lastName.trim()) {
      toast.current?.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Last Name is required",
      });
      return false;
    }
    if (!formData.email.trim()) {
      toast.current?.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Email is required",
      });
      return false;
    }
    if (!formData.mobile.trim()) {
      toast.current?.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Mobile number is required",
      });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    try {
      if (!validateForm()) return;

      let result;
      if (isEditMode) {
        // 👇 call update API
        result = await updateEmployee(initialData.id, formData);
      } else {
        // 👇 call add API
        result = await addEmployee(formData);
      }

      if (result.success) {
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: isEditMode
            ? "Employee updated successfully!"
            : "Employee added successfully!",
        });

        if (!isEditMode) handleClear();

        if (onSuccess) {
          setTimeout(() => onSuccess(), 500);
        }
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: result.message || "Failed to save employee",
        });
      }
    } catch (error: any) {
      console.error("Error saving employee:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to save employee",
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
      workLocation: "",
      salesType: "",
      availability: "",
      experience: 0,
      skills: [],
      portfolio: "",
      reason: "",
      eventType: "",
      leadSource: "",
      budget: "",
      eventDate: null,
      advance: "",
      paymentDate: null,
      notes: "",
    });
  };

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setIsEditMode(true); // 👈 mark edit mode
    }
  }, [initialData]);

  return (
    <div>
      <Toast ref={toast} />

      <div className="p-3">
        <div className="">
          {/* Basic Details */}
          <p className="underline uppercase font-semibold text-md">
            Basic Details
          </p>
          <div className="flex gap-3">
            <div className="flex flex-1 flex-column gap-2">
              <label>First Name</label>
              <InputText
                type="text"
                placeholder="Enter First Name"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
            </div>
            <div className="flex flex-1 flex-column gap-2">
              <label>Last Name</label>
              <InputText
                type="text"
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
                placeholder="Enter Email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
            <div className="flex flex-1 flex-column gap-2">
              <label>Mobile</label>
              <InputMask
                mask="999-999-9999"
                placeholder="Enter Mobile"
                value={formData.mobile}
                onChange={(e) => handleChange("mobile", e.value)}
              />
            </div>
            <div className="flex flex-1 flex-column gap-2">
              <label>Secondary Mobile</label>
              <InputMask
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
                placeholder="Enter Door Number"
                value={formData.doorNo}
                onChange={(e) => handleChange("doorNo", e.target.value)}
              />
            </div>
            <div className="flex flex-1 flex-column gap-2">
              <label>Street</label>
              <InputText
                type="text"
                placeholder="Enter Street"
                value={formData.street}
                onChange={(e) => handleChange("street", e.target.value)}
              />
            </div>
            <div className="flex flex-1 flex-column gap-2">
              <label>City</label>
              <InputText
                type="text"
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
                placeholder="Enter District"
                value={formData.district}
                onChange={(e) => handleChange("district", e.target.value)}
              />
            </div>
            <div className="flex flex-1 flex-column gap-2">
              <label>State</label>
              <InputText
                type="text"
                placeholder="Enter State"
                value={formData.state}
                onChange={(e) => handleChange("state", e.target.value)}
              />
            </div>
            <div className="flex flex-1 flex-column gap-2">
              <label>Country</label>
              <InputText
                type="text"
                placeholder="Enter Country"
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
              />
            </div>
          </div>

          <Divider />

          {/* Professional Details */}
          <p className="mt-2 underline uppercase font-semibold text-md">
            Professional Details
          </p>
          <div className="flex gap-3">
            <div className="flex flex-1 flex-column gap-2">
              <label>Work Location</label>
              <InputText
                type="text"
                placeholder="Enter Work Location"
                value={formData.workLocation}
                onChange={(e) => handleChange("workLocation", e.target.value)}
              />
            </div>
            <div className="flex flex-1 flex-column gap-2">
              <label>Preferred Sales Type</label>
              <Dropdown
                options={[
                  { label: "In Person", value: "in_person" },
                  { label: "Online", value: "online" },
                  { label: "Events", value: "events" },
                  { label: "Others", value: "others" },
                ]}
                placeholder="Select Sales Type"
                value={formData.salesType}
                onChange={(e) => handleChange("salesType", e.value)}
              />
            </div>
            <div className="flex flex-1 flex-column gap-2">
              <label>Availability</label>
              <Dropdown
                options={[
                  { label: "Full-Time", value: "fulltime" },
                  { label: "Part-Time", value: "parttime" },
                  { label: "Freelance", value: "freelance" },
                ]}
                placeholder="Select Availability"
                value={formData.availability}
                onChange={(e) => handleChange("availability", e.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-3">
            <div className="flex flex-1 flex-column gap-2">
              <label>Years of Experience</label>
              <InputNumber
                placeholder="Enter Experience"
                value={formData.experience}
                onValueChange={(e) => handleChange("experience", e.value)}
              />
            </div>
            <div className="flex flex-1 flex-column gap-2">
              <label>Photography Knowledge</label>
              <Chips
                value={formData.skills}
                onChange={(e) => handleChange("skills", e.value)}
                separator=","
                className="w-full"
                placeholder="Add skills (e.g. DSLR, Drone, Editing)"
              />
            </div>
            <div className="flex flex-1 flex-column gap-2">
              <label>Portfolio / Social Media</label>
              <InputText
                type="text"
                placeholder="Enter Portfolio Link"
                value={formData.portfolio}
                onChange={(e) => handleChange("portfolio", e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-column gap-2 mt-3">
            <label>Why do you want to join us?</label>
            <InputTextarea
              rows={3}
              placeholder="Write a short answer..."
              value={formData.reason}
              onChange={(e) => handleChange("reason", e.target.value)}
            />
          </div>

          <Divider />

          {/* Actions */}
          <div className="buttonActions gap-3 flex mt-3 justify-end">
            {!isEditMode && (
              <Button
                icon="pi pi-times"
                label="Clear"
                outlined
                className="w-[10rem]"
                onClick={handleClear}
              />
            )}
            <Button
              icon="pi pi-save"
              label={isEditMode ? "Update Employee" : "Save Employee"} // 👈 button label change
              className="w-[15rem]"
              onClick={handleSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewEmployees;
