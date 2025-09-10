import * as yup from 'yup';

export const validationSchema = yup.object().shape({
    password: yup.string().required('Campo Obrigatório!').min(8, ('A Senha deve ter 8 Digítos!')),
    confirmPassword: yup.string().required('Campo Obrigatório!').oneOf([yup.ref("password")], "As Senhas não estão iguais"),
})