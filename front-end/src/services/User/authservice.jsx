import axios from "axios";
import { api } from "../api"

const loginUser = async (values) =>{
    try {
        const response = await api.post('/UserLogin', values)
        return response.data
    } catch (error) {
        console.error(error);
        if(error.status === 401){
            return error
        }
    }
}

export{
    loginUser
}
