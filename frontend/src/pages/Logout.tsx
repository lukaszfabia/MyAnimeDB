import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

export default function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}
