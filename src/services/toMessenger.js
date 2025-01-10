import { API_URL } from "../helpers/constants";

export const createPartContainerService = async (videoSize) => {
  try {
    const request = new Request(`${API_URL}/messenger/part/new`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoSize: videoSize }),
    });
    const response = await fetch(request);
    const { partToken } = await response.json();
    return partToken;
  } catch (error) {
    console.error(error);
  }
};

export const endVideoPartService = async (partToken, videoSize) => {
  try {
    const request = new Request(`${API_URL}/messenger/part/end`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ partToken: partToken, videoSize: videoSize }),
    });
    await fetch(request);
  } catch (error) {
    console.error(error);
  }
};

export const uploadVideoService = async (
  videoChunk,
  partToken,
  fileName,
  position
) => {
  const endpoint = `${API_URL}/messenger/upload`;
  const formData = new FormData();
  formData.append("video", videoChunk);
  formData.append("fileName", fileName);
  formData.append("partToken", partToken);
  formData.append("position", position);

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  return response;
};
