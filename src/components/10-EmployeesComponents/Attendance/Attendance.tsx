import { Button } from "primereact/button";
import React from "react";

const Attendance: React.FC = () => {
  return (
    <div>
      <div className="attendanceBg"></div>
      <div className="flex">
        <div className="flex-1 flex">
          <p>Punch In</p>
          <p>Next Available: </p>
          <Button>Punc</Button>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
