import axios from "axios";

export const APILA = axios.create({
  baseURL: process.env.REACT_APP_LA,
});

export const setAuthToken = (token) => {
  if (token) {
    APILA.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete APILA.defaults.headers.commin["Authorization"];
  }
};
