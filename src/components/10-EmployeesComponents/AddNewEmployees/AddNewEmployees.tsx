import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Chips } from "primereact/chips";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import type { FileUploadSelectEvent } from "primereact/fileupload";
import axios from "axios";
import { addEmployee, updateEmployee } from "./AddNewEmployees.function";

interface AddNewEmployeesProps {
  onSuccess?: () => void;
  initialData?: any;
}

interface Role {
  id: number;
  roleName: string;
}

const AddNewEmployees: React.FC<AddNewEmployeesProps> = ({
  onSuccess,
  initialData,
}) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const toast = useRef<Toast>(null);
  const API_URL = import.meta.env.VITE_API_URL;

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
    role: "",
    notes: "",
    profileImage: null as string | null,
    aadharCard: null as {
      base64: string;
      name: string;
      type: string;
    } | null,
  });

  // 🔹 Handle text or dropdown changes
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 🔹 Fetch roles
  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${API_URL}/roles/list`);
      if (res.data.success) {
        setRoles(res.data.data);
      } else {
        toast.current?.show({
          severity: "warn",
          summary: "Fetch Failed",
          detail: res.data.message || "Unable to fetch roles",
        });
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error fetching roles",
      });
    }
  };

  // 🔹 File selection handlers
  // const handleProfileImageSelect = (e: FileUploadSelectEvent) => {
  //   const file = e.files?.[0];
  //   if (file) handleChange("profileImage", file);
  // };

  // const handleAadharSelect = (e: FileUploadSelectEvent) => {
  //   const file = e.files?.[0];
  //   if (file) handleChange("aadharCard", file);
  // };

  // 🔹 Upload Profile Image
  const handleProfileImageUpload = async (e: FileUploadSelectEvent) => {
    const file = e.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("profileImage", file);

    try {
      const res = await axios.post(`${API_URL}/routes/uploadProfileImage`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        console.log("res.data", res.data);
        const base64Image = `data:${res.data.contentType};base64,${res.data.base64}`;
        setFormData((prev) => ({ ...prev, profileImage: base64Image }));

        toast.current?.show({
          severity: "success",
          summary: "Uploaded",
          detail: "Profile image uploaded successfully",
        });
      } else {
        toast.current?.show({
          severity: "warn",
          summary: "Upload Failed",
          detail: res.data.message || "Failed to upload image",
        });
      }
    } catch (err: any) {
      console.error(err);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Error uploading image",
      });
    }
  };

  // 🔹 Upload Aadhaar Card
  const handleAadharUpload = async (e: FileUploadSelectEvent) => {
    const file = e.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("aadharCard", file);

    try {
      const res = await axios.post(`${API_URL}/routes/uploadAadharCard`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        console.log("res.data", res.data);
        const base64Data = `data:${res.data.contentType};base64,${res.data.base64}`;
        setFormData((prev) => ({
          ...prev,
          aadharCard: {
            base64: base64Data,
            name: file.name,
            type: file.type,
          },
        }));

        toast.current?.show({
          severity: "success",
          summary: "Uploaded",
          detail: "Aadhaar card uploaded successfully",
        });
      } else {
        toast.current?.show({
          severity: "warn",
          summary: "Upload Failed",
          detail: res.data.message || "Failed to upload Aadhaar card",
        });
      }
    } catch (err: any) {
      console.error(err);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Error uploading Aadhaar card",
      });
    }
  };

  // 🔹 Validate form
  const validateForm = () => {
    if (!formData.firstName.trim()) return showError("First Name is required");
    if (!formData.lastName.trim()) return showError("Last Name is required");
    if (!formData.email.trim()) return showError("Email is required");
    if (!formData.mobile.trim()) return showError("Mobile number is required");
    return true;
  };

  const showError = (msg: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Validation Error",
      detail: msg,
    });
    return false;
  };

  // 🔹 Save or Update
  const handleSave = async () => {
    try {
      if (!validateForm()) return;

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          if (Array.isArray(value)) data.append(key, JSON.stringify(value));
          else data.append(key, value as any);
        }
      });

      let result;
      if (isEditMode) result = await updateEmployee(initialData.id, data);
      else result = await addEmployee(data);

      if (result.success) {
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: isEditMode
            ? "Employee updated successfully!"
            : "Employee added successfully!",
        });
        if (!isEditMode) handleClear();
        if (onSuccess) setTimeout(() => onSuccess(), 500);
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

  // 🔹 Clear form
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
      role: "",
      notes: "",
      profileImage: null,
      aadharCard: null,
    });
  };

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setIsEditMode(true);
    }
    fetchRoles();
  }, [initialData]);

  return (
    <div>
      <Toast ref={toast} />

      {/* Profile Image Section */}
      <p className="underline uppercase font-semibold text-md">
        Profile Image & Documents
      </p>
      <Divider />

      <div className="flex gap-4">
        <div className="flex-1 flex flex-column gap-2">
          <label>Upload Profile Image</label>
          <FileUpload
            mode="basic"
            name="profileImage"
            accept="image/*"
            customUpload
            chooseLabel="Choose Image"
            onSelect={handleProfileImageUpload}
          />
          {formData.profileImage && (
            <img
              src={formData.profileImage}
              alt="Profile Preview"
              className="w-32 h-32 rounded border mt-2 object-cover"
            />
          )}
        </div>
      </div>

      <Divider />

      {/* Basic Details */}
      <p className="underline uppercase font-semibold text-md">Basic Details</p>
      <div className="flex gap-3">
        <div className="flex flex-1 flex-column gap-2">
          <label>First Name</label>
          <InputText
            value={formData.firstName}
            placeholder="Enter First Name"
            onChange={(e) => handleChange("firstName", e.target.value)}
          />
        </div>
        <div className="flex flex-1 flex-column gap-2">
          <label>Last Name</label>
          <InputText
            value={formData.lastName}
            placeholder="Enter Last Name"
            onChange={(e) => handleChange("lastName", e.target.value)}
          />
        </div>
        <div className="flex flex-1 flex-column gap-2">
          <label>User Role</label>
          <Dropdown
            value={formData.role}
            options={roles}
            optionLabel="roleName"
            optionValue="id"
            placeholder="Select Role"
            onChange={(e) => handleChange("role", e.value)}
          />
        </div>
      </div>

      <Divider />
      <div className="flex-1 flex flex-column gap-2">
        <label>Upload Aadhaar Card</label>
        <FileUpload
          mode="basic"
          name="aadharCard"
          accept="image/*,.pdf"
          customUpload
          chooseLabel="Choose File"
          onSelect={handleAadharUpload}
        />
        {formData.aadharCard && (
          <div className="mt-3">
            {formData.aadharCard.type === "application/pdf" ? (
              <>
                <a
                  href={formData.aadharCard.base64}
                  download={formData.aadharCard.name}
                  className="text-blue-500 underline"
                >
                  Download Aadhaar PDF
                </a>
                <iframe
                  src={formData.aadharCard.base64}
                  width="100%"
                  height="300px"
                  title="Aadhaar Preview"
                  className="border mt-2"
                />
              </>
            ) : (
              <img
                src={formData.aadharCard.base64}
                alt="Aadhaar Preview"
                className="w-40 h-40 object-cover rounded border"
              />
            )}
          </div>
        )}
      </div>
      <Divider />

      {/* Communication Details */}
      <p className="underline uppercase font-semibold text-md">
        Communication Details
      </p>
      <div className="flex gap-3">
        <div className="flex flex-1 flex-column gap-2">
          <label>Email</label>
          <InputText
            type="email"
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

      <Divider />

      {/* Professional Details */}
      <p className="underline uppercase font-semibold text-md">
        Professional Details
      </p>
      <div className="flex gap-3">
        <div className="flex flex-1 flex-column gap-2">
          <label>Work Location</label>
          <InputText
            value={formData.workLocation}
            placeholder="Enter Work Location"
            onChange={(e) => handleChange("workLocation", e.target.value)}
          />
        </div>
        <div className="flex flex-1 flex-column gap-2">
          <label>Preferred Sales Type</label>
          <Dropdown
            value={formData.salesType}
            options={[
              { label: "In Person", value: "in_person" },
              { label: "Online", value: "online" },
              { label: "Events", value: "events" },
              { label: "Others", value: "others" },
            ]}
            placeholder="Select Sales Type"
            onChange={(e) => handleChange("salesType", e.value)}
          />
        </div>
        <div className="flex flex-1 flex-column gap-2">
          <label>Availability</label>
          <Dropdown
            value={formData.availability}
            options={[
              { label: "Full-Time", value: "fulltime" },
              { label: "Part-Time", value: "parttime" },
              { label: "Freelance", value: "freelance" },
            ]}
            placeholder="Select Availability"
            onChange={(e) => handleChange("availability", e.value)}
          />
        </div>
      </div>

      <div className="flex gap-3 mt-3">
        <div className="flex flex-1 flex-column gap-2">
          <label>Experience (in years)</label>
          <InputNumber
            placeholder="Enter Experience"
            value={formData.experience}
            onValueChange={(e) => handleChange("experience", e.value)}
          />
        </div>
        <div className="flex flex-1 flex-column gap-2">
          <label>Skills</label>
          <Chips
            value={formData.skills}
            onChange={(e) => handleChange("skills", e.value)}
            separator=","
            placeholder="Add skills (e.g. DSLR, Drone, Editing)"
          />
        </div>
        <div className="flex flex-1 flex-column gap-2">
          <label>Portfolio / Social Media</label>
          <InputText
            value={formData.portfolio}
            placeholder="Enter Portfolio Link"
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
      <div className="flex justify-end gap-3 mt-3">
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
          label={isEditMode ? "Update Employee" : "Save Employee"}
          className="w-[15rem]"
          onClick={handleSave}
        />
      </div>
    </div>
  );
};

export default AddNewEmployees;
