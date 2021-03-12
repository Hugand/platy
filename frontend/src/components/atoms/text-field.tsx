import '../../styles/atoms/text-field.scss'

function TextField({ placeholder, onInputChange }: any) {
    return <input
        type="text"
        className="text-field"
        placeholder={placeholder}
        onChange={(e) => onInputChange(e.target.value)}/>
}

export default TextField