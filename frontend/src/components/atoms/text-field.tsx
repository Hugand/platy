import '../../styles/atoms/text-field.scss'

function TextField({ placeholder, onInputChange, defaultValue }: any) {
    return <input
        type="text"
        className="text-field"
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={(e) => onInputChange(e.target.value)}/>
}

export default TextField