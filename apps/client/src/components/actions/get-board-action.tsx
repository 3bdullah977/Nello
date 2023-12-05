import axios from "axios";
import { get_boards } from "../../api";
import { Dispatch } from "redux";

export const getBoards = () => async (dispatch: Dispatch) => {
  let token;
  if (sessionStorage.getItem("token") === null) {
    token = [];
  } else {
    token = JSON.parse(sessionStorage.getItem("token") ?? "");
  }
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
