import { TextField } from '@atoms/textField'
import '@styles/views/search.scss'
import { User } from '@models/User'
import { cancelFriendRequest, clearSession, searchUsers, sendFriendRequest } from '@helpers/api'
import { useState } from 'react'
import { SearchUserResponse } from '@models/SearchUserResponse'
import { CardType } from '@models/Enums'
import { UserCard } from '@atoms/userCard'
import { FriendStatusButton } from '@atoms/friendStatusButton'

export const SearchView: React.FC = () => {
    const [ searchResults, setSearchResults ] = useState(new SearchUserResponse())
    const [ searchTerm, setSearchTerm ] = useState('')
    const friendTypeActionHandler = {
        'FRIEND_REQUEST': cancelFriendRequest,
        'STRANGER': sendFriendRequest,
        'FRIEND': (_: number, __: string): Promise<void> => { return new Promise<void>((resolve, reject) => {})}
    }

    const searchFriendsBySearchTerm = async (searchTerm: string): Promise<void> => {
        setSearchTerm(searchTerm)
        try {
            const users: SearchUserResponse = await searchUsers(searchTerm, localStorage.getItem("authToken"))
            setSearchResults(users)
        } catch (e: any) {
            console.log(e);
        }
    }

    const getCardTypeByUser = (user: User) => {
        if(searchResults.friendRequestedUsersId.includes(user.id))
            return CardType.FRIEND_REQUEST
        else if(searchResults.friendUsersId.includes(user.id))
            return CardType.FRIEND
        else
            return CardType.STRANGER
    }

    const sendFriendRequestHandler = async (user: User) => {
        const authUserToken: string = localStorage.getItem("authToken") || ''
        const cardType = getCardTypeByUser(user)

        try {
            let res: any = await friendTypeActionHandler[cardType](user.id, authUserToken);

            if(res.status === "success")
                searchFriendsBySearchTerm(searchTerm);
            
        } catch(e) {
            console.log(e)
            clearSession()
        }
    }

    return <section className="search-view-container">
        <div className="content">
            <header>
                <h2>Find new friends</h2>
                <TextField placeholder="Search" onInputChange={searchFriendsBySearchTerm}/>
            </header>

            <div className="users-list">
                {(searchResults.searchedUsers.length === 0 && searchTerm === '')
                    ? <h2>Search for the name or username</h2>
                    : searchResults.searchedUsers.length > 0 
                        ? searchResults.searchedUsers.map((user: User) =>
                            <UserCard
                                key={ user.uid }
                                user={user}
                                actionButton={<FriendStatusButton
                                    cardType={getCardTypeByUser(user)}
                                    clickHandler={ () => sendFriendRequestHandler(user) }
                                />} />
                        )
                        : <h2>No users found</h2> }
            </div>
        </div>
    </section>
}