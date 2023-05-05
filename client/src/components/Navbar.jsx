import { useContext } from "react";
import { TokenContext } from "..";

export const Navbar = () => {
  const { token } = useContext(TokenContext);

  return (
    <div className="navbar">
      <nav>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>Network</li>
          <li>
            <a href={`/profile/${token}`}>Profile</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};
