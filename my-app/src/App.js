import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import NotFoundPage from "./pages/NotFoundPage";
import SuccessSignUp from "./pages/SuccessSignUp";
import Test from "./components/Test";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import "./style.scss";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

function App() {
  // const hostname = process.env.REACT_APP_HOST;
  // const database = process.env.REACT_APP_DATABASE;
  // const port = process.env.REACT_APP_PORT;

  // console.log(hostname);
  // console.log(database);
  // console.log(port);

  //use current logged in user
  const { currentUser } = useContext(AuthContext);

  // useEffect(() => {
  //   window.addEventListener('beforeunload', (event) => {
  //     event.preventDefault();
  //     event.returnValue = '';
  //   });
  // }, []);

  // console.log(process.env.REACT_APP_CLIENT_ID);//printing it to console

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route
            index
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />

          <Route path="signup-success" element={<SuccessSignUp />} />
          <Route path="reset-password" element={<ResetPassword />} />

          <Route path="test" element={<Test />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
