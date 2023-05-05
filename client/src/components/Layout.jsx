import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { TokenContext } from "..";
import { Guard } from "./Guard";
import { Navigate } from "react-router-dom";

export const Layout = () => {
  const { token, setToken } = useContext(TokenContext);

  useEffect(() => {
    const tokenLocal = localStorage.getItem("token");
    setToken(tokenLocal);
    console.log(token);
    if (token) {
      fetch("http://localhost:3000/api/auth", {
        method: "GET",
        headers: {
          token: token ?? tokenLocal,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.status == 200) Guard.logged = true;
        })
        .catch((e) => console.error(e));
    }
  }, [token]);

  return <>{Guard.isLogged() ? <Outlet /> : <Outlet />}</>;
};
