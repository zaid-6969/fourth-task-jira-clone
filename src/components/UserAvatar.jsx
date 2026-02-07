import style from '../styles/btn.module.scss'

const UserAvatar = ({ name }) => {
  const firstLetter = name?.charAt(0).toUpperCase() || "?";

  return (
    <div className={style["user-avatar"]} title={name}>
      {firstLetter}
    </div>
  );
};

export default UserAvatar;
