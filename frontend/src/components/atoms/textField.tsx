import '@styles/atoms/text-field.scss'

interface Props {
    placeholder?: string
    onInputChange: Function
    defaultValue?: string,
    classes?: string,
    value?: string
}

export const TextField: React.FC<Props> = ({ 
    placeholder,
    onInputChange,
    defaultValue,
    classes,
    value
}: any) => {
     return <input
        type="text"
        className={"text-field " + classes}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        onChange={(e) => onInputChange(e.target.value)}/>
}

export default TextField