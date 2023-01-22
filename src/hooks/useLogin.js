import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const useLogin = () => {
  const [loginError, setLoginerror] = useState({ isError: false, message: "" });
  const navigate = useNavigate();
  const { authState, dispatch } = useContext(AuthContext);

  const login = async (loginData) => {
    try {
      await fetch(`http://localhost:3000/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw response;
        })
        .then((result) => {
          if (result.error) {
            setLoginerror({ isError: true, message: result.error });
            // remove local storage
            localStorage.removeItem("user");
          } else {
            setLoginerror({ isError: false, message: "" });
            console.log("LOGGING YOU IN", result);
            // save local storage
            localStorage.setItem("user", JSON.stringify(result));
            // call auth context
            dispatch({ type: "LOGIN", payload: result });
            // navigate to home page
            navigate("/");
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  return { login, loginError };
};
