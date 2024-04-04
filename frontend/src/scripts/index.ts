const fetchData = async (kind: string, route = "") => {
  try {
    const response = await fetch("http://127.0.0.1:8000/" + route);
    const jsonData = await response.json();
    return jsonData[kind];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export { fetchData };
