import { User } from '@models/User';
import TextField from '@atoms/textField';
import '@styles/blocks/edit-profile-modal.scss';
import { useState, useEffect } from 'react';
import { updateUser } from '@helpers/api';

interface Props {
    user: User;
    closeModal: () => void;
}

export const EditProfileModal: React.FC<Props> = ({ user, closeModal }) => {
    const [userInfo, setUserInfo] = useState(user);
    const [userProfilePic, setUserProfilePic] = useState(new File([], 'img'));

    const setNewUserProfilePic = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e !== null && e.target !== null && e.target.files !== null) {
            const file: File = e.target.files[0];
            setUserProfilePic(file);
        }
    };

    const onInputChange = (inputLabel: string, value: string) => {
        const newUser: User = { ...userInfo };
        switch (inputLabel) {
            case 'username':
                newUser.username = value;
                break;
            case 'first_name':
                newUser.nomeProprio = value;
                break;
            case 'last_name':
                newUser.apelido = value;
                break;
            default:
        }
        setUserInfo(newUser);
    };

    const getProfilePic = (): string => {
        if (userProfilePic.size === 0) return `data:image/png;base64, ${userInfo.profilePic}`;
        else return window.URL.createObjectURL(userProfilePic);
    };

    const saveChanges = async () => {
        const authToken: string = localStorage.getItem('authToken') || '';

        await updateUser(userInfo, userProfilePic, authToken);

        closeModal();
    };

    useEffect(() => {
        setUserInfo(user);
    }, [user]);

    return (
        <section className="edit-profile-container">
            <button className="close-btn" onClick={() => closeModal()}>
                x
            </button>

            <input type="file" className="file-inp" id="profile-pic-inp" onChange={setNewUserProfilePic} />
            <label className="profile-pic" htmlFor="profile-pic-inp">
                <img className="profile-pic" src={getProfilePic()} alt="edit profile pic" />
                <div className="overlay">
                    <label htmlFor="profile-pic-inp">Change profile image</label>
                </div>
            </label>

            <label className="inp-label">First name</label>
            <TextField
                placeholder="First name"
                defaultValue={userInfo.nomeProprio}
                onInputChange={(v: string) => onInputChange('first_name', v)}
            />

            <label className="inp-label">Last name</label>
            <TextField
                placeholder="Last name"
                defaultValue={userInfo.apelido}
                onInputChange={(v: string) => onInputChange('last_name', v)}
            />

            <label className="inp-label">Username</label>
            <TextField
                placeholder="Username"
                defaultValue={userInfo.username}
                onInputChange={(v: string) => onInputChange('username', v)}
            />

            <button className="btn" onClick={(e) => saveChanges()}>
                Save
            </button>
        </section>
    );
};
