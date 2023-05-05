export class Guard {
  static logged;

  static login = async (email, password) => {
    const token = await fetch("http://localhost:3000/api/auth/signin", {
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
        this.logged = true;
        return data;
      })
      .catch((e) => {
        console.error(e);
      });
    return token;
  };

  static isLogged = () => {
    return this.logged;
  };
}
