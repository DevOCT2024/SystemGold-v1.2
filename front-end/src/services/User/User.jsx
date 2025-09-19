import axios from "axios"
import ToBase64 from "../../components/toBase64/toBase64"
import { api } from "../api"

const TRY_URLS = [
    "http://localhost:5532/api/user/updateUserInformations",
    "http://localhost:5532/api/updateUserInformations",
];

export const CreateUser = async (values) => {
    try {
        const payload = {
            name: values.name,
            email: values.email,
            telefone: values.telefone,
            password: values.password
        }
        const response = await api.post('/CreateUser', payload)

        return response
    } catch (error) {
        console.error(error)
    }
}

export const GetUser = async (id) => {
    try {

        const userData = await api.get(`/GetUser/${id}`)
        return userData.data

    } catch (error) {
        console.error(error)
    }
}

// 

export const updateUserInformations = async ({ addresses, Logo, id }) => {
    const payload = { Adress: addresses, Logo, id };

    let lastErr;
    for (const url of TRY_URLS) {
        try {
            console.log("[API PATCH]", url);
            const response = await axios.patch(url, payload, {
                headers: { "Content-Type": "application/json" },
            });
            return response;
        } catch (error) {
            const status = error?.response?.status;
            if (status !== 404) {
                console.error("updateUserInformations falhou:", status, error?.response?.data || error?.message);
                throw error;
            }
            lastErr = error;
        }
    }
    throw lastErr || new Error("Nenhuma rota de updateUserInformations encontrada");
};



const GET_PATHS = [
  'http://localhost:5532/api/user/club-image',
  'http://localhost:5532/api/club-image',
];

export const getClubImage = async (id) => {
  for (const base of GET_PATHS) {
    try {
      const res = await axios.get(`${base}/${id}`, { headers: { 'Accept': 'application/json' } });
      return res; // mantém shape esperado (res.data é string URL ou "")
    } catch (error) {
      const status = error?.response?.status;
      if (status !== 404) {
        console.error('getClubImage falhou:', status, error?.response?.data || error?.message);
        throw error;
      } 
      // tenta próxima rota
    }
  }
  return { data: '' }; // fallback
};
