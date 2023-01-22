import { useState } from "react";

export const useRegister = () => {
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);

  const register = async (registerData) => {
    try {
      await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw response;
        })
        .then((result) => {
          console.log("REGISTERED SUCCESSFULLY!", result);
          setIsRegistrationSuccess(true);
        });
    } catch (err) {
      console.log(err);
      setIsRegistrationSuccess(false);
    }
  };

  return { register, isRegistrationSuccess, setIsRegistrationSuccess };
};
