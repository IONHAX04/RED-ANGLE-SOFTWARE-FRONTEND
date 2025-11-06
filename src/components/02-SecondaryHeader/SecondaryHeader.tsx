import React, { useEffect, useState } from "react";
import "./SecondaryHeader.css";

interface SecondaryHeaderProps {
  title: string;
}

const SecondaryHeader: React.FC<SecondaryHeaderProps> = ({ title }) => {
  const [dateTime, setDateTime] = useState({
    date: "",
    time: "",
  });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const formattedDate = now.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      const formattedTime = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setDateTime({ date: formattedDate, time: formattedTime });
    };

    updateDateTime(); // Initial call
    const timer = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  return (
    <div>
      <div className="flex px-3 secondaryHeader align-items-center justify-content-between">
        <p className="title">{title}</p>
        <div className="flex flex-column dateTime text-right">
          <p>
            <strong>Date:</strong> {dateTime.date}
          </p>
          <p>
            <strong>Time: </strong>
            {dateTime.time}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecondaryHeader;
