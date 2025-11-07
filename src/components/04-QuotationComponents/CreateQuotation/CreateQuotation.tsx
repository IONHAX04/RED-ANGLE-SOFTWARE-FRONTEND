import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import axios from "axios";

interface Package {
  id: number;
  serviceName: string;
  description: string;
  quantity: any;
  price: any;
}

interface CreateQuotationProps {
  lead: any;
  onClose: () => void;
}

const CreateQuotation: React.FC<CreateQuotationProps> = ({ lead, onClose }) => {
  const toast = useRef<Toast>(null);

  const [packages, setPackages] = useState<Package[]>([]);
  const [form, setForm] = useState<Package>({
    id: Date.now(),
    serviceName: "",
    description: "",
    quantity: "",
    price: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Package
  ) => {
    setForm({
      ...form,
      [field]:
        field === "quantity" || field === "price"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleAdd = () => {
    if (!form.serviceName || !form.description) return;
    setPackages([...packages, { ...form, id: Date.now() }]);
    setForm({
      id: Date.now(),
      serviceName: "",
      description: "",
      quantity: "",
      price: "",
    });
  };

  const handleDelete = (id: number) => {
    setPackages(packages.filter((pkg) => pkg.id !== id));
  };

  const handleEdit = (pkg: Package) => {
    setForm(pkg);
    setPackages(packages.filter((p) => p.id !== pkg.id)); // remove temporarily
  };

  const handleCreateQuotation = async () => {
    const payload = {
      leadId: lead.leadId,
      eventId: lead.eventId,
      packages: packages.map((pkg) => ({
        serviceName: pkg.serviceName,
        description: pkg.description,
        quantity: pkg.quantity,
        price: pkg.price,
      })),
    };

    console.log("Quotation Payload:", payload);

    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/leads/quotationPackages",
        payload
      );

      if (res.data.success) {
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Quotation packages saved successfully",
          life: 3000,
        });
        onClose(); // close sidebar
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: res.data.message || "Failed to save packages",
          life: 3000,
        });
      }
    } catch (err) {
      console.error(err);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to save quotation packages",
        life: 3000,
      });
    }
  };

  return (
    <div className="p-3">
      {/* Lead / Event Details */}
      <div className="mb-4 border p-3 rounded-lg shadow-sm">
        <h2 className="text-lg font-bold mb-2">Lead & Event Details</h2>
        <table className="table-auto w-full text-sm">
          <tbody>
            <tr>
              <td className="font-semibold">Name:</td>
              <td>
                {lead.firstName} {lead.lastName}
              </td>
            </tr>
            <tr>
              <td className="font-semibold">Email:</td>
              <td>{lead.email}</td>
            </tr>
            <tr>
              <td className="font-semibold">Mobile:</td>
              <td>{lead.mobile}</td>
            </tr>
            <tr>
              <td className="font-semibold">Event Type:</td>
              <td>{lead.eventType}</td>
            </tr>
            <tr>
              <td className="font-semibold">Wedding Location:</td>
              <td>{lead.weddingLocation}</td>
            </tr>
            <tr>
              <td className="font-semibold">Event Name:</td>
              <td>{lead.eventName}</td>
            </tr>
            <tr>
              <td className="font-semibold">Event Date:</td>
              <td>{new Date(lead.eventDateTime).toLocaleString()}</td>
            </tr>
            <tr>
              <td className="font-semibold">Payment Amount:</td>
              <td>{lead.paymentAmount}</td>
            </tr>
            <tr>
              <td className="font-semibold">Payment Type:</td>
              <td>{lead.paymentType}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Package Form */}
      <div className="flex gap-3 mb-4">
        <InputText
          placeholder="Service Name"
          className="flex-1"
          value={form.serviceName}
          onChange={(e) => handleChange(e, "serviceName")}
        />
        <InputText
          placeholder="Description"
          className="flex-1"
          value={form.description}
          onChange={(e) => handleChange(e, "description")}
        />
        <InputText
          placeholder="Quantity"
          className="flex-1"
          type="number"
          value={form.quantity}
          onChange={(e) => handleChange(e, "quantity")}
        />
        <InputText
          placeholder="Price"
          className="flex-1"
          type="number"
          value={form.price}
          onChange={(e) => handleChange(e, "price")}
        />
        <Button label="Add" icon="pi pi-plus" onClick={handleAdd} />
      </div>

      {/* Packages Table */}
      <DataTable
        value={packages}
        paginator
        rows={5}
        showGridlines
        scrollable
        className="shadow-md rounded-lg"
      >
        <Column field="serviceName" header="Service Name" />
        <Column field="description" header="Description" />
        <Column field="quantity" header="Qty" />
        <Column field="price" header="Price" />
        <Column
          header="Actions"
          body={(rowData: Package) => (
            <div className="flex gap-2">
              <Button
                icon="pi pi-pencil"
                rounded
                text
                severity="info"
                onClick={() => handleEdit(rowData)}
              />
              <Button
                icon="pi pi-trash"
                rounded
                severity="danger"
                onClick={() => handleDelete(rowData.id)}
              />
            </div>
          )}
        />
      </DataTable>

      {/* Submit */}
      <div className="flex justify-end mt-4">
        <Button
          label="Create Quotation"
          icon="pi pi-check"
          severity="success"
          onClick={handleCreateQuotation}
        />
      </div>
    </div>
  );
};

export default CreateQuotation;
