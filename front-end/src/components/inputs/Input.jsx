import { Field } from "formik"
import './index.css'

const Input = ({type, name, placeholder, style, onChange}) =>{
    return(
        <Field name={name}  type={type} placeholder={placeholder} style={style} />
    )
} 

export default Input