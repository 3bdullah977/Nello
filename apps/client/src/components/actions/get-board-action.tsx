import axios from "axios";
import { get_boards } from "../../api";
import { Dispatch } from "redux";

export const getBoards = (token: string) => async (dispatch: Dispatch) => {
  console.log(token);
  const boardsData = await axios.get(get_boards(), {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  dispatch({
    type: "GET_BOARDS",
    payload: {
      boards: boardsData,
    },
  });
};
