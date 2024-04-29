import api from './api';
import { PASSWORD_REGEX } from '../constants/const';
import React from 'react';


export const fetchData = (route: string) => api.get(route).then((response) => response.data).catch((error) => {
  console.error(error);
  return null;
});


export const validatePassword = (
  e: React.ChangeEvent<HTMLInputElement>,
  setPasswordError: (error: string) => void,
  setPassword: (password: string) => void,
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

export const tryCreateAccount = (
  e: React.FormEvent<HTMLFormElement>,
  setUsername: (username: string) => void,
  setEmail: (email: string) => void,
  setPassword: (password: string) => void,
  setPic: (file: File) => void,
) => {
  e.preventDefault();

  const user = {
    username: username,
    email: email,
    password: password,
  };

  const formData = new FormData();
  formData.append("user.username", user.username);
  formData.append("user.email", user.email);
  formData.append("user.password", user.password);
  if (pic) {
    formData.append("avatar", pic);
  } else {
    formData.append("avatar", "");
  }

  formData.append("bio", "change me");

  api.post("/api/register/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((response) => {
    console.log(response);
    return true;
  }).catch((error) => {
    console.error(error);
    return false;
  })
}