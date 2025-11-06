import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { LogIn, LogOut, Clock } from "lucide-react";
import { Toast } from "primereact/toast";
import SecondaryHeader from "../../components/02-SecondaryHeader/SecondaryHeader";

const API_URL = import.meta.env.VITE_API_URL;

const Attendance: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [punchIn, setPunchIn] = useState(false);
  const [todayHours, setTodayHours] = useState<string>("0h 0m");
  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  const toast = useRef<Toast>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("userDetails");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserId(parsed.userId);
    }
  }, []);

  const fetchAttendanceHistory = async () => {
    if (!userId) return;
    try {
      const { data } = await axios.get(`${API_URL}/attendance/get`, {
        params: { employeeId: userId },
      });
      if (data.success) setAttendanceHistory(data.data);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  useEffect(() => {
    fetchAttendanceHistory();
  }, [userId]);

  // ✅ Punch In
  const handlePunchIn = async () => {
    if (!userId) return;
    console.log("userId", userId);
    try {
      const payload = {
        employee_id: userId,
        punch_in_or_out: true,
      };

      const { data } = await axios.post(
        `${API_URL}/attendance/punchIn`,
        payload
      );
      if (data.success) {
        setPunchIn(true);
        fetchAttendanceHistory();
        toast.current?.show({
          severity: "success",
          summary: "Punch In",
          detail: "You have punched in successfully.",
          life: 3000,
        });
      }
    } catch (err) {
      console.error("Punch In Error:", err);
      toast.current?.show({
        severity: "error",
        summary: "Punch In Failed",
        detail: "Unable to punch in. Try again.",
        life: 3000,
      });
    }
  };

  const handlePunchOut = async () => {
    if (!userId) return;
    try {
      const payload = {
        employee_id: userId,
        punch_in_or_out: false,
      };

      const { data } = await axios.post(
        `${API_URL}/attendance/punchOut`,
        payload
      );
      if (data.success) {
        setPunchIn(false);
        setTodayHours(data.data.total_hours || "0h 0m");
        fetchAttendanceHistory();
        toast.current?.show({
          severity: "success",
          summary: "Punch Out",
          detail: "You have punched out successfully.",
          life: 3000,
        });
      }
    } catch (err) {
      console.error("Punch Out Error:", err);
      toast.current?.show({
        severity: "error",
        summary: "Punch Out Failed",
        detail: "Unable to punch out. Try again.",
        life: 3000,
      });
    }
  };

  return (
    <div>
      <Toast ref={toast} />

      <SecondaryHeader title="Attendance" />

      {/* Punch Section */}
      <div className="mt-3 p-3 shadow-lg rounded-lg">
        <div className="flex justify-content-between align-items-center">
          <div className="flex flex-column">
            <p className="font-semibold">Attendance Tracker</p>
            <p className="text-sm text-gray-600">
              Track your work hours and attendance with ease.
            </p>
          </div>
          <div className="flex flex-column align-items-end">
            <p className="font-semibold">
              {currentTime.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="flex align-items-center gap-1 text-gray-700">
              <Clock size={16} />{" "}
              {currentTime.toLocaleTimeString("en-US", { hour12: true })}
            </p>
          </div>
        </div>

        <div className="flex gap-5 align-items-center justify-content-center mt-4">
          <Button
            label="Punch In"
            className="gap-3"
            icon={<LogIn />}
            onClick={handlePunchIn}
            disabled={punchIn}
          />
          <Button
            label="Punch Out"
            className="gap-3"
            icon={<LogOut />}
            severity="danger"
            outlined
            onClick={handlePunchOut}
            disabled={!punchIn}
          />
        </div>

        {todayHours !== "0h 0m" && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Today's Hours</p>
            <p className="text-lg font-semibold">{todayHours}</p>
          </div>
        )}
      </div>

      {/* Attendance History */}
      <div className="mt-3 p-3 shadow-lg rounded-lg">
        <p className="font-semibold mb-2">Attendance History</p>
        <DataTable
          value={attendanceHistory}
          showGridlines
          scrollable
          className="mt-3 p-datatable-sm"
        >
          <Column header="S.No" body={(_, options) => options.rowIndex + 1} />

          <Column
            field="date"
            header="Date"
            body={(rowData) =>
              new Date(rowData.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            }
          />

          <Column
            field="punch_in_time"
            header="Punch In Time"
            body={(rowData) =>
              rowData.punch_in_time
                ? new Date(rowData.punch_in_time).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })
                : "-"
            }
          />

          <Column
            field="punch_out_time"
            header="Punch Out Time"
            body={(rowData) =>
              rowData.punch_out_time
                ? new Date(rowData.punch_out_time).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })
                : "-"
            }
          />

          <Column field="total_hours" header="Total Hrs" />
          <Column field="status" header="Status" />
        </DataTable>
      </div>
    </div>
  );
};

export default Attendance;
