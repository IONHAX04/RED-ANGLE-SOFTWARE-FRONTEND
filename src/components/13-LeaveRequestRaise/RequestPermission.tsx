import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import React, { useState, useRef } from "react";
import { addLeaveRequest } from "./RequestLeave.function";

const RequestPermission: React.FC<{
  initialData?: any;
  onSuccess?: () => void;
}> = ({ initialData, onSuccess }) => {
  const [reason, setReason] = useState(initialData?.reason || "");
  const [date, setDate] = useState<Date | null>(initialData?.date || null);
  const [duration, setDuration] = useState<string | null>(
    initialData?.duration || null
  );
  const [fromTime, setFromTime] = useState<Date | null>(
    initialData?.fromTime || null
  );
  const [toTime, setToTime] = useState<Date | null>(
    initialData?.toTime || null
  );
  const [description, setDescription] = useState(
    initialData?.description || ""
  );

  const toast = useRef<Toast>(null);
  const isEditMode = !!initialData;

  const durationOptions = [
    { label: "30 Minutes", value: "30m" },
    { label: "1 Hour", value: "1h" },
    { label: "2 Hours", value: "2h" },
    { label: "Half Day", value: "half-day" },
  ];

  const validateForm = () => {
    if (!reason || !date || !duration || !fromTime || !toTime) {
      toast.current?.show({
        severity: "warn",
        summary: "Validation",
        detail: "All fields are required",
      });
      return false;
    }
    return true;
  };

  // 👉 helper function to add minutes/hours
  const calculateToTime = (from: Date, durationValue: string) => {
    const newTime = new Date(from);

    switch (durationValue) {
      case "30m":
        newTime.setMinutes(newTime.getMinutes() + 30);
        break;
      case "1h":
        newTime.setHours(newTime.getHours() + 1);
        break;
      case "2h":
        newTime.setHours(newTime.getHours() + 2);
        break;
      case "half-day":
        newTime.setHours(newTime.getHours() + 4); // assuming half-day = 4 hrs
        break;
      default:
        break;
    }

    return newTime;
  };

  const handleDurationChange = (value: string) => {
    let newFrom = fromTime;
    if (!newFrom) {
      // set default current time if not already selected
      newFrom = new Date();
      setFromTime(newFrom);
    }

    const newTo = calculateToTime(newFrom, value);
    setToTime(newTo);
    setDuration(value);
  };

  // 👉 clear form
  const handleClear = () => {
    setReason("");
    setDate(null);
    setDuration(null);
    setFromTime(null);
    setToTime(null);
    setDescription("");
  };

  const handleSave = async () => {
    try {
      if (!validateForm()) return;

      const payload = {
        type: "permission",
        reason,
        date,
        duration,
        fromTime,
        toTime,
        description,
        employeeId: 1, // TODO: get from logged-in user/session
      };

      // if (isEditMode) {
      //   result = await updateLeaveRequest(initialData.id, payload);
      // } else {
      const result = await addLeaveRequest(payload);
      // }

      if (result.success) {
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: isEditMode
            ? "Permission updated successfully!"
            : "Permission requested successfully!",
        });

        if (!isEditMode) {
          handleClear(); // 👈 reset form only for new request
        }

        if (onSuccess) {
          setTimeout(() => onSuccess(), 500);
        }
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: result.message || "Failed to save request",
        });
      }
    } catch (error: any) {
      console.error("Error saving permission request:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to save request",
      });
    }
  };

  return (
    <div>
      <Toast ref={toast} />

      <p className="underline font-semibold">
        Short absence during working hours
      </p>

      <div className="flex mt-2">
        <div className="flex-1">
          <p>Reason</p>
          <InputText
            placeholder="Reason: Client pickup, quick errand"
            className="w-full"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3 mt-3">
        <div className="flex-1">
          <p>Date</p>
          <Calendar
            value={date}
            onChange={(e) => setDate(e.value as Date)}
            className="w-full"
            showIcon
          />
        </div>
        <div className="flex-1">
          <p>Duration</p>
          <Dropdown
            value={duration}
            options={durationOptions}
            onChange={(e) => handleDurationChange(e.value)}
            className="w-full"
            placeholder="Select duration"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-3">
        <div className="flex-1">
          <p>From Time</p>
          <Calendar
            value={fromTime}
            onChange={(e) => setFromTime(e.value as Date)}
            timeOnly
            hourFormat="12"
            className="w-full"
          />
        </div>
        <div className="flex-1">
          <p>To Time</p>
          <Calendar
            value={toTime}
            onChange={(e) => setToTime(e.value as Date)}
            timeOnly
            hourFormat="12"
            className="w-full"
          />
        </div>
      </div>

      <div className="mt-3">
        <p>Reason Description</p>
        <InputTextarea
          autoResize
          rows={4}
          className="w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex justify-end mt-3">
        <Button label="Save" icon="pi pi-check" onClick={handleSave} />
      </div>
    </div>
  );
};

export default RequestPermission;
