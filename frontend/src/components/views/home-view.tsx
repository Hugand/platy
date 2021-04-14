import { useState } from 'react'
import { RecentChatsBar } from '..'
import { useStateValue } from '../../state'
import ChatRoom from '../blocks/chat-room'
import '../../styles/views/home.scss'
import { useScreenType } from '../../hooks/useScreenType'

function HomeView() {
    const [{ chatData }] = useStateValue()
    const screenType = useScreenType()
    const [ isInRoom, setIsInRoom ] = useState(false)

    if(screenType === 'mobile')
        return <section className="home-view-container">
            {!isInRoom
                ? <RecentChatsBar setIsInRoom={setIsInRoom} />
                : <section className="place">
                    { chatData.userToChat === null 
                        ? <p>Choose a chat</p> 
                        : <ChatRoom
                            setIsInRoom={setIsInRoom}
                            friend={chatData.userToChat}/>
                    }
                </section>
            }
        </section>
    else
        return <section className="home-view-container">
            <RecentChatsBar setIsInRoom={setIsInRoom}/>

            <section className="place">
                { chatData.userToChat === null 
                    ? <p>Choose a chat</p> 
                    : <ChatRoom
                        setIsInRoom={setIsInRoom}
                        friend={chatData.userToChat}/>
                }
            </section>

        </section>
}

export default HomeView