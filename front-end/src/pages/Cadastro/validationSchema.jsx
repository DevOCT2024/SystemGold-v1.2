import * as yup from 'yup'
export const validationSchema =  yup.object().shape({
        name: yup.string().required('Campo Obrigatório!'),
        email: yup.string().required('Campo Obrigatório!'),
        telefone: yup.string().required('Campo Obrigatório!').min(11).max(11),
        password: yup.string().required("Campo Obrigátório!").min(8),
        confirmPassword: yup.string().oneOf([yup.ref("password"), null], "As Senhas não são iguais")

    })
