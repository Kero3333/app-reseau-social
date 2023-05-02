import { useEffect, useState } from "react";
import defaultAvatar from "../../public/assets/img/profile-default.jpg";

export const Comment = ({
  userId,
  postId,
  comment,
  nbComments,
  setNbComments,
}) => {
  const [profile, setProfile] = useState({});
  const [dateFormat, setDateFormat] = useState("");
  const [isRemoved, setIsRemoved] = useState(false);

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

  const handleClickRemove = () => {
    const data = {
      id: userId,
      postId,
      commentId: comment.id,
    };

    fetch("http://localhost:3000/api/post/comment/remove", {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status == 200) {
          setIsRemoved(true);
          setNbComments(nbComments - 1);
        }
      })
      .catch((e) => console.error(e));
  };

  return !isRemoved ? (
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
      {comment.id_user == localStorage.getItem("token") ? (
        <div className="options">
          <span onClick={handleClickRemove}>remove</span>
        </div>
      ) : null}
    </div>
  ) : null;
};
