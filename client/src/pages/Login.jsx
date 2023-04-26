import { useEffect } from "react";

export const Login = ({ setToken }) => {
  handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    fetch("http://localhost:3000/api/auth/signin", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("token", data);
        setToken(data);
      })
      .catch((e) => {
        console.error(e);
      });
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
