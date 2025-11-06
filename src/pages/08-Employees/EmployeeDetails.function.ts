import axios from "axios";
import type { Employee } from "./EmployeeDetails.interface";

const API_URL = import.meta.env.VITE_API_URL;

// ✅ Get all employees
export const getEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await axios.get(`${API_URL}/routes/employees`);
    return response.data.data; // assuming API response { success, data: [...] }
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch employees"
    );
  }
};

// ✅ Get single employee by ID
export const getEmployeeById = async (id: number): Promise<Employee> => {
  try {
    const response = await axios.get(`${API_URL}/routes/employees/${id}`);
    return response.data.data; // assuming API response { success, data: {...} }
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch employee"
    );
  }
};

// ✅ Add new employee
export const addEmployee = async (employeeData: Partial<Employee>) => {
  try {
    const response = await axios.post(
      `${API_URL}/routes/addEmployee`,
      employeeData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to add employee"
    );
  }
};

// ✅ Update employee
export const updateEmployee = async (
  id: number,
  employeeData: Partial<Employee>
) => {
  try {
    const response = await axios.put(
      `${API_URL}/routes/employees/${id}`,
      employeeData
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to update employee"
    );
  }
};

// ✅ Delete employee
export const deleteEmployee = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/routes/employees/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to delete employee"
    );
  }
};
