import { useState, useEffect } from 'react'
import { getUserData } from '../../helpers/api'
import '../../styles/views/profile.scss'
import { UserData } from '../models/UserData'

function UserProfileView() {
    const [ userData, setUserData ] = useState(new UserData)

    useEffect(() => {
        handleGetUserData()
    }, [])

    const handleGetUserData = async () => {
        const authToken: string = localStorage.getItem("authToken")?.toString() 
            || localStorage.getItem("authToken")!.toString()
    
        const res: UserData = await getUserData(authToken)

        setUserData(res)
    }

    return <section className="content-container">
        <section className="profile-container">
            <div className="banner"></div>

            <div className="profile-content">
                <img src={userData.user.profilePic} />
                <h1>{ `${userData.user.nomeProprio} ${userData.user.apelido}` }</h1>
                <h2>{ userData.user.username }</h2>
                <h3>{ userData.friendsCount } friends</h3>
                <button className="btn">Edit</button>
                <hr/>
                <button className="btn btn-secondary">Logout</button>
            </div>
        </section>
   </section>
}

export default UserProfileView