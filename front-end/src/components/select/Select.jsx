import './index.css'
export const Select = ({title, options, label, onChange, value, name, style, disabled, FirstOption, id})=>{
    return(
        <div className="select-container">
      {label && <label htmlFor={name}>{label}</label>}
      <select
        id={id}
        title={title}
        style={style}
        name={name}
        value={value}
        onChange={onChange}
        className="custom-select"
        disabled={disabled}
      >
        <option value="">{FirstOption}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
    )
};