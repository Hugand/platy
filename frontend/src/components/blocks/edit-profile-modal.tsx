import { User } from "../../models/User"
import TextField from "../atoms/text-field"
import '../../styles/blocks/edit-profile-modal.scss'
import { useState, useEffect } from "react"

type EditProfileModalProps = {
    user: User;
    closeModal: Function;
}

function EditProfileModal({ user, closeModal }: EditProfileModalProps) {
    const [ userInfo, setUserInfo ] = useState(user)
    const [ userProfilePic, setUserProfilePic ]: Array<any> = useState(null)

    useEffect(() => {
        setUserInfo(userInfo)
    }, [user])

    const setNewUserProfilePic = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if(e !== null && e.target !== null && e.target.files !== null) {
            const file: File = e.target.files[0]
            setUserProfilePic(file)
        }
    }

    const getProfilePic = (): string => {

        console.log(userProfilePic, userInfo.profilePic)

        if(userProfilePic === null)
            return userInfo.profilePic
        else
            return window.URL.createObjectURL(userProfilePic)
    }
    

    return <section className="edit-profile-container">
        <button className="close-btn" onClick={() => closeModal()}>x</button>

        <input type="file" className="file-inp" id="profile-pic-inp" onChange={setNewUserProfilePic}/>
        <label className="profile-pic" htmlFor="profile-pic-inp">
            <img className="profile-pic" src={getProfilePic()} alt="edit profile pic"/>
            <div className="overlay"><label htmlFor="profile-pic-inp">Change profile image</label></div>
        </label>

        <label className="inp-label">First name</label>
        <TextField
            placeholder="First name"
            defaultValue={userInfo.nomeProprio}
            onInputChange={() => {}} />

        <label className="inp-label">Last name</label>
        <TextField
            placeholder="Last name"
            defaultValue={userInfo.apelido}
            onInputChange={() => {}} />

        <label className="inp-label">Username</label>
        <TextField
            placeholder="Username"
            defaultValue={userInfo.username}
            onInputChange={() => {}} />

        <button className="btn">Save</button>
    </section>
}

export default EditProfileModal