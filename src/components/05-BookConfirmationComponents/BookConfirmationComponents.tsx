import React, { useState, useRef } from "react";
import { Steps } from "primereact/steps";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Editor } from "primereact/editor";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface EventDetails {
  eventName: string;
  dateTime: Date | null;
  highlights: string;
  notes: string;
}

interface PaymentDetails {
  paymentType: "online" | "offline";
  amount: any;
  date: Date | null;
  notes: string;
}

interface BookConfirmationProps {
  onClose: () => void;
  leadId: number;
}
const BookConfirmationComponents: React.FC<BookConfirmationProps> = ({
  onClose,
  leadId,
}) => {
  const toast = useRef<Toast>(null);
  const [activeStep, setActiveStep] = useState(0);

  // Event state
  const [eventDetails, setEventDetails] = useState<EventDetails>({
    eventName: "",
    dateTime: null,
    highlights: "",
    notes: "",
  });
  const [submittedEvents, setSubmittedEvents] = useState<EventDetails[]>([]);

  // Payment state
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    paymentType: "online",
    amount:"",
    date: null,
    notes: "",
  });

  const steps = [{ label: "Event Details" }, { label: "Payment Details" }];

  // Validation functions using Toast
  const showError = (message: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Validation Error",
      detail: message,
      life: 3000,
    });
  };

  const validateEventStep = (): boolean => {
    if (!eventDetails.eventName) {
      showError("Event Name is required");
      return false;
    }
    if (!eventDetails.dateTime) {
      showError("Event Date & Time is required");
      return false;
    }
    return true;
  };

  const validatePaymentStep = (): boolean => {
    if (!paymentDetails.amount || paymentDetails.amount <= 0) {
      showError("Amount must be greater than 0");
      return false;
    }
    if (!paymentDetails.date) {
      showError("Payment Date is required");
      return false;
    }
    return true;
  };

  const navigate = useNavigate();
  console.log('navigate', navigate)

  const handleNext = async () => {
    if (activeStep === 0) {
      if (!validateEventStep()) return;
      setSubmittedEvents([...submittedEvents, eventDetails]);
      setActiveStep(1);
    } else if (activeStep === 1) {
      if (!validatePaymentStep()) return;

      const finalPayload = {
        leadId,
        eventDetails,
        paymentDetails,
      };

      try {
        const res = await axios.post(
          import.meta.env.VITE_API_URL + "/leads/bookEvent",
          finalPayload
        );

        if (res.data.success) {
          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: "Event & Payment saved successfully",
            life: 3000,
          });

          // reset form state
          setEventDetails({
            eventName: "",
            dateTime: null,
            highlights: "",
            notes: "",
          });
          setPaymentDetails({
            paymentType: "online",
            amount: 0,
            date: null,
            notes: "",
          });
          setActiveStep(0);

          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: res.data.message || "Failed to save event",
            life: 3000,
          });
        }
      } catch (error: any) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong while saving",
          life: 3000,
        });
      }
    }
  };

  const handlePrev = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <Steps
        model={steps}
        activeIndex={activeStep}
        readOnly={true}
        className="mb-4"
      />

      {/* Step 1: Event Details */}
      {activeStep === 0 && (
        <div className="gap-4 mb-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <span className="p-float-label">
                <InputText
                  className="w-full"
                  value={eventDetails.eventName}
                  onChange={(e) =>
                    setEventDetails({
                      ...eventDetails,
                      eventName: e.target.value,
                    })
                  }
                />
                <label>Event Name</label>
              </span>
            </div>
            <div className="flex-1">
              <Calendar
                className="w-full"
                value={eventDetails.dateTime}
                onChange={(e) =>
                  setEventDetails({
                    ...eventDetails,
                    dateTime: e.value as Date,
                  })
                }
                showTime
                minDate={new Date()}
                hourFormat="12"
                placeholder="Select Date & Time"
              />
            </div>
          </div>

          <div className="mt-3">
            <p>Highlights</p>
            <Editor
              value={eventDetails.highlights}
              onTextChange={(e) =>
                setEventDetails({
                  ...eventDetails,
                  highlights: e.htmlValue || "",
                })
              }
              style={{ height: "150px" }}
            />
          </div>

          <div className="mt-3">
            <p>Notes</p>
            <Editor
              value={eventDetails.notes}
              onTextChange={(e) =>
                setEventDetails({ ...eventDetails, notes: e.htmlValue || "" })
              }
              style={{ height: "150px" }}
            />
          </div>

          <div className="flex justify-end mt-3 gap-2">
            <Button
              label="Next"
              icon="pi pi-arrow-right"
              onClick={handleNext}
            />
          </div>
        </div>
      )}

      {/* Step 2: Payment Details */}
      {activeStep === 1 && (
        <div className="gap-4 mb-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <p className="mb-1">Payment Type</p>
              <Dropdown
                className="w-full"
                value={paymentDetails.paymentType}
                options={[
                  { label: "Online", value: "online" },
                  { label: "Offline", value: "offline" },
                ]}
                onChange={(e) =>
                  setPaymentDetails({ ...paymentDetails, paymentType: e.value })
                }
              />
            </div>
            <div className="flex-1">
              <p className="mb-1">Amount</p>
              <InputText
                className="w-full"
                type="number"
                value={paymentDetails.amount}
                onChange={(e) =>
                  setPaymentDetails({
                    ...paymentDetails,
                    amount: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="flex-1">
              <p className="mb-1">Payment Date</p>
              <Calendar
                className="w-full"
                value={paymentDetails.date}
                onChange={(e) =>
                  setPaymentDetails({
                    ...paymentDetails,
                    date: e.value as Date,
                  })
                }
              />
            </div>
          </div>

          <div className="mt-3">
            <p className="mb-1">Notes</p>
            <InputText
              className="w-full"
              value={paymentDetails.notes}
              onChange={(e) =>
                setPaymentDetails({ ...paymentDetails, notes: e.target.value })
              }
            />
          </div>

          <div className="flex justify-between mt-3 gap-2">
            <Button
              label="Previous"
              icon="pi pi-arrow-left"
              onClick={handlePrev}
              severity="secondary"
            />
            <Button
              label="Submit"
              icon="pi pi-check"
              onClick={handleNext}
              severity="success"
            />
          </div>

          {/* Stats */}
          {/* <div className="flex gap-4 mt-4">
            <Card className="flex-1" title="Overall Amount">
              <h2 className="text-2xl font-semibold">{overallAmount}</h2>
            </Card>
            <Card className="flex-1" title="Paid Amount">
              <h2 className="text-2xl font-semibold">{paidAmount}</h2>
            </Card>
          </div> */}

          {/* Transactions Table */}
          {/* <DataTable
            value={transactions}
            paginator
            rows={5}
            showGridlines
            className="mt-3"
          >
            <Column field="paymentType" header="Payment Type" />
            <Column field="amount" header="Amount" />
            <Column
              field="date"
              header="Date"
              body={(row) => row.date?.toLocaleDateString()}
            />
            <Column field="notes" header="Notes" />
          </DataTable> */}
        </div>
      )}
    </div>
  );
};

export default BookConfirmationComponents;
