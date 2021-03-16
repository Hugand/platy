import { useStateValue } from '../../state'
import '../../styles/views/profile.scss'
import Modal from 'react-modal';
import EditProfileModal from '../blocks/edit-profile-modal';
import { useEffect, useState } from 'react';
import { GlobalStateAction } from '../../globalState';
import { getUserData } from '../../helpers/api';
import { UserData } from '../../models/UserData';

const customStyles = {
    content : {
        width: "fitContent"
    }
  };

function UserProfileView() {
    // const [ userData, setUserData ] = useState(new UserData())
    const [ { userData }, dispatch ] = useStateValue()
    const [ isModalOpen, setIsModalOpen ] = useState(false)

    useEffect(() => {
        refreshProfile()
    }, [])
    
    const closeModal = () => {
        setIsModalOpen(false)
    }

    const openModal = () => {
        setIsModalOpen(true)
    }

    const refreshProfile = async () => {
        const authToken: string = localStorage.getItem("authToken") || ""
    
        const res: UserData = await getUserData(authToken)

        const dispatchData: GlobalStateAction = {
            type: 'changeUser',
            value: res
        }

        dispatch(dispatchData)
    }

    return <section className="content-container">
        <section className="profile-container">
            <div className="banner"></div>

            <div className="profile-content">
                <img src={ `data:image/png;base64, ${userData.user.profilePic}` } alt="profile pic"/>
                <h1>{ `${userData.user.nomeProprio} ${userData.user.apelido}` }</h1>
                <h2>{ userData.user.username }</h2>
                <h3>{ userData.friendsCount } friends</h3>
                <button className="btn" onClick={openModal}>Edit</button>
                <hr/>
                <button className="btn btn-secondary">Logout</button>
            </div>
        </section>

        <Modal
            isOpen={isModalOpen}
            onAfterClose={refreshProfile}
            onRequestClose={closeModal}
            style={customStyles}
            ariaHideApp={false}>
            <EditProfileModal
                user={userData.user}
                closeModal={closeModal}/>
        </Modal>
   </section>
}

export default UserProfileView