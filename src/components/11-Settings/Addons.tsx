import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { confirmDialog } from "primereact/confirmdialog";
import axios from "axios";

interface Addon {
  id: number;
  description: string;
  unit: string;
  price: string;
  createdAt?: string;
  createdBy?: string;
}

const Addons: React.FC = () => {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [form, setForm] = useState({ description: "", unit: "", price: "" });
  const [editAddon, setEditAddon] = useState<Addon | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const currentUser = "Admin";

  // Fetch all addons
  const fetchAddons = async () => {
    try {
      const res = await axios.get(`${API_URL}/addons/list`);
      if (res.data.success) setAddons(res.data.data);
    } catch (err) {
      console.error("Error fetching addons:", err);
    }
  };

  useEffect(() => {
    fetchAddons();
  }, []);

  // Handle input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or Update addon
  const handleAddOrUpdate = async () => {
    if (!form.description || !form.unit || !form.price) return;

    try {
      if (editAddon) {
        // 🟡 Update API
        const res = await axios.put(`${API_URL}/addons/update`, {
          id: editAddon.id,
          description: form.description.trim(),
          unit: form.unit.trim(),
          price: form.price.trim(),
        });

        if (res.data.success) {
          fetchAddons();
        }
      } else {
        // 🟢 Add API
        const res = await axios.post(`${API_URL}/addons/add`, {
          description: form.description.trim(),
          unit: form.unit.trim(),
          price: form.price.trim(),
          createdBy: currentUser,
        });

        if (res.data.success) {
          fetchAddons();
        }
      }

      setForm({ description: "", unit: "", price: "" });
      setEditAddon(null);
      setShowDialog(false);
    } catch (err) {
      console.error("Error saving addon:", err);
    }
  };

  // Edit addon
  const handleEdit = (addon: Addon) => {
    setEditAddon(addon);
    setForm({
      description: addon.description,
      unit: addon.unit,
      price: addon.price,
    });
    setShowDialog(true);
  };

  // Delete addon
  const handleDelete = (addon: Addon) => {
    confirmDialog({
      message: `Are you sure you want to delete "${addon.description}"?`,
      header: "Confirm Delete",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Yes",
      rejectLabel: "No",
      accept: async () => {
        try {
          const res = await axios.delete(`${API_URL}/addons/delete`, {
            data: { id: addon.id },
          }); // ✅ DELETE body
          if (res.data.success) fetchAddons();
        } catch (err) {
          console.error("Error deleting addon:", err);
        }
      },
    });
  };

  // Action buttons
  const actionTemplate = (rowData: Addon) => (
    <div className="flex gap-2 justify-content-center">
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
        text
        severity="danger"
        onClick={() => handleDelete(rowData)}
      />
    </div>
  );

  return (
    <div className="p-3">
      <div className="flex justify-content-end mb-3">
        <Button
          label="Add New Add-On"
          icon="pi pi-plus"
          onClick={() => {
            setEditAddon(null);
            setForm({ description: "", unit: "", price: "" });
            setShowDialog(true);
          }}
        />
      </div>

      <DataTable
        value={addons}
        paginator
        rows={5}
        stripedRows
        showGridlines
        className="p-datatable-sm"
        emptyMessage="No Add-Ons found."
      >
        <Column
          header="S.No"
          body={(_, { rowIndex }) => rowIndex + 1}
          style={{ width: "6rem", textAlign: "center" }}
        />
        <Column field="description" header="Description" />
        <Column field="unit" header="Unit" />
        <Column field="price" header="Price" />
        <Column
          field="createdAt"
          header="Created At"
          body={(rowData) =>
            new Date(rowData.createdAt).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          }
        />
        <Column field="createdBy" header="Created By" />
        <Column header="Action" body={actionTemplate} />
      </DataTable>

      <Dialog
        header={editAddon ? "Edit Add-On" : "Add New Add-On"}
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        style={{ width: "40vw" }}
        modal
      >
        <div className="flex flex-column gap-3">
          <InputText
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter Description"
          />
          <InputText
            name="unit"
            value={form.unit}
            onChange={handleChange}
            placeholder="Enter Unit"
          />
          <InputText
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Enter Price"
          />
          <Button
            label={editAddon ? "Update Add-On" : "Add Add-On"}
            onClick={handleAddOrUpdate}
            className="mt-2"
          />
        </div>
      </Dialog>
    </div>
  );
};

export default Addons;
