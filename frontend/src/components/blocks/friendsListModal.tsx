import { useEffect, useState } from 'react';
import { clearSession, getFriendsList } from '@helpers/api';
import { CardType } from '@models/Enums';
import { User } from '@models/User';
import '@styles/blocks/friends-list-modal.scss';
import { FriendStatusButton } from '@atoms/friendStatusButton';
import { UserCard } from '@atoms/userCard';

interface Props {
    closeModal: () => void;
}

export const FriendsListModal: React.FC<Props> = ({ closeModal }) => {
    const [friendsList, setFriendsList] = useState<Array<User>>([]);

    const requestFriendsList = async () => {
        const authToken: string = localStorage.getItem('authToken') || '';

        try {
            const res: Array<User> = await getFriendsList(authToken);
            if (res.length > 0) setFriendsList(res);
        } catch (e) {
            clearSession();
        }
    };

    useEffect(() => {
        requestFriendsList();
    }, []);

    return (
        <section className="friends-list">
            <button className="close-btn" onClick={() => closeModal()}>
                x
            </button>

            <div className="content">
                {friendsList.map((user) => (
                    <UserCard
                        key={user.uid}
                        user={user}
                        actionButton={<FriendStatusButton cardType={CardType.FRIEND} />}
                    />
                ))}
            </div>
        </section>
    );
};
