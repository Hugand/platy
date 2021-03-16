import { useStateValue } from '../../state'
import '../../styles/views/profile.scss'
import Modal from 'react-modal';
import EditProfileModal from '../blocks/edit-profile-modal';
import { useState } from 'react';

const customStyles = {
    content : {
        width: "fitContent"
    }
  };

function UserProfileView() {
    // const [ userData, setUserData ] = useState(new UserData())
    const [ { userData } ] = useStateValue()
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    
    const closeModal = () => {
        setIsModalOpen(false)
    }

    const openModal = () => {
        setIsModalOpen(true)
    }

    return <section className="content-container">
        <section className="profile-container">
            <div className="banner"></div>

            <div className="profile-content">
                <img src={ userData.user.profilePic } alt="profile pic"/>
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
            onRequestClose={closeModal}
            style={customStyles}>
            <EditProfileModal
                user={userData.user}
                closeModal={closeModal}/>
        </Modal>
   </section>
}

export default UserProfileView