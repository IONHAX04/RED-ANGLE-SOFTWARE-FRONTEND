import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { Messages } from "primereact/messages";
import { useMountEffect } from "primereact/hooks";
import {
  UserPlus,
  Phone,
  CalendarCheck,
  MessageSquare,
  FileText,
  FileX2,
} from "lucide-react";
Chart.register(...registerables);

const StatusIndicator: React.FC = () => {
  const msgs = useRef<Messages>(null);

  useMountEffect(() => {
    msgs.current?.clear();
    msgs.current?.show({
      id: "1",
      sticky: true,
      severity: "info",
      summary: "Info",
      detail: "Module Work In Progress",
      closable: false,
    });
  });

  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const stats = [
    {
      label: "New Leads",
      value: 42,
      color: "#1E88E5",
      border: "border-blue-500",
      bg: "bg-blue-100",
    },
    {
      label: "In Contact",
      value: 18,
      color: "#FDD835",
      border: "border-yellow-500",
      bg: "bg-yellow-100",
    },
    {
      label: "Booked",
      value: 9,
      color: "#43A047",
      border: "border-green-500",
      bg: "bg-green-100",
    },
    {
      label: "Lost",
      value: 7,
      color: "#E53935",
      border: "border-red-500",
      bg: "bg-red-100",
    },
    {
      label: "Awaiting Reply",
      value: 15,
      color: "#8E24AA",
      border: "border-purple-500",
      bg: "bg-purple-100",
    },
    {
      label: "Proposal Sent",
      value: 11,
      color: "#FB8C00",
      border: "border-orange-500",
      bg: "bg-orange-100",
    },
  ];

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) chartInstance.current.destroy();

      chartInstance.current = new Chart(chartRef.current, {
        type: "pie",
        data: {
          labels: stats.map((s) => s.label),
          datasets: [
            {
              data: stats.map((s) => s.value),
              backgroundColor: stats.map((s) => s.color),
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "right",
              labels: {
                usePointStyle: true,
                pointStyle: "circle",
                padding: 15,
                font: { size: 12 },
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [stats]);

  return (
    <div>
      <div className="p-4">
        <Messages ref={msgs} />

        <h2 className="text-md font-semibold mb-3">Status Summary</h2>

        <div className="flex gap-3">
          {/* New Leads */}
          <div className="flex-1 flex items-center justify-between border p-3 rounded-lg shadow-sm">
            <div className="flex gap-2 items-center">
              <UserPlus className="text-blue-500" />
              <p>New Leads</p>
            </div>
            <p>42</p>
          </div>

          {/* In Contact */}
          <div className="flex-1 flex items-center justify-between border p-3 rounded-lg shadow-sm">
            <div className="flex gap-2 items-center">
              <Phone className="text-green-500" />
              <p>In Contact</p>
            </div>
            <p>42</p>
          </div>

          {/* Booked */}
          <div className="flex-1 flex items-center justify-between border p-3 rounded-lg shadow-sm">
            <div className="flex gap-2 items-center">
              <CalendarCheck className="text-purple-500" />
              <p>Booked</p>
            </div>
            <p>42</p>
          </div>

          {/* Awaiting Reply */}
          <div className="flex-1 flex items-center justify-between border p-3 rounded-lg shadow-sm">
            <div className="flex gap-2 items-center">
              <MessageSquare className="text-orange-500" />
              <p>Awaiting Reply</p>
            </div>
            <p>42</p>
          </div>
        </div>

        <div className="flex gap-3 mt-3">
          <div className="flex-1 flex items-center justify-content-between border-1 p-3 rounded-lg">
            <div className="flex gap-2">
              <FileText className="text-indigo-500" />
              <p>Proposal Sent</p>
            </div>
            <p>42</p>
          </div>
          <div className="flex-1 flex items-center justify-content-between border-1 p-3 rounded-lg">
            <div className="flex gap-2">
              <FileX2 className="text-orange-500" />
              <p>Lost</p>
            </div>
            <p>42</p>
          </div>
          <div className="flex-1 flex items-center justify-content-between p-3 rounded-lg"></div>
          <div className="flex-1 flex items-center justify-content-between p-3 rounded-lg"></div>
        </div>

        {/* Pie Chart */}
        <div className="mt-3 shadow-md border rounded-lg p-6 bg-white">
          <h3 className="mb-4 font-semibold text-md">Status Distribution</h3>
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <canvas ref={chartRef} className="max-w-[400px] max-h-[400px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusIndicator;
