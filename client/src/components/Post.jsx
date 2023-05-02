import { useEffect, useState } from "react";
import { Comment } from "./Comment";
import defaultAvatar from "../../public/assets/img/profile-default.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
export const Post = ({ userId, profile, post }) => {
  const [postId, setPostId] = useState("");
  const [dateFormat, setDateFormat] = useState("");
  const [nbComments, setNbComments] = useState(0);
  const [nbLikes, setNbLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [displayComments, setDisplayComments] = useState(false);

  useEffect(() => {
    setPostId(`${userId}-${post.id}`);
    const date = new Date(post.date);
    const month =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1;
    setDateFormat(`${date.getDate()}/${month}/${date.getFullYear()}`);
    setNbLikes(post.likes.length);
    setNbComments(post.comments.length);

    const idUser = localStorage.getItem("token");
    const userIsInLikesArr = post.likes.findIndex((el) => el.id_user == idUser);

    if (userIsInLikesArr > -1) setIsLiked(true);
  }, [post]);

  handleClick = () => {
    displayComments ? setDisplayComments(false) : setDisplayComments(true);
  };

  const handleClickLike = () => {
    const data = {
      id: localStorage.getItem("token"),
      userId: userId,
      postId: post.id,
    };
    fetch("http://localhost:3000/api/post/like", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status == 200) setIsLiked(!isLiked);
        isLiked ? setNbLikes(nbLikes - 1) : setNbLikes(nbLikes + 1);
      })
      .catch((e) => console.error(e));
  };

  return (
    <div className="post" id={postId}>
      <div className="infos">
        <div className="post-profile">
          <div className="post-image">
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
      <div className="message">{post.message}</div>
      <div className="likes-comments">
        <div className="likes" onClick={handleClickLike}>
          <FontAwesomeIcon
            icon={isLiked ? faHeartSolid : faHeart}
            style={{ color: "#ff0000", height: "1.5rem" }}
          />
          <span>{nbLikes}</span>
        </div>
        <div className="comments" onClick={handleClick}>
          <FontAwesomeIcon
            icon={faComment}
            style={{ color: "#005eff", height: "1.5rem" }}
          />
          <span>{nbComments}</span>
        </div>
      </div>
      {displayComments ? (
        <div className="comments-section">
          <input type="text" placeholder="Write a comment" />
          <div className="comments-content">
            {post.comments ? (
              post.comments.map((comment, i) => {
                return <Comment key={i} comment={comment} />;
              })
            ) : (
              <span>no comments</span>
            )}
          </div>
        </div>
      ) : (
        false
      )}
    </div>
  );
};
