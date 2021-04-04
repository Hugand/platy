import { RecentChatsBar } from '..'
import { useStateValue } from '../../state'
import ChatRoom from '../blocks/chat-room'
import '../../styles/views/home.scss'

function HomeView() {
    const [ { chatData } ] = useStateValue()

    return <section className="home-view-container">
        <RecentChatsBar />

        <section className="place">
            { chatData.userToChat === null 
                ? <p>Choose a chat</p> 
                : <ChatRoom 
                    friend={chatData.userToChat}/>
            }
        </section>

    </section>
}

export default HomeView