import axios from "axios";

export const APITS = axios.create({
  baseURL: process.env.REACT_APP_TS,
});

export const setAuthToken = (token) => {
  if (token) {
    APITS.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete APITS.defaults.headers.commin["Authorization"];
  }
};
