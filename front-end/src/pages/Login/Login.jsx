import { Field, Form, Formik, ErrorMessage } from 'formik';
import logo from '../../sources/logo-branca.png'
import './index.css'
import { Button } from '../../components/button/button';
import { validationSchema } from './validationSchema';
import { loginUser } from '../../services/User/authservice';
import { useState } from 'react';
import Modal from '../../components/modal/modal';
import { useNavigate } from 'react-router-dom';
import {ForgetPasswordModal} from './forgetPassword/ForgetPasswordModal';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faExclamation} from '@fortawesome/free-solid-svg-icons'


const Login = () =>{
    const [isModal, setIsModal] = useState(false)
    const [showForgetPassword, setShowForgetPassword] = useState(false);
    const navigate = useNavigate()

    const navageteCreateAccount = () =>{
        navigate('/register')
    }

    const handleClickForgetPassword = () =>{
        setShowForgetPassword((prev)=> !prev)
    }

    const closeModal = () => {
        setIsModal(false);
    };

    const login = async (values) =>{
        try {
            const response = await loginUser(values)

            if(response.access_token){
                localStorage.setItem('authToken', response.access_token)
                localStorage.setItem("userId", response.userData.id)


                navigate(`/HomePage/${response.userData.id}`)

            }else if(response.status === 401){

                setIsModal(true)
    
            }
            
        } catch (error) {
            console.error(error)
        }
    }
    return(
        <main className="login">
           {isModal && <Modal styleModalContent={{height:'25%'}} onClose={closeModal} icon={<FontAwesomeIcon icon={faExclamation} size='2x' style={{color:'red'}}/>} message="Senha incorreta!" />}
           {showForgetPassword && <Modal onClose={handleClickForgetPassword} content={<ForgetPasswordModal/>} message={'Digite o Email da Conta'}/>}

            <section className="backgroundLogin">

                <article className='aboutLogin'>

                    <div className="logoLogin">
                        <img src={logo} style={{width:'30%'}} alt="logo-cartaz-pratico" />
                    </div>


                    <div className="sloganLogin">
                        <h1>Navegue nesta</h1>
                        <h1>experiência Incrível.</h1>
                    </div>
                </article>

            </section>

            <section className="loginContent">
                <Formik 
                 initialValues={{email:'', password:''}}
                 validationSchema={validationSchema}
                 onSubmit={login}
                >
                    <Form className='FormLogin'>

                        <div className="textArea">

                            <h2>Login</h2>
                            <p>Preencha os campos abaixo </p>
                            <p>com seus dados de acesso.</p>

                        </div>

                        <div className="formArea">

                            <div className="inputTextLogin">

                                <ErrorMessage className='errorMessage' name='email' component={'span'}/>
                                <Field
                                 name='email'
                                 placeholder='Digite Seu Email'
                                />

                                
                                <ErrorMessage className='errorMessage' name='password' component={'span'}/>
                                <Field
                                 name='password'
                                 placeholder='Digite Sua Senha'
                                 type='password'
                                />

                                


                            </div>

                            <div className="buttonsLogin">
                                <Button type={'submit'} className={'buttonAcessar'}>{"Acessar"}</Button>
                                <Button onClick={navageteCreateAccount} className={'buttonCriar'}>{"Criar Minha Conta"}</Button>
                            </div>
                            <div className="forgetPassword">
                                <Button className={'forgetPassword'} onClick={handleClickForgetPassword}>{"esqueci a senha"}</Button>
                            </div>
                        </div>
                    </Form>
                </Formik>
            </section>
        </main>
    )
}

export default Login;