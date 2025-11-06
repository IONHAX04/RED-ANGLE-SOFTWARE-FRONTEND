// src/services/leaveRequestService.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Add new request (leave/permission)
export const addLeaveRequest = async (requestData: any) => {
  try {
    const response = await axios.post(`${API_URL}/request`, requestData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    throw new Error(message);
  }
};

// Update request
export const updateLeaveRequest = async (
  id: number,
  requestData: Partial<any>
) => {
  console.log("id", id);
  try {
    const response = await axios.put(
      `${API_URL}/request/${requestData.employeeId}`,
      requestData
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update request"
    );
  }
};

// Fetch all requests (optional, for listing)
export const fetchLeaveRequests = async () => {
  try {
    const response = await axios.get(`${API_URL}/request/leaveReq`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch requests"
    );
  }
};

// Delete request
export const deleteLeaveRequest = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/request/leaveReq/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete request"
    );
  }
};
