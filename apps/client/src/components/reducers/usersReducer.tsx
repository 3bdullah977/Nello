const initState = {
  user: [],
};
import { Action } from "redux";

const usersReducer = (
  state = initState,
  action: { payload: { user: Action }; type: string }
) => {
  switch (action.type) {
    case "GET_USERS":
      return { ...state, user: action.payload.user };
    default:
      return { ...state };
  }
};

export default usersReducer;
