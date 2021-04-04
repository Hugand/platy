import '../../styles/atoms/chat-list-card.scss'

function ChatListCard({ chat }: any) {
    return <div className="chat-list-card">
        <img src={chat.profilePic} alt="profile pic"/>
        <article>
            <h4>{ `${chat.nomeProprio} ${chat.apelido}` }</h4>
            <p>{ chat.msg.length >= 25 
                ? chat.msg.substr(0, 25) + '...'
                : chat.msg }</p>
        </article>
    </div>
}

export default ChatListCard