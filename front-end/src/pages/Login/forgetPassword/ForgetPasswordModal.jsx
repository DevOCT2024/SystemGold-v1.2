import { Form, Formik } from "formik"
import { Button } from "../../../components/button/button"
import Input from "../../../components/inputs/Input"
import './index.css'
import { ForgetPassword } from "../../../services/User/ForgetPassword"

export const ForgetPasswordModal = () =>{
    
    return(
        <div className="modalForgetPassword">
            <Formik
            initialValues={{}}
            onSubmit={ForgetPassword}
            >
                <Form style={{display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"10px"}}>
                    <Input style={{backgroundColor:'rgba(230, 44, 49, 0.5)', width:'80%'}} name={'email'} placeholder={'Digite seu email'}/>
                    <Button style={{width:'50%'}} type={'submit'}>Enviar</Button>
                </Form>
            </Formik>
        </div>
    )
}

