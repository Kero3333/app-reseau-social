import { useEffect, useState } from "react";
import { Comment } from "../components/Comment";
import defaultAvatar from "../../public/assets/img/profile-default.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment } from "@fortawesome/free-regular-svg-icons";

export const Post = ({ userId, profile, post }) => {
  const [postId, setPostId] = useState("");
  const [dateFormat, setDateFormat] = useState("");
  const [nbComments, setNbComments] = useState(0);
  const [nbLikes, setNbLikes] = useState(0);
  const [displayComments, setDisplayComments] = useState(false);

  useEffect(() => {
    setPostId(`${userId}-${post.id}`);
    const date = new Date(post.date);
    const month =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1;
    setDateFormat(`${date.getDate()}/${month}/${date.getFullYear()}`);
    console.log(post.likes.length);
    setNbLikes(post.likes.length);
    setNbComments(post.comments.length);
  }, [post]);

  handleClick = () => {
    displayComments ? setDisplayComments(false) : setDisplayComments(true);
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
        <div className="likes">
          <FontAwesomeIcon
            icon={faHeart}
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
