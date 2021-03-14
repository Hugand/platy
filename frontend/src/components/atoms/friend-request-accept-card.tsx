import { User } from "../models/User"

type FRAcceptCardProps = {
    userData: User
}

function FriendRequestAcceptCard({ userData }: FRAcceptCardProps) {

    const acceptFriendRequest = () => {

    }

    return <article className="user-add-card">
        <img src={ userData.profilePic } />
        <label>{ userData.nomeProprio + " " + userData.apelido }</label>
        <button 
            className="btn"
            onClick={acceptFriendRequest}>Accept</button>
    </article>
}

export default FriendRequestAcceptCard