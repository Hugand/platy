import '../../styles/atoms/user-add-card.scss'
import { sendFriendRequest, cancelFriendRequest } from '../../helpers/api'
import { User } from '../../models/User'
import { CardType } from '../../models/Enums'
import { useEffect, useState } from 'react'

type UserAddCardProp = {
    userData: User;
    cardType: CardType;
    refreshList: Function;
}

function UserAddCard({ userData, cardType, refreshList }: UserAddCardProp) {
    const [ buttonClass, setButtonClass ] = useState("btn")
    const [ buttonText, setButtonText ] = useState("")

    useEffect(() => {
        switch(cardType) {
            case CardType.STRANGER:
                setButtonClass("btn")
                setButtonText("Add friend")
                break
            case CardType.FRIEND_REQUEST:
                setButtonClass("btn-secondary")
                setButtonText("Friend request sent")
                break
            case CardType.FRIEND:
                setButtonClass("btn-secondary")
                setButtonText("Already friends")
                break
            default:
        }
    }, [cardType])

    const sendFriendRequestHandler = async () => {
        const authUserToken: string | null = localStorage.getItem("authToken")
        if(authUserToken !== null) {
            let res: any;

            try {
                if(cardType === CardType.FRIEND_REQUEST) {
                    res = await cancelFriendRequest(userData.id, authUserToken)
                } else if(cardType === CardType.STRANGER) {
                    res = await sendFriendRequest(userData.id, authUserToken)
                }

                console.log(res)
                if(res.status === "success") {
                    refreshList();
                }
            } catch(e) {
                console.log(e)
            }
        }
    }

    const handleOnMouseEnter = () => {
        setButtonClass('btn-secondary-red')
        if(cardType === CardType.FRIEND_REQUEST) {
            setButtonText("Cancel friend request")
        } else if(cardType === CardType.FRIEND) {
            setButtonText("Already friends")
        } else {
            setButtonClass('')
            setButtonText("Add friend")
        }
    }

    const handleOnMouseLeave = () => {
        setButtonClass('btn-secondary')
        if(cardType === CardType.FRIEND_REQUEST) {
            setButtonText("Friend request sent")
        } else if(cardType === CardType.FRIEND) {
            setButtonText("Friend")
        } else {
            setButtonClass('')
            setButtonText("Add friend")
        }
    }

    return <article className="user-add-card">
        <img src={ `data:image/png;base64, ${ userData.profilePic}` } alt="profile pic"/>
        <label>{ userData.nomeProprio + " " + userData.apelido }</label>
        <button 
            className={"btn " + buttonClass}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
            onClick={sendFriendRequestHandler}>{ buttonText }</button>
    </article>
}

export default UserAddCard