import axios from "axios";
import { get_columns } from "../../api";
import { Dispatch } from "redux";

export const columns = (id: number) => async (dispatch: Dispatch) => {
  let token;
  if (sessionStorage.getItem("token") === null) {
    token = [];
  } else {
    token = JSON.parse(sessionStorage.getItem("token") ?? "");
  }
  const columnsData = await axios.get(get_columns(id), {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  dispatch({
    type: "GET_COLUMNS",
    payload: {
      columns: columnsData,
    },
  });
};
