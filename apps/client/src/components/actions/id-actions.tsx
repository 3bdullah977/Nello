import { Dispatch } from "redux";

export const boardsID = (id: number) => (dispatch: Dispatch) => {
  dispatch({
    type: "GET_BOARDS_ID",
    payload: {
      boards: id,
    },
  });
};

export const columnsID = (id: number) => (dispatch: Dispatch) => {
  dispatch({
    type: "GET_COLUMNS_ID",
    payload: {
      columns: id,
    },
  });
};
