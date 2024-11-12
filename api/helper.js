function split_video(video_temp_ids) {
  const video_temp_ids_length = video_temp_ids.length;
  const CHUNK_LIMIT = 9;

  const video_to_upload = [];

  const iteration = Math.ceil(video_temp_ids_length / CHUNK_LIMIT);

  for (let cpt = 0; cpt < iteration; cpt++) {
    const start =
      cpt * iteration < video_temp_ids_length
        ? cpt * iteration
        : video_temp_ids_length;
    const part = video_temp_ids.slice(start, start + CHUNK_LIMIT);
    video_to_upload.push(part);
  }

  return video_to_upload;
}

module.exports = { split_video };
