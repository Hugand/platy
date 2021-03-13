import { TextField, UserAddCard } from '..'
import '../../styles/views/search.scss'
import { User } from '../models/User'
import { searchUsers } from '../../helpers/api'
import { useEffect, useState } from 'react'

function SearchView() {
    const [ userList, setUserList ] = useState(Array<User>())
    const [ searchTerm, setSearchTerm ] = useState("")

    // useEffect(() => {
    //     onInputChange("")
    // }, [])

    const onInputChange = async (searchTerm: string): Promise<void> => {
        setSearchTerm(searchTerm)
        try {
            const users: Array<User> = await searchUsers(searchTerm, localStorage.getItem("authToken"))
            setUserList(users)
        } catch (e: any) {
            console.log(e);
        }
    }

    return <section className="search-view-container">
        <div className="content">
            <header>
                <h2>Find new friends</h2>
                <TextField placeholder="Search" onInputChange={onInputChange}/>
            </header>

            <div className="users-list">
                { (userList.length === 0 && searchTerm == "") ? <h2>Search for the first name, last name or username</h2>
                : userList.length > 0 
                    ? userList.map((user: User) => <UserAddCard userData={user} key={ user.uid }/>) 
                    : <h2>No users found</h2> }

            </div>
        </div>
    </section>
}

export default SearchView