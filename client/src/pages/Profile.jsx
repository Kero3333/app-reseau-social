import { useEffect, useState } from "react";
import { Banner } from "../components/Banner";
import { Post } from "../components/Post";
import { Navbar } from "../components/Navbar";

export const Profile = ({ token }) => {
  const [profile, setProfile] = useState({});
  const [posts, setPosts] = useState([]);
  const [network, setNetwork] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/user/${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.profile.email) data.profile.email = data.email;
        setProfile(data.profile);
        setPosts(data.posts);
        setNetwork(data.network);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [token]);

  return (
    <>
      <Navbar />
      <div className="profile">
        <div className="profile-container">
          <Banner avatar={profile.avatar} />
          <div className="description">
            <h1 className="name">
              {profile.firstname} {profile.lastname}
            </h1>
            <p>{profile.description}</p>
          </div>
          <div className="posts-container">
            <div className="posts">
              {posts.map((post, i) => {
                return (
                  <Post key={i} userId={token} profile={profile} post={post} />
                );
              })}
            </div>
          </div>
        </div>
        <div className="network-container">
          <div></div>
          <div className="network">
            <h2>Network</h2>
            <div className="network-content"></div>
          </div>
        </div>
      </div>
    </>
  );
};
