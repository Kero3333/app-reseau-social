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
  const [comments, setComments] = useState([]);

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
  }, [post]);

  const handleClick = () => {
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

  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      const message = e.target.value;
      if (message.length < 1) return false;
      const id = localStorage.getItem("token");
      const data = {
        id,
        postId: post.id,
        userId: userId,
        message,
      };

      fetch("http://localhost:3000/api/post/comment/add", {
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
  );
};
