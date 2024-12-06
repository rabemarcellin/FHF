export const loginService = async (userName, password) => {
  try {
    const request = new Request(`${API_URL}/user/login`, {
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
  } catch (error) {
    console.error(error);
  }
};
