import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MultiSelect } from "primereact/multiselect";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import { Eye, Pencil, Trash } from "lucide-react";

interface AddOn {
  id: number;
  description: string;
  unit: number;
  price: number;
}

interface ServiceItem {
  id: number;
  name: string;
}

interface DeliverableItem {
  id: number;
  name: string;
}

const Package: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  // 🔹 UI States
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // 🔹 Input Fields
  const [title, setTitle] = useState("");
  const [packageTitle, setPackageTitle] = useState("");
  const [priceTitle, setPriceTitle] = useState("");
  const [price, setPrice] = useState("");

  // 🔹 Services, Deliverables, Addons
  const [serviceInput, setServiceInput] = useState("");
  const [deliverableInput, setDeliverableInput] = useState("");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [deliverables, setDeliverables] = useState<DeliverableItem[]>([]);
  const [addons, setAddons] = useState<AddOn[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<AddOn[]>([]);

  // 🔹 Edit States
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [editingDeliverableId, setEditingDeliverableId] = useState<
    number | null
  >(null);
  const [editingPackageId, setEditingPackageId] = useState<number | null>(null);

  // 🔹 Packages list & Preview data
  const [packages, setPackages] = useState<any[]>([]);
  const [previewData, setPreviewData] = useState<any>(null);

  // ===== Fetch AddOns from API =====
  const fetchAddOns = async () => {
    try {
      const res = await axios.get(`${API_URL}/addons/list`);
      if (res.data.success) {
        setAddons(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching add-ons:", err);
    }
  };

  // ===== Fetch Packages from API =====
  const fetchPackages = async () => {
    try {
      const res = await axios.get(`${API_URL}/packages/list`);
      if (res.data.success) {
        setPackages(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching packages:", err);
    }
  };

  useEffect(() => {
    fetchAddOns();
    fetchPackages();
  }, []);

  // ===== Add/Edit Service =====
  const handleAddService = () => {
    if (!serviceInput.trim()) return;

    if (editingServiceId) {
      setServices((prev) =>
        prev.map((item) =>
          item.id === editingServiceId
            ? { ...item, name: serviceInput.trim() }
            : item
        )
      );
      setEditingServiceId(null);
    } else {
      setServices([...services, { id: Date.now(), name: serviceInput.trim() }]);
    }
    setServiceInput("");
  };

  // ===== Add/Edit Deliverable =====
  const handleAddDeliverable = () => {
    if (!deliverableInput.trim()) return;

    if (editingDeliverableId) {
      setDeliverables((prev) =>
        prev.map((item) =>
          item.id === editingDeliverableId
            ? { ...item, name: deliverableInput.trim() }
            : item
        )
      );
      setEditingDeliverableId(null);
    } else {
      setDeliverables([
        ...deliverables,
        { id: Date.now(), name: deliverableInput.trim() },
      ]);
    }
    setDeliverableInput("");
  };

  // ===== Edit/Delete Handlers =====
  const handleEditService = (item: ServiceItem) => {
    setServiceInput(item.name);
    setEditingServiceId(item.id);
  };

  const handleDeleteService = (id: number) => {
    setServices(services.filter((item) => item.id !== id));
  };

  const handleEditDeliverable = (item: DeliverableItem) => {
    setDeliverableInput(item.name);
    setEditingDeliverableId(item.id);
  };

  const handleDeleteDeliverable = (id: number) => {
    setDeliverables(deliverables.filter((item) => item.id !== id));
  };

  // ===== Save or Update Package =====
  const handleSavePackage = async () => {
    try {
      const payload = {
        title,
        packageTitle,
        priceTitle,
        price,
        services: services.map((s) => s.name),
        deliverables: deliverables.map((d) => d.name),
        addons: selectedAddons.map((a) => a.id),
      };

      if (editingPackageId) {
        // You can implement update API if exists
        console.log("Updating package...");
      } else {
        const res = await axios.post(`${API_URL}/packages/create`, payload);
        if (res.data.success) {
          setShowForm(false);
          fetchPackages();
        }
      }
    } catch (err) {
      console.error("Error saving package:", err);
    }
  };

  // ===== View Package (Preview Modal) =====
  const handleViewPackage = async (id: number) => {
    try {
      const res = await axios.get(`${API_URL}/packages/${id}`);
      if (res.data.success) {
        setPreviewData(res.data.data);
        setShowPreview(true);
      }
    } catch (err) {
      console.error("Error fetching package details:", err);
    }
  };

  // ===== Edit Package =====
  const handleEditPackage = async (pkg: any) => {
    try {
      const res = await axios.get(`${API_URL}/packages/${pkg.id}`);
      if (res.data.success) {
        const data = res.data.data;
        setTitle(data.title);
        setPackageTitle(data.package_title);
        setPriceTitle(data.package_type);
        setPrice(data.price);
        setServices(
          (data.services || []).map((s: string, i: number) => ({
            id: i + 1,
            name: s,
          }))
        );
        setDeliverables(
          (data.deliverables || []).map((d: string, i: number) => ({
            id: i + 1,
            name: d,
          }))
        );
        setSelectedAddons(data.addons || []);
        setEditingPackageId(pkg.id);
        setShowForm(true);
      }
    } catch (err) {
      console.error("Error loading package for edit:", err);
    }
  };

  // ===== Delete Package =====
  const handleDeletePackage = async (id: number) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      await axios.delete(`${API_URL}/packages/delete/${id}`);
      fetchPackages();
    } catch (err) {
      console.error("Error deleting package:", err);
    }
  };

  // ===== UI =====
  return (
    <div>
      {/* Toggle Button */}
      {!showForm && (
        <div className="flex justify-content-end mb-3">
          <Button
            label="Add Package"
            icon="pi pi-plus"
            onClick={() => setShowForm(true)}
          />
        </div>
      )}

      {/* ===== PACKAGES TABLE ===== */}
      {!showForm && (
        <DataTable
          value={packages}
          paginator
          rows={5}
          className="p-datatable-sm"
          stripedRows
          showGridlines
        >
          <Column
            header="S.No"
            body={(_data, { rowIndex }) => rowIndex + 1}
            style={{ width: "6rem", textAlign: "center" }}
          />
          <Column field="title" header="Title" />
          <Column field="package_title" header="Package Title" />
          <Column field="package_type" header="Price Title" />
          <Column field="price" header="Price" />

          {/* 👁 View Column */}
          <Column
            header="View"
            body={(rowData) => (
              <Eye
                size={18}
                className="cursor-pointer text-blue-500"
                onClick={() => handleViewPackage(rowData.id)}
              />
            )}
            style={{ width: "6rem", textAlign: "center" }}
          />

          {/* ✏️ Edit Column */}
          <Column
            header="Edit"
            body={(rowData) => (
              <Pencil
                size={18}
                className="cursor-pointer text-green-500"
                onClick={() => handleEditPackage(rowData)}
              />
            )}
            style={{ width: "6rem", textAlign: "center" }}
          />

          {/* 🗑 Delete Column */}
          <Column
            header="Delete"
            body={(rowData) => (
              <Trash
                size={18}
                className="cursor-pointer text-red-500"
                onClick={() => handleDeletePackage(rowData.id)}
              />
            )}
            style={{ width: "6rem", textAlign: "center" }}
          />
        </DataTable>
      )}

      {/* ===== PACKAGE FORM ===== */}
      {showForm && (
        <div className="card shadow-md p-3">
          {/* Inputs */}
          <div className="flex gap-2">
            <div className="flex-1">
              <InputText
                placeholder="Enter Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <InputText
                placeholder="Enter Package Title Eg: Basic Quotation"
                value={packageTitle}
                onChange={(e) => setPackageTitle(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <div className="flex-1">
              <InputText
                placeholder="Price Title Eg: Basic Package"
                value={priceTitle}
                onChange={(e) => setPriceTitle(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <InputText
                placeholder="Price Eg: 19000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Section Titles */}
          <div className="flex mt-3 gap-2 font-semibold">
            <div className="flex-1">
              <p>Services</p>
            </div>
            <div className="flex-1">
              <p>Deliverables</p>
            </div>
            <div className="flex-1">
              <p>Add Ons</p>
            </div>
          </div>

          {/* Input Groups */}
          <div className="flex mt-2 gap-2">
            {/* Services Input */}
            <div className="p-inputgroup flex-1">
              <InputText
                placeholder="Enter Services"
                value={serviceInput}
                onChange={(e) => setServiceInput(e.target.value)}
              />
              <Button
                icon={editingServiceId ? "pi pi-check" : "pi pi-plus"}
                onClick={handleAddService}
              />
            </div>

            {/* Deliverables Input */}
            <div className="p-inputgroup flex-1">
              <InputText
                placeholder="Enter Deliverables"
                value={deliverableInput}
                onChange={(e) => setDeliverableInput(e.target.value)}
              />
              <Button
                icon={editingDeliverableId ? "pi pi-check" : "pi pi-plus"}
                onClick={handleAddDeliverable}
              />
            </div>

            {/* Addons MultiSelect */}
            <div className="flex-1">
              <MultiSelect
                value={selectedAddons}
                options={addons}
                optionLabel="description"
                placeholder="Select Add-ons"
                filter
                showClear
                className="w-full"
                onChange={(e) => setSelectedAddons(e.value)}
              />
            </div>
          </div>

          {/* Tables */}
          <div className="flex gap-2 mt-3">
            {/* Services Table */}
            <div className="flex-1">
              <DataTable
                value={services}
                showGridlines
                stripedRows
                className="p-datatable-sm"
              >
                <Column
                  header="#"
                  body={(_data, { rowIndex }) => rowIndex + 1}
                  style={{ width: "4rem" }}
                />
                <Column field="name" header="Service" />
                <Column
                  header="Actions"
                  body={(rowData) => (
                    <div className="flex gap-2 justify-center">
                      <Button
                        icon="pi pi-pencil"
                        className="p-button-text p-button-sm"
                        onClick={() => handleEditService(rowData)}
                      />
                      <Button
                        icon="pi pi-trash"
                        className="p-button-text p-button-danger p-button-sm"
                        onClick={() => handleDeleteService(rowData.id)}
                      />
                    </div>
                  )}
                  style={{ width: "6rem", textAlign: "center" }}
                />
              </DataTable>
            </div>

            {/* Deliverables Table */}
            <div className="flex-1">
              <DataTable
                value={deliverables}
                showGridlines
                stripedRows
                className="p-datatable-sm"
              >
                <Column
                  header="#"
                  body={(_data, { rowIndex }) => rowIndex + 1}
                  style={{ width: "4rem" }}
                />
                <Column field="name" header="Deliverable" />
                <Column
                  header="Actions"
                  body={(rowData) => (
                    <div className="flex gap-2 justify-center">
                      <Button
                        icon="pi pi-pencil"
                        className="p-button-text p-button-sm"
                        onClick={() => handleEditDeliverable(rowData)}
                      />
                      <Button
                        icon="pi pi-trash"
                        className="p-button-text p-button-danger p-button-sm"
                        onClick={() => handleDeleteDeliverable(rowData.id)}
                      />
                    </div>
                  )}
                  style={{ width: "6rem", textAlign: "center" }}
                />
              </DataTable>
            </div>

            {/* Add-ons Table */}
            <div className="flex-1">
              <DataTable
                value={selectedAddons}
                showGridlines
                stripedRows
                className="p-datatable-sm"
              >
                <Column
                  header="#"
                  body={(_data, { rowIndex }) => rowIndex + 1}
                  style={{ width: "4rem" }}
                />
                <Column field="description" header="Add-on" />
                <Column field="price" header="Price" />
              </DataTable>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-content-end gap-2 mt-4">
            <Button
              label="Cancel"
              className="p-button-text"
              onClick={() => {
                setShowForm(false);
                setEditingPackageId(null);
              }}
            />
            <Button label="Save Package" onClick={handleSavePackage} />
          </div>
        </div>
      )}

      {/* ===== PREVIEW MODAL ===== */}
      <Dialog
        header="Package Preview"
        visible={showPreview}
        style={{ width: "80vw" }}
        modal
        onHide={() => setShowPreview(false)}
      >
        {previewData ? (
          <div className="">
            <p>{previewData.title}</p>
            <p>
              <strong>Package Title:</strong> {previewData.package_title}
            </p>
            <p>
              <strong>Price Title:</strong> {previewData.package_type}
            </p>
            <p>
              <strong>Price:</strong> ₹{previewData.price}
            </p>

            <h4 className="mt-3">Services</h4>
            <ul>
              {previewData.services?.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <h4 className="mt-3">Deliverables</h4>
            <ul>
              {previewData.deliverables?.map((d: string, i: number) => (
                <li key={i}>{d}</li>
              ))}
            </ul>

            <h4 className="mt-3">Add-ons</h4>
            <ul>
              {previewData.addons?.map((a: any) => (
                <li key={a.id}>
                  {a.description} — ₹{a.price}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Dialog>
    </div>
  );
};

export default Package;
