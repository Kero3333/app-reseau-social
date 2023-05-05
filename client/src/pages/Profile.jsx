import { useContext, useEffect, useState } from "react";
import { Banner } from "../components/Banner";
import { Post } from "../components/Post";
import { Navbar } from "../components/Navbar";
import { Network } from "../components/Network";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { TokenContext } from "../index";
import { useParams } from "react-router-dom";

export const Profile = () => {
  const { token } = useContext(TokenContext);
  const { id } = useParams();
  const [profile, setProfile] = useState({});
  const [posts, setPosts] = useState([]);
  const [network, setNetwork] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [email, setEmail] = useState("");
  const [isUserLogged, setIsUserLogged] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/api/user/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.profile.email) data.profile.email = data.email;
        setProfile(data.profile);
        setPosts(data.posts);
        setNetwork(data.network);
        setEmail(data.email);
        if (token == id) setIsUserLogged(true);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [token]);

  const handleClick = () => setIsEditing(!isEditing);

  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSubmitEdit = async (e) => {
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });
    console.log(selectedFile);
    const token = localStorage.getItem("token");
    const data = {
      email: email,
      firstname: profile.firstname,
      lastname: profile.lastname,
      emailVisibility: false,
      avatar: await toBase64(selectedFile),
    };

    fetch(`http://localhost:3000/api/user/${token}`, {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => console.log(res))
      .catch((e) => console.error(e));
  };

  const handleChangeFile = (e) => setSelectedFile(e.target.files[0]);

  const handleClickAddNetwork = () => {
    const data = {
      id: token,
      userId: id,
    };

    fetch("http://localhost:3000/api/network/", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => console.log(res))
      .catch((e) => console.error(e));
  };

  return (
    <>
      <Navbar />
      {isEditing ? (
        <div className="profile-edit">
          <form onSubmit={handleSubmitEdit}>
            <label htmlFor="firstname">firstname :</label>
            <input
              type="text"
              name="firstname"
              value={profile.firstname}
              onChange={handleChange}
            />
            <label htmlFor="lastname">lastname :</label>
            <input
              type="text"
              name="lastname"
              value={profile.lastname}
              onChange={handleChange}
            />
            <label htmlFor="avatar">avatar :</label>
            <input type="file" name="avatar" onChange={handleChangeFile} />
            <button type="submit">Validate</button>
          </form>
        </div>
      ) : (
        <div className="profile">
          <div className="profile-container">
            {isUserLogged ? (
              <div className="profile-modify" onClick={handleClick}>
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  style={{ color: "#005eff", height: "1.5rem" }}
                />
                <span>edit the profile</span>
              </div>
            ) : null}
            <Banner avatar={profile.avatar} />
            <div className="description">
              <div>
                <h1 className="name">
                  {profile.firstname} {profile.lastname}
                </h1>
                {!isUserLogged ? (
                  <button onClick={handleClickAddNetwork}>
                    Add to network
                  </button>
                ) : null}
              </div>
              <p>{profile.description}</p>
            </div>
            <div className="posts-container">
              <div className="posts">
                {posts.map((post, i) => {
                  return (
                    <Post key={i} userId={id} profile={profile} post={post} />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="network-container">
            <div></div>
            <Network network={network} />
          </div>
        </div>
      )}
    </>
  );
};
