import { useEffect, useState } from "react"
import { Chat } from "../../models/Chat"
import { User } from "../../models/User"
import '../../styles/atoms/txt-message-blob.scss'

type TextMessageBlobProps = {
    chat: Chat
    viewingUser: User
}

function TextMessageBlob({ chat, viewingUser }: TextMessageBlobProps) {
    const [ blobClasses, setBlobClasses ] = useState(new Array<string>('txt-msg-blob-container'))

    useEffect(() => {
        const tmpBlobClasses = [...blobClasses]
        if(chat.userOrigin === viewingUser.id)
            tmpBlobClasses.push('align-right', 'sender')
        else
            tmpBlobClasses.push('align-left', 'reader')

        setBlobClasses(tmpBlobClasses)
    }, [chat, viewingUser.id])

    return <div className="txt-msg-blob-row">
        <article className={blobClasses.join(' ')}>
            { chat.msg }
        </article>
    </div>
}

export default TextMessageBlob