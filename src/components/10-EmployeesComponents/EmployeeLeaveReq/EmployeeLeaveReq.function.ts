import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllRequests = async () => {
  try {
    const url = `${API_URL}/request`;

    const response = await axios.get(url);
    return response.data; // { success: true, data: [...] }
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch requests";
    throw new Error(message);
  }
};

export const updateRequestStatus = async (id: number, status: string) => {
  console.log('status', status)
  console.log('id', id)
  try {
    const response = await axios.put(`${API_URL}/request/${id}`, { status });
    console.log("response", response);
    return response.data; // { success: true, data: {...} }
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to update request";
    throw new Error(message);
  }
};
