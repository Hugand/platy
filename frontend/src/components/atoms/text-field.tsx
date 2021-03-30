import '../../styles/atoms/text-field.scss'

function TextField({ 
    type='input',
    placeholder,
    onInputChange,
    defaultValue,
    classes='',
    value
}: any) {
    if(type === 'textarea')
        return <textarea
            className={classes}
            value={value}
            onChange={(e: any) => onInputChange(e.target.value)}></textarea>
    else
        return <input
            type="text"
            className="text-field"
            placeholder={placeholder}
            defaultValue={defaultValue}
            onChange={(e) => onInputChange(e.target.value)}/>
}

export default TextField