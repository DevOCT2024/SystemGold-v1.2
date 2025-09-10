import { api } from "../api"


export const PaymentPlan = async () => {
    try {
        const response = await api.post("/create-payment")
        return response
    } catch (error) {
        console.error(error)    
    }
}