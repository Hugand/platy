import { useEffect, useState } from "react";
import { UserAddCard } from "..";
import { getFriendsList } from "../../helpers/api";
import { CardType } from "../../models/Enums";
import { User } from "../../models/User";
import '../../styles/blocks/friends-list-modal.scss'

type FriendsListModalProps = {
    closeModal: Function
}

function FriendsListModal({ closeModal }: FriendsListModalProps) {
    const [ friendsList, setFriendsList ] = useState(new Array<User>())

    const requestFriendsList = async () => {
        const authToken: string = localStorage.getItem('authToken') || ""

        const res: Array<User> = await getFriendsList(authToken);

        if(res.length > 0)
            setFriendsList(res)
    }

    useEffect(() => {
        requestFriendsList()
    }, [])

    return <section className="friends-list">
        <button className="close-btn" onClick={() => closeModal()}>x</button>

        <div className="content">
            { friendsList.map(user => 
                <UserAddCard 
                    userData={ user }
                    cardType={ CardType.FRIEND }
                    refreshList={ requestFriendsList } />) }
        </div>
    </section>
}

export default FriendsListModal