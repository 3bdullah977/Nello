const initState = {
  columns_id: [],
  boards_id: [],
  cards_id: [],
  comments_id: [],
  users_id: [],
};
import { Action } from "redux";

const idReducers = (
  state = initState,
  action: { payload: { columns: Action; boards: Action }; type: string }
) => {
  switch (action.type) {
    case "GET_COLUMNS_ID":
      return { ...state, columns_id: action.payload.columns };
    case "GET_BOARDS_ID":
      return { ...state, boards_id: action.payload.boards };
    //   case "GET_CARDS_ID":
    //   return { ...state, cards_id: };
    //   case "GET_COMMENTS_ID":
    //   return { ...state, comments_id: };
    //   case "GET_USERS_ID":
    //   return { ...state, users_id: };
    default:
      return { ...state };
  }
};

export default idReducers;
