export const Register = ({ setToken }) => {
  handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const firstname = e.target.firstname.value;
    const lastname = e.target.lastname.value;

    fetch("http://localhost:3000/api/auth/signup", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ email, password, firstname, lastname }),
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
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="firstname" placeholder="firstname" />
        <input type="text" name="lastname" placeholder="lastname" />
        <input type="text" name="email" placeholder="email" />
        <input type="password" name="password" placeholder="password" />
        <button type="submit">Register</button>
      </form>
      <span>
        You already have an account ? login <a href="/login">now</a>
      </span>
    </div>
  );
};
