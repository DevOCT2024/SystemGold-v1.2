import * as  Yup from 'yup'

export const validationSchema = Yup.object().shape({
    email: Yup.string()
    .required('Campo Obrigatório!'),

    password: Yup.string()
    .required('Campor Obrigatório!')
})