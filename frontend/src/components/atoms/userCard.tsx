import React from 'react'
import { User } from '@models/User'
import '@styles/atoms/user-card.scss'

interface Props {
  user: User
  actionButton?: JSX.Element
  clickHandler?: (_: User) => void 
}

export const UserCard: React.FC<Props> = ({ user, actionButton, clickHandler = (_: User) => {} }) => {
  return (
    <article className="user-card" onClick={e => clickHandler(user) }>
      <img src={ `data:image/png;base64, ${ user.profilePic}` } alt="profile pic"/>

      <article>
        <h4>{`${user.nomeProprio} ${user.apelido}`}</h4>
        <label>{ user.username }</label>
      </article>

      { actionButton !== null && actionButton !== undefined &&
        <div className="action-btn"> {actionButton} </div> }
    </article>
  )
}