import axios from "axios"
import { api } from "../api";

export const ForgetPassword = async (value)=>{

    try {

        await api.post('/userForgetPassword', value)

    } catch (error) {
        console.error(error)
    }
}

export const ChangePassword = async (token,value)=>{

    try {
        
        await api.post(`http://localhost:3300/api/resetUserPassword/${token}`, value)  

    } catch (error) {
        console.error(error);
    }
};