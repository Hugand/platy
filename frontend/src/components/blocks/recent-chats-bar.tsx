import { useState, useEffect } from 'react'
import '../../styles/blocks/recent-chats-bar.scss'
import { TextField, ChatListCard } from '..'

function RecentChatsBar() {
    const [ searchTerm, setSearchTerm ] = useState("")

    return <section className="chats-bar-container">
        <div className="bar-header">
            <TextField placeholder="Search" onInputChange={setSearchTerm}/>
        </div>

        <div className="chat-list">
            <ChatListCard
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
                }}/>
        </div>
    </section>
}

export default RecentChatsBar