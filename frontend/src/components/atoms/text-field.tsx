import '../../styles/atoms/text-field.scss'

function TextField({ 
    placeholder,
    onInputChange,
    defaultValue,
    classes='',
    value
}: any) {
     return <input
        type="text"
        className={"text-field " + classes}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        onChange={(e) => onInputChange(e.target.value)}/>
}

export default TextField