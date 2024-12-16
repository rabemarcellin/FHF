import actionsType from "./actions";

const reducer = (state, action) => {
  switch (action.type) {
    case actionsType.START_DRAG_LEFT:
      return { ...state, isDraggingLeft: true };

    case actionsType.START_DRAG_RIGHT:
      return { ...state, isDraggingRight: true };

    case actionsType.MOVE_SLIDER:
      return { ...state, cutStartPosition: action.startXPosition };

    case actionsType.MOVE_SLIDER_END:
      return { ...state, cutEndPosition: action.startXPosition };

    case actionsType.END_DRAG_LEFT:
      return { ...state, isDraggingLeft: false };

    case actionsType.END_DRAG_RIGHT:
      return { ...state, isDraggingRight: false };

    case actionsType.PLAY_VIDEO:
      return { ...state, isPlaying: true };

    case actionsType.PAUSE_VIDEO:
      return { ...state, isPlaying: false };

    case actionsType.SET_VIDEO_SIZE:
      return { ...state, cutVideoSize: action.cutVideoSize };
    default:
      return state;
  }
};
export default reducer;
