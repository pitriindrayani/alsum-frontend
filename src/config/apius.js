import axios from "axios";

export const APIUS = axios.create({
  baseURL: process.env.REACT_APP_US,
});

export const setAuthToken = (token) => {
  if (token) {
    APIUS.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete APIUS.defaults.headers.commin["Authorization"];
  }
};
