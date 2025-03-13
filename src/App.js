import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import SignUp from "./components/SignUp"; // SignUp 컴포넌트 import
import Login from "./components/Login"; //login
import MyPage from "./components/MyPage"; //mypage

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/myPage" element={<MyPage />} />
      </Routes>
    </Router>
  );
};

export default App;






