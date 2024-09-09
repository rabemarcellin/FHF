import { API_URL } from "../helpers/constants";

export const uploadChunkService = async (index, videoChunk) => {
  const endpoint = `${API_URL}/upload`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      "Chunk-Index": index,
    },
    body: videoChunk,
    duplex: "half",
  });

  const reader = response.body.getReader();

  return reader;
};
