import { useEffect, useState } from "react"
import { Chat } from "@models/Chat"
import { User } from "@models/User"
import '@styles/atoms/txt-message-blob.scss'

interface Props {
    chat: Chat
    viewingUser: User
    isPreview: boolean
}

export const TextMessageBlob: React.FC<Props> = ({ chat, viewingUser, isPreview }) => {
    const [ blobClasses, setBlobClasses ] = useState(new Array<string>('txt-msg-blob-container'))
    const [ bottomLabelClasses, setBottomLabelClasses ] = useState(new Array<string>())

    useEffect(() => {
        assignClasses()
    }, [chat, isPreview, viewingUser.id])

    const assignClasses = () => {
        const tmpBlobClasses = [...blobClasses]
        const tmpBottomLabelClasses = [...bottomLabelClasses]

        if(isPreview) {
            tmpBlobClasses.push('align-right', 'preview')
            tmpBottomLabelClasses.push('align-right')
        } else if(chat.userOrigin === viewingUser.id) {
            tmpBlobClasses.push('align-right', 'sender')
            tmpBottomLabelClasses.push('align-right')
        } else {
            tmpBlobClasses.push('align-left', 'reader')
            tmpBottomLabelClasses.push('align-left')
        }

        setBlobClasses(tmpBlobClasses)
        setBottomLabelClasses(tmpBottomLabelClasses)
    }

    const getFormattedSentDate = (): string => {
        if(chat.timestamp === null && chat.timestamp === undefined) return ''
        const sentDate = new Date(chat.timestamp)
        const hour = sentDate.getHours() 
        const min = sentDate.getMinutes()
        const hourStr = hour > 9 ? `${hour}` : `0${hour}`
        const minStr = min > 9 ? `${min}` : `0${min}`

        return hourStr + ':' + minStr
    }

    return <div className="txt-msg-blob-row">
        <article className={blobClasses.join(' ')}>
            { chat.msg }
        </article>
        <label className={bottomLabelClasses.join(' ')}>
            { isPreview ? 'Sending...' : getFormattedSentDate()}
        </label>
    </div>
}

export default TextMessageBlob