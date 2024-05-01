import api from "./api";
import { PASSWORD_REGEX } from "../constants/const";
import React from "react";

export const fetchData = (route: string) =>
  api
    .get(route)
    .then((response) => response.data)
    .catch((error) => {
      console.error(error);
      return null;
    });

export const validatePassword = (
  e: React.ChangeEvent<HTMLInputElement>,
  setPasswordError: (error: string) => void,
  setPassword: (password: string) => void
) => {
  const potentialPassword = e.target.value;
  if (!PASSWORD_REGEX.test(potentialPassword)) {
    setPasswordError(
      "Password must be at least 8 characters long and contain at least one letter and one number"
    );
    document.getElementById("submit")?.setAttribute("disabled", "true");
  } else {
    setPasswordError("");
    setPassword(potentialPassword);
    document.getElementById("submit")?.removeAttribute("disabled");
  }
};
