import "./components/style/app/globals.css";
// import Design from "./design";
// import Prototip from "./prorotip";
// import Test from "./test";
// import Trello from "./trello";
// import Finall from "./final";
import { ThemeProvider } from "@/components/theme-provider";
import "./components/style/app.scss";
import Board from "./components/elemnts/home";
import Nav from "./components/elemnts/nav";
import BoardsList from "./components/elemnts/boards-list";
// import { DemoCreateAccount } from "./components/elemnts/register-auth";
import { DemoLoginAccount } from "./components/elemnts/login-auth";
import { useDispatch, useSelector } from "react-redux";
import { users } from "./components/actions/usersAction";
import { getBoards } from "./components/actions/get-board-action";
import { useEffect } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { columns } from "../src/components/actions/get-columns-action";

function App() {
  // const design = Design();
  // const prototipp = Prototip();
  // const test = Test();
  // const trello = Trello();
  // const final = Finall();

  // const card = design[0];
  // console.log(card);

  // const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(columns());
    // dispatch(getBoards());
  }, []);

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="app">
          <BrowserRouter>
            <Nav />
            {/* <DemoCreateAccount /> */}
            {/* <DemoLoginAccount /> */}
            {/* <Switch> */}
            <Routes>
              <Route path="/" element={<BoardsList />} />
              <Route path="/home" element={<Board />} />
            </Routes>
            {/* </Switch> */}
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
