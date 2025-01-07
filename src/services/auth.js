import { API_URL } from "../helpers/constants";
import api from "./api";

export const loginService = async (userName, password) => {
  try {
    const request = new Request(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName, password }),
    });
    const response = await fetch(request);
    const { authToken, refreshToken } = await response.json();
    localStorage.setItem("token", authToken);
    localStorage.setItem("refresh-token", refreshToken);

    if (authToken && refreshToken) return true;

    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getUserLogged = async () => {
  try {
    const response = await api.get("/auth/user");

    if (response.status === 401) return "KO";

    if (response.status === 200) {
      return response.data;
    }

    throw new Error("ServerFetchingUserLoggedError");
  } catch (error) {
    console.log("error", error);
    return "KO";
  }
};
