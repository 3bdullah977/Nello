const initState = {
  columns: [],
};
import { Action } from "redux";

const columnsReducers = (
  state = initState,
  action: { payload: { columns: Action }; type: string }
) => {
  switch (action.type) {
    case "GET_COLUMNS":
      return { ...state, columns: action.payload.columns };
    default:
      return { ...state };
  }
};

export default columnsReducers;
