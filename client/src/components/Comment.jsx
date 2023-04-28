import { useEffect, useState } from "react";
import defaultAvatar from "../../public/assets/img/profile-default.jpg";

export const Comment = ({ comment }) => {
  const [profile, setProfile] = useState({});
  const [dateFormat, setDateFormat] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3000/api/user/${comment.id_user}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data.profile);
      })
      .catch((e) => {
        console.error(e);
      });
    const date = new Date(comment.date);
    const month =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1;
    setDateFormat(`${date.getDate()}/${month}/${date.getFullYear()}`);
  }, [comment]);

  return (
    <div className="comment">
      <div className="comment-infos">
        <div className="comment-profile">
          <div className="comment-image">
            <img
              src={profile.avatar != "" ? profile.avatar : defaultAvatar}
              alt="avatar.png"
            />
          </div>
          <span>
            {profile.firstname} {profile.lastname}
          </span>
        </div>
        <span>{dateFormat}</span>
      </div>
      <div className="message">{comment.message}</div>
    </div>
  );
};
