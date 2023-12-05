const initState = {
  cards: {},
};
import { Action } from "redux";

const cardsReducers = (
  state = initState,
  action: { payload: { cards: Action }; type: string }
) => {
  switch (action.type) {
    case "GET_CARDS":
      return { ...state, cards: action.payload.cards };
    default:
      return { ...state };
  }
};

export default cardsReducers;
