import defaultAvatar from "../../public/assets/img/profile-default.jpg";

export const Banner = ({ avatar }) => {
  return (
    <div className="banner">
      <img src={avatar != "" ? avatar : defaultAvatar} alt="avatar.png" />
    </div>
  );
};
