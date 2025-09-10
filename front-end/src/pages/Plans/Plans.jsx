import './index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMedal, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../components/button/button';
import NavBar from '../HomePage/components/NavBar/NavBar';
import { PaymentPlan } from '../../services/Payment/Payment';
import { useState } from 'react';
import Modal from '../../components/modal/modal';
const Plans = () => {
    const [modal, setModal] = useState(false)
    const [paymentLink, setPaymentLink] = useState("")

    const handleSubmit = async () => {
        try {
            const response = await PaymentPlan()
            if (response.status === 201) {
                setPaymentLink(response.data.url)
                setModal(true);
            }
        } catch (error) {
            console.error(error)
        }
    }

    const payment = () => {
        window.location.href = paymentLink
    }
    return (
        <section className="plans" data-aos="fade-up" data-aos-duration="2500" data-aos-once="false">
            {modal && <Modal styleModalContent={{ height: '25%' }} onClose={() => setModal(false)} message="Efetue o pagamento do plano agora! " content={<>
                <Button style={{ width: "50%" }} onClick={() => payment()}>Pagar agora</Button>
            </>} />}
            <h1>Mude seu Plano</h1>
            <div className="plansContent">
                <div className="plan">
            
                    <div className="textPlan">
                        <h1>PREMIUM </h1>
                        <h1>ANUAL</h1>

                        <h1 style={{ fontSize: "82px" }}>R$54,90</h1>
                        <p>POR MÊS POR 12 MESES</p>
                        <p>Total: R$658,80</p>
                        <Button style={{ width: "50%", color: "black" }} onClick={() => handleSubmit()}>Assinar</Button>

                    </div>
                </div>

                <div className="plan">
                    <div className="textPlan">
                        <h1>PREMIUM </h1>
                        <h1>SEMESTRAL</h1>

                        <h1 style={{ fontSize: "82px" }}>R$65,90</h1>
                        <p>POR MÊS POR 6 MESES</p>
                        <p>Total: R$395,40</p>
                        <Button style={{ width: "50%", color: "black" }} onClick={() => handleSubmit()}>Assinar</Button>

                    </div>
                </div>

                <div className="plan">
                    <div className="textPlan">
                        <h1>PREMIUM </h1>
                        <h1>MENSAL</h1>

                        <h1 style={{ fontSize: "82px" }}>R$89,90</h1>
                        <p>POR MÊS </p>

                        <Button style={{ width: "50%", color: "black" }} onClick={() => handleSubmit()}>Assinar</Button>

                    </div>
                </div>
            </div>
        </section>
    )
}

export default Plans;