const initState = {
  boards: [],
};
import { Action } from "redux";

const boardsReducer = (
  state = initState,
  action: { payload: { boards: Action }; type: string }
) => {
  switch (action.type) {
    case "GET_BOARDS":
      return { ...state, boards: action.payload.boards };
    default:
      return { ...state };
  }
};

export default boardsReducer;
