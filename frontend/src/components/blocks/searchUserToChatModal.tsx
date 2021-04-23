import { useState, useEffect, useRef } from 'react';
import { TextField } from '@atoms/textField';
import { clearSession, searchFriends } from '@helpers/api';
import { User } from '@models/User';
import { useStateValue } from '../../state';
import '@styles/blocks/search-user-to-chat-modal.scss';
import { UserCard } from '../atoms/userCard';

interface Props {
    selectUser: (user: User, friendshipId?: number) => void;
}

export const SearchUserToChatModal: React.FC<Props> = ({ selectUser }) => {
    const { dispatch } = useStateValue();
    const [friendsList, setFriendsList] = useState<Array<User>>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const searchFriendsHandler = useRef((searchStr: string) => {});
    searchFriendsHandler.current = async (searchStr: string) => {
        try {
            const newFriendsList: Array<User> = await searchFriends(localStorage.getItem('authToken') || '', searchStr);
            setFriendsList(newFriendsList);
        } catch (e) {
            clearSession();
        }
    };

    const onInputChange = (val: string) => {
        setSearchTerm(val);
    };

    const selectUserToChat = (user: User) => {
        selectUser(user);
        dispatch({ type: 'changeChatDataCurrRoomId', value: '' });
    };

    useEffect(() => {
        searchFriendsHandler.current(searchTerm);
    }, [searchTerm]);

    return (
        <div className="content">
            <header>
                <h2>Find new friends</h2>
                <TextField placeholder="Search" value={searchTerm} onInputChange={onInputChange} />
            </header>

            <div className="users-list-container">
                {friendsList.length === 0 ? (
                    <h2>No friends to show</h2>
                ) : (
                    friendsList.map((user: User) => (
                        <UserCard key={user.uid} user={user} clickHandler={selectUserToChat} />
                    ))
                )}
            </div>
        </div>
    );
};
