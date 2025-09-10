import axios from "axios";

const API = "http://localhost:5532";

export const getAllBoxs = async () => {
  try {
    const res = await axios.get(`${API}/box`);
    return Array.isArray(res.data) ? res.data : [];
  } catch (e) {
    console.error(e);
    return [];
  }
};
