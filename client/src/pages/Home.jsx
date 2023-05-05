import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { Post } from "../components/Post";

export const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((e) => console.error(e));
  }, []);

  const handleSubmit = (e) => {
    const id = localStorage.getItem("token");
    const message = e.target.message.value;
    const visibility = "public";

    const data = {
      id,
      message,
      visibility,
    };

    fetch("http://localhost:3000/api/post", {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => console.log(res))
      .catch((e) => console.error(e));
  };
  return (
    <>
      <Navbar />
      <div className="home">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="message">message :</label>
            <textarea name="message" placeholder="write a post" rows={5} />
          </div>
          <button type="submit">Post it</button>
        </form>
        <div className="posts">
          {posts.map((post, i) => {
            return (
              <Post
                key={i}
                userId={post._id}
                profile={post.profile}
                post={post.posts}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};
