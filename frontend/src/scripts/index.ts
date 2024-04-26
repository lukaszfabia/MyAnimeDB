import axios from 'axios';

const fetchData = async (route = "") => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/" + route);
    return response.data;
  } catch (error) {
    return [];
  }
};

export { fetchData };

