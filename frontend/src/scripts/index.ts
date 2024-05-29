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
  blankPassword: boolean,
  setPasswordError: (error: string) => void,
  setPassword: (password: string) => void
) => {
  const potentialPassword = e.target.value;
  const isValidPassword = PASSWORD_REGEX.test(potentialPassword);

  if (!isValidPassword) {
    if (!blankPassword) {
      document.getElementById("submit")?.removeAttribute("disabled");
      setPasswordError("");
    } else {
      document.getElementById("submit")?.setAttribute("disabled", "true");
      setPasswordError(
        "Password must be at least 8 characters long and contain at least one letter and one number"
      );
    }
  } else {
    setPasswordError("");
    setPassword(potentialPassword);
    document.getElementById("submit")?.removeAttribute("disabled");
  }
};


// interfaces 

export interface CheckboxProps {
  id: string;
  label: string;
  value: string;
  name: string;
}

export interface AnimePropertyData {
  id: string;
  name: string;
}

// do wywalenia 
export interface AnimeProps {
  id: string;
  title: string;
  img_url: string;
  rating: string;
  state: string;
  episodes: string;
  type: string;
  genres: string[];
}

export interface ProfileProps {
  username: string;
  email: string;
  avatar?: string;
  bio: string;
  is_staff: boolean;
}

export interface StatsData {
  total_time: string;
  watched_episodes: string;
  fav_genres: string[];
}

export interface PostsProps {
  content: string
  date_posted: string
  id_post: number
  title: string
}

export interface Review {
  review: string;
  user: string;
  anime: string;
}