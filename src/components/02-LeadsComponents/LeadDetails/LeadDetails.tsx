import { Accordion, AccordionTab } from "primereact/accordion";
import { Avatar } from "primereact/avatar";
import { Chip } from "primereact/chip";
import { Divider } from "primereact/divider";
import React from "react";

interface Customer {
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
}

interface LeadDetailsProps {
  data: Customer;
}

const LeadDetails: React.FC<LeadDetailsProps> = ({ data }) => {
  const userInfo = {
    name: "Amy Elsner",
    avatar: "https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png",
  };

  const followUps = [
    {
      title: "Follow Up 1 - Proposal Sent",
      nextDate: "2025-09-10 10:00 AM",
      summary: "Discussed package pricing and shared proposal.",
      discussion:
        "Client requested a custom package including photography + videography.",
      actionItems: "Awaiting client confirmation by next week.",
    },
    {
      title: "Follow Up 2 - In Discussion",
      nextDate: "2025-09-15 05:00 PM",
      summary: "Talked about payment flexibility.",
      discussion: "Client asked about EMI options and extra services.",
      actionItems: "Need to send updated proposal with payment breakdown.",
    },
  ];

  return (
    <div className="px-1">
      <div className="intro flex gap-3 items-center justify-content-between border-1 rounded-lg px-3 py-2">
        <div className="flex items-center gap-3">
          <Avatar image={userInfo.avatar} shape="circle" />
          <div className="flex flex-col">
            <p className="font-bold">
              {data.firstName} {data.lastName}
            </p>
            <p className="text-sm">{data.eventType}</p>
            <p>
              <strong>Owner:</strong> You
            </p>
          </div>
        </div>
        <div className="flex">
          <Chip
            label="Call"
            icon="pi pi-phone"
            className="bg-green-100 text-green-700"
          />
          <Chip
            label="Email"
            icon="pi pi-envelope"
            className="bg-blue-100 text-blue-700"
          />
          <Chip
            label="Mark Booked"
            icon="pi pi-check-circle"
            className="bg-purple-100 text-purple-700"
          />
        </div>
      </div>

      <div className="leadDetails flex mt-3 gap-4">
        <div className="flex-1 flex flex-column border-1 p-3 rounded-lg gap-2">
          <p>Lead Details</p>
          <Divider className="m-0" />
          <div className="flex items-center justify-content-between bg-[#f0f4ff] px-2 py-1 rounded-md">
            <p>Lead Source</p>
            <p>Website Form</p>
          </div>
          <div className="flex items-center justify-content-between bg-[#f0f4ff] px-2 py-1 rounded-md">
            <p>Pipeline Stage</p>
            <p>Contacted</p>
          </div>
          <div className="flex items-center justify-content-between bg-[#f0f4ff] px-2 py-1 rounded-md">
            <p>Company</p>
            <p>Thompson Event LLC</p>
          </div>
          <div className="flex items-center justify-content-between bg-[#f0f4ff] px-2 py-1 rounded-md">
            <p>Budget</p>
            <p>INR 45,000</p>
          </div>
          <div className="flex items-center justify-content-between bg-[#f0f4ff] px-2 py-1 rounded-md">
            <p>Event Date</p>
            <p>Sept 24, 2025</p>
          </div>
        </div>
        <div className="flex-1 flex flex-column border-1 p-3 rounded-lg gap-2">
          <p>Contact Details</p>
          <Divider className="m-0" />
          <div className="flex items-center justify-content-between bg-[#f0f4ff] px-2 py-1 rounded-md">
            <p>Email</p>
            <p>email@gmail.com</p>
          </div>{" "}
          <div className="flex items-center justify-content-between bg-[#f0f4ff] px-2 py-1 rounded-md">
            <p>Phone</p>
            <p>9876543211</p>
          </div>{" "}
          <div className="flex items-center justify-content-between bg-[#f0f4ff] px-2 py-1 rounded-md">
            <p>Address</p>
            <p>123, Market Street, Salem, TN</p>
          </div>{" "}
        </div>
      </div>

      <div className="flex mt-3 mb-3">
        <p>Follow Up Details</p>
      </div>
      <Accordion multiple>
        {followUps.map((item, index) => (
          <AccordionTab key={index} header={item.title}>
            <div className="p-3 flex flex-col gap-3 text-sm">
              <div className="flex gap-2">
                <span className="font-medium w-40">Next Follow Up:</span>
                <span>{item.nextDate}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium w-40">Interaction Summary:</span>
                <span>{item.summary}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium w-40">Key Discussion Points:</span>
                <span>{item.discussion}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium w-40">Action Items:</span>
                <span>{item.actionItems}</span>
              </div>
            </div>
          </AccordionTab>
        ))}
      </Accordion>
    </div>
  );
};

export default LeadDetails;
