// USERS || register
export const post_user = () => "http://localhost:3001/api/v1/users";
export const get_users = () =>
  "http://localhost:3001/api/v1/users?page=1&limit=15";

// BOARDS
export const post_board = () => "http://localhost:3001/api/v1/boards";
export const get_boards = () =>
  "http://localhost:3001/api/v1/boards?page=1&limit=15";

// COLUMNS
export const post_columns = () =>
  "http://localhost:3001/api/v1/boards/13/columns";
export const get_columns = (id: number) =>
  `http://localhost:3001/api/v1/boards/${id}/columns?page=1&limit=15`;

// CARDS
export const post_card = () =>
  "http://localhost:3001/api/v1/boards/{boardId}/columns/2/cards";
export const get_cards = (columns_id: number, boards_id: number) =>
  `http://localhost:3001/api/v1/boards/${boards_id}/columns/8/cards?page=1&limit=15`;

// AUTH || login
export const auth = () => "http://localhost:3001/api/v1/auth/login";
