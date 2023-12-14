import "./global.css";
import "./components/style/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import "./components/style/app.scss";
import Nav from "./components/elements/nav";
import BoardsList from "./components/elements/boards-list";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./components/elements/login-auth";
import Board from "./components/elements/home";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { Documents } from "./components/documents-page";
import { CreateAccount } from "./components/register-auth";
import { Drawings } from "./components/drawings";
import { Suspense, lazy } from "react";
import { Skeleton } from "./components/ui/skeleton";
import Profile from "./components/profile";
import EditProfile from "./components/editProfile";
const DrawingPage = lazy(() => import("./components/drawing-page"));

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <div className="app min-h-screen">
            <BrowserRouter>
              <Nav />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<CreateAccount />} />
                <Route path="/boards" element={<BoardsList />} />
                <Route path="/boards/:boardId" element={<Board />} />
                <Route
                  path="/boards/:boardId/documents"
                  element={<Documents />}
                />
                <Route
                  path="/boards/:boardId/documents/:documentId"
                  element={<Documents />}
                />
                <Route
                  path="/boards/:boardId/drawings"
                  element={<Drawings />}
                />
                <Route path="/profile" element={<Profile />} />
                <Route path="/editProfile" element={<EditProfile />} />

                <Route
                  path="/boards/:boardId/drawings/:drawingId"
                  element={
                    <Suspense fallback={<Skeleton className="h-[900px]" />}>
                      <DrawingPage />
                    </Suspense>
                  }
                />
                <Route path="*" element={<Navigate to={"/login"} />} />
              </Routes>
            </BrowserRouter>
          </div>
        </ThemeProvider>
      </QueryClientProvider>
      <Toaster />
    </>
  );
}

export default App;
