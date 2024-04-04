import { useState, useEffect } from "react";
import { fetchData } from "../scripts/index";

export default function Home() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData("mess").then((data) => setData(data));
  }, []);
  return (
    <div>
      <h1>Home</h1>
      <div>DATA FROM BACKEND: {data}</div>
    </div>
  );
}
