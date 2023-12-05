import axios from "axios";
import { get_cards } from "../../api";
import { Dispatch } from "redux";

export const cards =
  (columnsId: number, boardsId: number) => async (dispatch: Dispatch) => {
    let token;
    if (sessionStorage.getItem("token") === null) {
      token = [];
    } else {
      const tokenFromStorage = sessionStorage.getItem("token") ?? "";
      token = JSON.parse(tokenFromStorage);
    }
    const cardsData = await axios.get(get_cards(columnsId, boardsId), {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({
      type: "GET_CARDS",
      payload: {
        cards: cardsData,
      },
    });
  };
