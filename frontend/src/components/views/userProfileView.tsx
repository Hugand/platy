import { useStateValue } from '../../state'
import '@styles/views/profile.scss'
import Modal from 'react-modal';
import { EditProfileModal } from '@blocks/editProfileModal';
import { FriendsListModal } from '@blocks/friendsListModal';
import { useEffect, useState } from 'react';
import { clearSession, getUserData } from '@helpers/api';
import { UserData } from '@models/UserData';

const customStyles = {
    content : {
        width: "fitContent"
    }
};

export const UserProfileView: React.FC = () => {
    const [ { userData }, dispatch ] = useStateValue()
    const [ isEditModalOpen, setIsEditModalOpen ] = useState(false)
    const [ isFriendsModalOpen, setIsFriendsModalOpen ] = useState(false)

    useEffect(() => {
        refreshProfile()
    }, [])
    
    const openEditModal = () => { setIsEditModalOpen(true) }
    const closeEditModal = () => { setIsEditModalOpen(false) }

    const openFriendsModal = () => { setIsFriendsModalOpen(true) }
    const closeFriendsModal = () => { setIsFriendsModalOpen(false) }

    const refreshProfile = async () => {
        const authToken: string = localStorage.getItem("authToken") || ''
    
        try {
            const res: UserData = await getUserData(authToken)
            dispatch({ type: 'changeUser', value: res })
        } catch (e) {
            clearSession()
        }
    }

    return <section className="content-container">
        <section className="profile-container">
            <div className="banner"></div>

            <div className="profile-content">
                <img src={ `data:image/png;base64, ${userData.user.profilePic}` } alt="profile pic"/>
                <h1>{ `${userData.user.nomeProprio} ${userData.user.apelido}` }</h1>
                <h2>{ userData.user.username }</h2>
                <button className="text-btn" onClick={openFriendsModal}>{ userData.friendsCount } friends</button>
                <button className="btn" onClick={openEditModal}>Edit</button>
                <hr/>
                <button className="btn btn-secondary">Logout</button>
            </div>
        </section>

        <Modal
            isOpen={isEditModalOpen}
            onAfterClose={refreshProfile}
            onRequestClose={closeEditModal}
            style={customStyles}
            ariaHideApp={false}>
            <EditProfileModal
                user={userData.user}
                closeModal={closeEditModal}/>
        </Modal>

        <Modal
            isOpen={isFriendsModalOpen}
            onAfterClose={refreshProfile}
            onRequestClose={closeFriendsModal}
            style={customStyles}
            ariaHideApp={false}>
            <FriendsListModal
                closeModal={closeFriendsModal}/>
        </Modal>
   </section>
}