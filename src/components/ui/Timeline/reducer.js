import actionsType, {
  max_zoom_scale,
  min_zoom_scale,
  zoom_scale,
} from "./actions";

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

    case actionsType.ZOOM_IN:
      return { ...state, scale: state.scale + zoom_scale };

    case actionsType.ZOOM_OUT: {
      if (state.scale > min_zoom_scale) {
        return { ...state, scale: state.scale - zoom_scale };
      }
    }

    case actionsType.MOVE_PREVIEW: {
      return { ...state, videoPosition: action.videoPosition };
    }

    case actionsType.UPDATE_DRAG_ACCORDING_ZOOM:
      return {
        ...state,
        cutStartPosition: action.newStartPosition,
        cutEndPosition: action.newEndPosition,
      };
    default:
      return state;
  }
};
export default reducer;
