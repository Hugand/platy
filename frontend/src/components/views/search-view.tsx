import { TextField, UserAddCard } from '..'
import '../../styles/views/search.scss'
import { User } from '../../models/User'
import { searchUsers } from '../../helpers/api'
import { useState } from 'react'
import { SearchUserResponse } from '../../models/SearchUserResponse'
import { CardType } from '../../models/Enums'

function SearchView() {
    const [ searchResults, setSearchResults ] = useState(new SearchUserResponse())
    const [ searchTerm, setSearchTerm ] = useState("")

    const onInputChange = async (searchTerm: string): Promise<void> => {
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

    return <section className="search-view-container">
        <div className="content">
            <header>
                <h2>Find new friends</h2>
                <TextField placeholder="Search" onInputChange={onInputChange}/>
            </header>

            <div className="users-list">
                { (searchResults.searchedUsers.length === 0 && searchTerm === "") ? <h2>Search for the name or username</h2>
                : searchResults.searchedUsers.length > 0 
                    ? searchResults.searchedUsers.map((user: User) => 
                        <UserAddCard
                            key={ user.uid }
                            userData={user}
                            cardType={ getCardTypeByUser(user) }
                            refreshList={ () => onInputChange(searchTerm) }/>) 
                    : <h2>No users found</h2> }

            </div>
        </div>
    </section>
}

export default SearchView