import { useState, useEffect } from 'react'
import '../../styles/blocks/recent-chats-bar.scss'
import { TextField, ChatListCard } from '..'
import Modal from 'react-modal';
import SearchUserToChatModal from './search-user-to-chat-modal';
import { User } from '../../models/User';
import { useStateValue } from '../../state';

function RecentChatsBar() {
    const [ search, setSearchTerm ] = useState('')
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [, dispatch ] = useStateValue()

    const setUserToChat = (user: User) => {
        dispatch({
            type: 'changeChatDataUser2Chat',
            value: user
        })
    }
    
    const selectUserHandler = (user: User) => {
        setUserToChat(user)
        setIsModalOpen(false)
    }

    return <section className="chats-bar-container">
        <div className="bar-header">
            <div>
                <TextField placeholder="Search" onInputChange={setSearchTerm}/>
                <button className="btn" onClick={() => setIsModalOpen(true)}>+</button>
            </div>
        </div>

        <div className="chat-list">
            {/* <ChatListCard
                chat={{
                    profilePic: "https://avatars.githubusercontent.com/u/24555587?s=460&u=60f5d30868fc8148ed0c65b7a863ec53431329b0&v=4",
                    nomeProprio: "Hugo", apelido: "Gomes",
                    msg: "Boas pessoal "
                }}/>
            <ChatListCard
                chat={{
                    profilePic: "https://avatars.githubusercontent.com/u/24555587?s=460&u=60f5d30868fc8148ed0c65b7a863ec53431329b0&v=4",
                    nomeProprio: "Hugo", apelido: "Gomes",
                    msg: "Boas pessoal drenado da drena drenadaBoas pessoal drenado da drena drenadaBoas pessoal drenado da drena drenadaBoas pessoal drenado da drena drenadaBoas pessoal drenado da drena drenadaBoas pessoal drenado da drena drenadaBoas pessoal drenado da drena drenadaBoas pessoal drenado da drena drenadaBoas pessoal drenado da drena drenadaBoas pessoal drenado da drena drenadaBoas pessoal drenado da drena drenadaBoas pessoal drenado da drena drenadaBoas pessoal drenado da drena drenadaBoas pessoal drenado da drena drenadaBoas pessoal drenado da drena drenadaBoas pessoal drenado da drena drenada"
                }}/>
            <ChatListCard
                chat={{
                    profilePic: "https://avatars.githubusercontent.com/u/24555587?s=460&u=60f5d30868fc8148ed0c65b7a863ec53431329b0&v=4",
                    nomeProprio: "Hugo", apelido: "Gomes",
                    msg: "Boas pessoal drenado da drena drenada"
                }}/>
            <ChatListCard
                chat={{
                    profilePic: "https://avatars.githubusercontent.com/u/24555587?s=460&u=60f5d30868fc8148ed0c65b7a863ec53431329b0&v=4",
                    nomeProprio: "Hugo", apelido: "Gomes",
                    msg: "Boas pessoal drenado da drena drenada"
                }}/> */}
        </div>



        <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            ariaHideApp={false}>
            
            <SearchUserToChatModal selectUser={selectUserHandler} />
        </Modal>
    </section>
}

export default RecentChatsBar