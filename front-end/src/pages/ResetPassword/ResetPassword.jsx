import { ErrorMessage, Form, Formik } from "formik"
import { useParams } from "react-router-dom"
import Input from "../../components/inputs/Input"
import './index.css'
import logo from '../../sources/logo-padrao.png'
import { Button } from "../../components/button/button"
import { ChangePassword } from "../../services/User/ForgetPassword"
import { validationSchema } from "./validationSchema"

const ResetPassword = () =>{
    const {token} = useParams()

    const confirmPassword = (value) => {
        ChangePassword(token, value);
    }

    return(
        <main className="mainResetPassword">
            <Formik
            initialValues={{}}
            onSubmit={confirmPassword}
            validationSchema={validationSchema}
            >
                <Form style={{display:"flex", flexDirection:"column", height:'70%',alignItems:"center", justifyContent:"center", gap:"10px", backgroundColor:"white", width:'30%', borderRadius:'20px', boxShadow:'10px 10px 26px 4px rgba(0,0,0,0.75);'}} className="FormForgetPassword"> 

                    <img src={logo} style={{width:'50%'}} alt="Logo-Padrão" /> 

                    <div className="textRedefinir">
                        <h2>Redefinir Senha</h2>
                    </div>
                    <Input name={'password'} type={'password'} style={{width: "70%", backgroundColor:'rgb(230, 44, 49, 0.5)'}} placeholder={'Digite sua nova senha'}/>
                    <ErrorMessage name="password" component={'span'}/>

                    <Input name={'confirmPassword'} type={'password'} style={{width:"70%", backgroundColor:'rgb(230, 44, 49, 0.5)'}} placeholder={'Digite sua nova senha'}/>
                    <ErrorMessage name="confirmPassword" component={'span'}/>

                    <Button style={{width:'30%'}}>Salvar</Button>
                </Form>
            </Formik>
        </main>
    )
}

export default ResetPassword;