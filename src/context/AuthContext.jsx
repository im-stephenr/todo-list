import React, { createContext, useEffect, useReducer } from "react";
import jwt_decode from "jwt-decode";

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        authData: action.payload,
      };
    case "LOGOUT":
      return {
        authData: null,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, { authData: null });

  // Handle token expiration
  useEffect(() => {
    const stored_data = JSON.parse(localStorage.getItem("user"));
    if (stored_data) {
      const decoded_token = jwt_decode(stored_data.token);
      // check if token expired
      if (decoded_token.exp * 1000 > Date.now()) {
        // if token is not expired, set authData from AuthContext with data from localStorage
        dispatch({
          type: "LOGIN",
          payload: {
            userId: stored_data.userId,
            username: stored_data.username,
            fullName: stored_data.fullName,
            token: stored_data.token,
          },
        });
      } else {
        dispatch({ type: "LOGOUT" });
        // remove local storage
        localStorage.removeItem("user");
      }
    }
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ ...authState, dispatch }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};
