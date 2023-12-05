import { combineReducers } from "redux";
import usersReducer from "./usersReducer";
import boardsReducer from "./get-board-reducer";
import columnsReducers from "./get-columns-reducers";
import cardsReducers from "./get-cards-reducers";
import idReducers from "./id-reducers";

const rootReducer = combineReducers({
  user: usersReducer,
  boards: boardsReducer,
  columns: columnsReducers,
  cards: cardsReducers,
  id: idReducers,
});

export default rootReducer;
