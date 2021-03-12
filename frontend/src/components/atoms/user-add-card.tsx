import '../../styles/atoms/user-add-card.scss'

function UserAddCard({ userData }:any) {
    const sendFriendRequest = () => {
        console.log("Send friend request")
    }

    return <article className="user-add-card">
        <img src={ userData.profilePic } />
        <label>{ userData.nomeProprio + " " + userData.apelido }</label>
        <button className="btn" onClick={sendFriendRequest}>Add friend</button>
    </article>
}

export default UserAddCard