export const isDragIntoSlider = (event, sliderElement) => {
  // todo: ajouter marche de n%
  const rect = sliderElement.getBoundingClientRect();
  const checkHorizontal =
    event.clientX >= rect.left && event.clientX <= rect.right;
  const checkVertical =
    event.clientY >= rect.top && event.clientY <= rect.bottom;

  return checkHorizontal && checkVertical;
};

// todo: faire à ce que le sliderBar soit le drag

export const moveSidebarLeft = (
  mouseMoveEvent,
  sliderRect,
  sidebarLeft,
  minDistanceInPixels,
  cutEndPosition
) => {
  const dragPositionX = mouseMoveEvent.clientX;
  const deltaXPosition = dragPositionX - sliderRect.left;

  let slideXSliderPosition = deltaXPosition;

  if (deltaXPosition <= 0) {
    slideXSliderPosition = 0;
  } else if (
    deltaXPosition >=
    sliderRect.width - minDistanceInPixels - cutEndPosition
  ) {
    slideXSliderPosition =
      sliderRect.width - minDistanceInPixels - cutEndPosition;
  }

  sidebarLeft.style.left = slideXSliderPosition + "px";
  return slideXSliderPosition;
};

export const moveSidebarRight = (
  mouseMoveEvent,
  sliderRect,
  sidebarRight,
  minDistanceInPixels,
  cutStartPosition
) => {
  const dragPositionX = mouseMoveEvent.clientX;
  const sidebarRect = sidebarRight.getBoundingClientRect();

  const deltaXPosition = dragPositionX - sliderRect.left;

  let slideXSliderPosition = deltaXPosition;

  if (deltaXPosition <= cutStartPosition + minDistanceInPixels) {
    slideXSliderPosition = cutStartPosition + minDistanceInPixels;
  } else if (deltaXPosition >= sliderRect.width) {
    slideXSliderPosition = sliderRect.width;
  }

  sidebarRight.style.left = slideXSliderPosition - sidebarRect.width + "px";
  return slideXSliderPosition;
};

// todo: assigner la longueur du sliderbar en fonction de la longueur de la video
// todo: trouver le delta, entre le point de début et le point ou se trouve le drag => position ou se situe le sidebar dans la vidéo
export const getVideoPosition = (
  sliderElement,
  videoDuration,
  relativeXSliderPosition
) => {
  const sliderRect = sliderElement.getBoundingClientRect();
  /* const relativeXSliderPosition = slideBarElement.offsetLeft; */
  const videoPosition =
    (relativeXSliderPosition / sliderRect.width) * videoDuration;
  return videoPosition || 0;
};
