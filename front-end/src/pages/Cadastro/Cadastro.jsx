import { Field, Form, Formik, ErrorMessage } from 'formik';
import logo from '../../sources/logo-branca.png'
import './index.css'
import { Button } from '../../components/button/button';
import { useState } from 'react';
import Modal from '../../components/modal/modal';
import { CreateUser } from '../../services/User/User';
import { validationSchema } from './validationSchema';
import { useNavigate } from 'react-router-dom';

const Register = () =>{
    const navigate = useNavigate()
    const [isModal, setIsModal] = useState(false)
    const closeModal = () => {
        setIsModal(false);
    };

    const createUser = async (values) =>{

        try {
            const response = await CreateUser(values);
 
            if(response.data.access_token){
                localStorage.setItem('authToken', response.data.access_token)
                localStorage.setItem("userId", response.data.userData.id)
                navigate(`/Plans/${response.data.userData.id}`)
            }
        } catch (error) {
            console.error(error.response.data.error)
            if(error.response.data.error){
                setIsModal(true)
            }
        }
    }
    return(
        <main className="register">
           {isModal && <Modal styleModalContent={{height:'25%'}} onClose={closeModal} message="Email já Cadastrado!" content={''} />}

            <section className="backgroundRegister">

                <article className='aboutRegister'>

                    <div className="logoRegister">
                        <img src={logo} style={{width:'30%'}} alt="logo-cartaz-pratico" />
                    </div>


                    <div className="sloganRegister">
                        <h1>Navegue nesta</h1>
                        <h1>experiência Incrível.</h1>
                    </div>
                </article>

            </section>

            <section className="RegisterContent">
                <Formik 
                 initialValues={{
                    name:'',
                    email:'',
                    telefone:'',
                    password:''
                 }}
                 validationSchema={validationSchema}
                 onSubmit={createUser}
                >
                    <Form className='FormRegister'>

                        <div className="textArea">

                            <h2>Cadastre-se</h2>
                            <p>Preencha os campos abaixo.</p>

                        </div>

                        <div className="formArea">

                            <div className="inputTextRegister">

                                <ErrorMessage className='errorMessage' name='name' component={'span'}/>
                                <Field
                                 name='name'
                                 placeholder='Digite Seu Nome'
                                />

                                
                                <ErrorMessage className='errorMessage' name='email' component={'span'}/>
                                <Field
                                 name='email'
                                 placeholder='Digite Seu Email'
                                />

                                
                                <ErrorMessage className='errorMessage' name='telefone' component={'span'}/>
                                <Field
                                 name='telefone'
                                 placeholder='Digite Seu telefone'
                                />

                                
                                <ErrorMessage className='errorMessage' name='password' component={'span'}/>
                                <Field
                                 name='password'
                                 placeholder='Digite Sua Senha'
                                 type='password'
                                />

                                <ErrorMessage className='errorMessage' name='confirmPassword' component={'span'}/>
                                <Field
                                 name='confirmPassword'
                                 placeholder='Confirme Sua Senha'
                                 type='password'
                                />

                                


                            </div>

                            <div className="buttonsRegister">
                                <Button className={'buttonAcessar'} style={{width:'50%'}}>{"Criar"}</Button>
                            </div>
                        </div>
                    </Form>
                </Formik>
            </section>
        </main>
    )
}

export default Register;