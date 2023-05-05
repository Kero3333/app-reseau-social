import { useEffect, useState } from "react";
import { Comment } from "./Comment";
import defaultAvatar from "../../public/assets/img/profile-default.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export const Post = ({ userId, profile, post }) => {
  const navigate = useNavigate();
  const [postId, setPostId] = useState("");
  const [dateFormat, setDateFormat] = useState("");
  const [nbComments, setNbComments] = useState(0);
  const [nbLikes, setNbLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [displayComments, setDisplayComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [toModified, setToModified] = useState(false);
  const [message, setMessage] = useState(post.message);

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
    setComments(post.comments);

    const idUser = localStorage.getItem("token");
    const userIsInLikesArr = post.likes.findIndex((el) => el.id_user == idUser);

    if (userIsInLikesArr > -1) setIsLiked(true);
    console.log(userId);
  }, [post]);

  const handleClick = () => {
    displayComments ? setDisplayComments(false) : setDisplayComments(true);
  };

  const handleClickLike = () => {
    const data = {
      id: userId,
      userId: localStorage.getItem("token"),
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

  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      const message = e.target.value;
      if (message.length < 1) return false;
      const id = localStorage.getItem("token");
      const data = {
        id: userId,
        postId: post.id,
        userId: id,
        message,
      };

      fetch("http://localhost:3000/api/post/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
          post.comments.push({
            id: data.id,
            id_user: id,
            message,
            date: new Date().getTime(),
          });
          setComments(post.comments);
          setNbComments(nbComments + 1);
          e.target.value = "";
        })
        .catch((e) => console.error(e));
    }
  };

  const handleMouseOver = () => setShowOptions(true);
  const handleMouseLeave = () => setShowOptions(false);

  const handleClickRemove = () => {
    const data = {
      id: userId,
      postId: postId.split("-")[1],
    };

    fetch("http://localhost:3000/api/post", {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status == 200) {
          setIsRemoved(true);
        }
      })
      .catch((e) => console.error(e));
  };
  const handleClickModify = () => setToModified(true);

  const handleChange = (e) => setMessage(e.target.value);

  const handleKeyDownMessage = (e) => {
    if (e.key == "Enter") {
      const message = e.target.value;

      const data = {
        id: userId,
        postId: postId.split("-")[1],
        message,
        visiblity: "public",
      };

      fetch("http://localhost:3000/api/post", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          if (res.status == 200) setToModified(false);
        })
        .catch((e) => console.error(e));
    }
  };

  const handleClickProfile = () => navigate(`/profile/${userId}`);

  return !isRemoved ? (
    <div
      className="post"
      id={postId}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      {userId == localStorage.getItem("token") && showOptions ? (
        <div className="options">
          <span className="remove" onClick={handleClickRemove}>
            remove
          </span>
          <span className="modify" onClick={handleClickModify}>
            modify
          </span>
        </div>
      ) : null}
      <div className="infos">
        <div className="post-profile">
          <div className="post-image">
            <img
              src={profile.avatar != "" ? profile.avatar : defaultAvatar}
              alt="avatar.png"
              onClick={handleClickProfile}
            />
          </div>
          <span onClick={handleClickProfile}>
            {profile.firstname} {profile.lastname}
          </span>
        </div>
        <span>{dateFormat}</span>
      </div>
      {toModified ? (
        <div className="message">
          <textarea
            name="message"
            value={message}
            onKeyDown={handleKeyDownMessage}
            onChange={handleChange}
            rows={4}
          />
        </div>
      ) : (
        <div className="message">{message}</div>
      )}
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
          <input
            type="text"
            placeholder="Write a comment"
            onKeyDown={handleKeyDown}
          />
          <div className="comments-content">
            {comments ? (
              post.comments.map((comment, i) => {
                return (
                  <Comment
                    key={i}
                    comment={comment}
                    userId={userId}
                    postId={post.id}
                    nbComments={nbComments}
                    setNbComments={setNbComments}
                  />
                );
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
  ) : null;
};
