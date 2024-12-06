import { API_URL } from "../helpers/constants";

export const createPartContainerService = async (videoSize) => {
  try {
    const request = new Request(`${API_URL}/upload/part`, {
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
    const request = new Request(`${API_URL}/upload/part/finish`, {
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

export const uploadStreamVideo = async (
  partToken,
  fileName,
  videoChunk,
  position
) => {
  const endpoint = `${API_URL}/upload/stream`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      "File-Name": fileName,
      "Part-Token": partToken,
      Position: position,
    },
    body: videoChunk,
    duplex: "half",
  });

  const reader = response.body.getReader();

  return reader;
};
