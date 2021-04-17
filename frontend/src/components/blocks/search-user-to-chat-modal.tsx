import { useState, useEffect } from "react"
import { TextField, UserSelectCard } from ".."
import { searchFriends } from "../../helpers/api"
import { User } from "../../models/User"
import { useStateValue } from "../../state"
import '../../styles/blocks/search-user-to-chat-modal.scss'

type SearchUserToChatModalProps = {
    selectUser: Function
}

function SearchUserToChatModal({ selectUser }: SearchUserToChatModalProps) {
    const [ searchTerm, setSearchTerm ] = useState('')
    const [friendsList, setFriendsList] = useState<Array<User>>([])
    const [, dispatch ] = useStateValue()

    useEffect(() => {
        searchFriendsHandler(searchTerm)
    }, [])

    const onInputChange = (val: string) => { 
        setSearchTerm(val)
        searchFriendsHandler(val)
    }

    const searchFriendsHandler = async (searchStr: string) => {
        try {
            const newFriendsList: Array<User> = await searchFriends(localStorage.getItem('authToken') || '', searchStr)
            setFriendsList(newFriendsList)
        } catch (e) {
            console.log(e)
        }
    }

    const selectUserToChat = (user: User) => {
        selectUser(user)
        dispatch({ type: 'changeChatDataCurrRoomId', value: '' })
    }

    return <div className="content">
        <header>
            <h2>Find new friends</h2>
            <TextField placeholder="Search" value={ searchTerm } onInputChange={onInputChange}/>
        </header>

        <div className="users-list-container">
            { (friendsList.length === 0) ? <h2>No friends to show</h2>
            : friendsList.map((user: User) => 
                <UserSelectCard
                    key={ user.uid }
                    userData={ user }
                    selectHandler={ selectUserToChat } /> ) }
        </div>
    </div>
}

export default SearchUserToChatModal