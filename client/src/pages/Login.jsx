import { useNavigate } from "react-router-dom";
import { Guard } from "../components/Guard";
import { useContext, useEffect } from "react";
import { TokenContext } from "..";

export const Login = () => {
  const navigate = useNavigate();
  const { token, setToken } = useContext(TokenContext);

  handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const newToken = await Guard.login(email, password);
    if (!newToken) return false;
    setToken(newToken);
    console.log(token);
    navigate("/");
  };

  return (
    <div className="login">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="email" placeholder="email" />
        <input type="password" name="password" placeholder="password" />
        <button type="submit">Log in</button>
      </form>
      <span>
        You doesn't have an account ? register <a href="/register">now</a>
      </span>
    </div>
  );
};
