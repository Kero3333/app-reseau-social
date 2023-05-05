import { useEffect, useState } from "react";

export const Network = ({ network }) => {
  const [persons, setPersons] = useState([]);
  const [test, t] = useState(["fsdfs"]);

  useEffect(() => {
    console.log(network);
    setPersons([]);
    network.forEach((person) => {
      fetch(`http://localhost:3000/api/user/${person.id_user}`)
        .then((res) => res.json())
        .then((data) => {
          data.profile.id = person.id_user;
          data.profile.sender = person.sender;
          data.profile.status = person.status;
          setPersons([...persons, data.profile]);
        })
        .catch((e) => {
          console.error(e);
        });
    });

    console.log(persons);
  }, [network]);

  const handleClickNetwork = () => {};

  return (
    <div className="network">
      <h2>Network</h2>
      <div className="network-content">
        {persons.map((person, i) => {
          return (
            <div key={i} className="person">
              <div className="infos">
                <div className="post-profile">
                  <div className="post-image">
                    <img
                      src={person.avatar}
                      alt="avatar.png"
                      onClick={() => navigate(`/profile/${person.id}`)}
                    />
                  </div>
                  <span onClick={() => navigate(`/profile/${person.id}`)}>
                    {person.firstname} {person.lastname}
                  </span>

                  <button onClick={handleClickNetwork}>remove</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
