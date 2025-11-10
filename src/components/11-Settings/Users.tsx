import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import axios from "axios";

interface Role {
  id: number;
  roleName: string;
  createdAt?: string;
  createdBy?: string;
}

const Users: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [roleName, setRoleName] = useState("");
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [editRoleName, setEditRoleName] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  const toast = useRef<Toast>(null);

  // 🔹 Fetch all roles
  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${API_URL}/roles/list`);
      if (res.data.success) {
        setRoles(res.data.data);
      } else {
        toast.current?.show({
          severity: "warn",
          summary: "Fetch Failed",
          detail: res.data.message || "Unable to fetch roles",
          life: 3000,
        });
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error fetching roles",
        life: 3000,
      });
    }
  };

  // 🔹 Add new role
  const handleAddRole = async () => {
    if (!roleName.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: "Validation",
        detail: "Please enter a role name",
        life: 3000,
      });
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/roles/add`, {
        roleName: roleName.trim(),
        createdBy: "Admin", // can be replaced dynamically
      });

      if (res.data.success) {
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Role added successfully",
          life: 2000,
        });
        setRoleName("");
        fetchRoles();
      } else {
        toast.current?.show({
          severity: "warn",
          summary: "Failed",
          detail: res.data.message || "Could not add role",
          life: 3000,
        });
      }
    } catch (err) {
      console.error("Error adding role:", err);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error adding role",
        life: 3000,
      });
    }
  };

  // 🔹 Open edit dialog
  // const handleEdit = (role: Role) => {
  //   setEditRole(role);
  //   setEditRoleName(role.roleName);
  //   setEditDialogVisible(true);
  // };

  // 🔹 Save edited role
  const handleSaveEdit = async () => {
    if (editRole && editRoleName.trim()) {
      try {
        const res = await axios.put(`${API_URL}/roles/update`, {
          id: editRole.id,
          roleName: editRoleName.trim(),
        });
        if (res.data.success) {
          toast.current?.show({
            severity: "success",
            summary: "Updated",
            detail: "Role updated successfully",
            life: 2000,
          });
          fetchRoles();
          setEditDialogVisible(false);
          setEditRole(null);
        } else {
          toast.current?.show({
            severity: "warn",
            summary: "Failed",
            detail: res.data.message || "Could not update role",
            life: 3000,
          });
        }
      } catch (err) {
        console.error("Error updating role:", err);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Error updating role",
          life: 3000,
        });
      }
    } else {
      toast.current?.show({
        severity: "warn",
        summary: "Validation",
        detail: "Please enter a valid role name",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // const actionTemplate = (rowData: Role) => (
  //   <Button
  //     icon="pi pi-pencil"
  //     className="p-button-sm p-button-info"
  //     onClick={() => handleEdit(rowData)}
  //   />
  // );

  return (
    <div className="p-3">
      {/* 🔹 Toast Notification */}
      <Toast ref={toast} />

      <div className="flex gap-3 align-items-center mb-4">
        <InputText
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          placeholder="Enter Role Name"
        />
        <Button label="Add" icon="pi pi-plus" onClick={handleAddRole} />
      </div>

      <DataTable
        value={roles}
        paginator
        rows={5}
        stripedRows
        showGridlines
        className="p-datatable-sm"
      >
        <Column
          header="S.No"
          body={(_data, { rowIndex }) => rowIndex + 1}
          style={{ width: "6rem", textAlign: "center" }}
        />
        <Column field="roleName" header="Role Name" />
        <Column
          field="createdAt"
          header="Created At"
          body={(rowData) =>
            rowData.createdAt
              ? new Date(rowData.createdAt).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "-"
          }
        />
        <Column field="createdBy" header="Created By" />
        {/* <Column
          header="Action"
          body={actionTemplate}
          style={{ width: "8rem", textAlign: "center" }}
        /> */}
      </DataTable>

      {/* 🔹 Edit Dialog */}
      <Dialog
        header="Edit Role"
        visible={editDialogVisible}
        style={{ width: "25rem" }}
        onHide={() => setEditDialogVisible(false)}
        modal
      >
        <div className="flex flex-column gap-3">
          <InputText
            value={editRoleName}
            onChange={(e) => setEditRoleName(e.target.value)}
            placeholder="Enter new role name"
          />
          <div className="flex justify-content-end gap-2">
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setEditDialogVisible(false)}
            />
            <Button
              label="Save"
              icon="pi pi-check"
              onClick={handleSaveEdit}
              disabled={!editRoleName.trim()}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Users;
