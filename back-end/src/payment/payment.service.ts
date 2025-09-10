import { Injectable } from '@nestjs/common';
import axios from "axios";

@Injectable()
export class PaymentService {
    constructor() { }

    async createPayment() : Promise<Object> {
        try {
            const options = {
                method: 'POST',
                url: 'https://sandbox.asaas.com/api/v3/paymentLinks',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    access_token: process.env.ASAAS_API_KEY
                },
                data: {
                    billingType: 'UNDEFINED',
                    chargeType: 'RECURRENT',
                    name: 'Assinatura Plano Cartaz Prático',
                    callback: { successUrl: 'https://cartazpratico.com.br/', autoRedirect: true },
                    value: '89,90',
                    dueDateLimitDays: 1
                }
            };

            const response = await axios.request(options)
            return response.data
        } catch (error) {
            throw error;
        }

    }
}
