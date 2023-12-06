import "./components/style/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import "./components/style/app.scss";
import Nav from "./components/elemnts/nav";
import BoardsList from "./components/elemnts/boards-list";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DemoLoginAccount } from "./components/elemnts/login-auth";
import Board from "./components/elemnts/home";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <div className="app">
            <BrowserRouter>
              <Nav />
              <Routes>
                <Route path="/login" element={<DemoLoginAccount />} />
                <Route path="/boards" element={<BoardsList />} />
                <Route path="/boards/:boardId" element={<Board />} />
              </Routes>
            </BrowserRouter>
          </div>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
