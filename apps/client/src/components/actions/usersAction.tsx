import axios from "axios";
import { get_users } from "../../api";
import { Dispatch } from "redux";

export const users = () => async (dispatch: Dispatch) => {
  let token;
  if (sessionStorage.getItem("token") === null) {
    token = [];
  } else {
    token = JSON.parse(sessionStorage.getItem("token") ?? "");
  }
  const usersData = await axios.get(get_users(), {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  dispatch({
    type: "GET_USERS",
    payload: {
      user: usersData,
    },
  });
};
