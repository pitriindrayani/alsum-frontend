import axios from "axios";

export const APIMS = axios.create({
  baseURL: process.env.REACT_APP_MS,
});

export const setAuthToken = (token) => {
  if (token) {
    APIMS.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete APIMS.defaults.headers.commin["Authorization"];
  }
};
