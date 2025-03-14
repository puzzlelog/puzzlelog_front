import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import Home from "./components/Home"; // home
import SignUp from "./components/SignUp"; // signUp
import Login from "./components/Login"; //login
import MyPage from "./components/MyPage"; //mypage
import Friend from "./components/Friend"; //friend
import MakePiece from "./components/MakePiece"; //makepiece
import WriteTextPiece from "./components/WriteTextPiece"; //textpiece
import WriteImagePiece from "./components/WriteImagePiece"; //imagepiece
import WriteVideoPiece from "./components/WriteVideoPiece"; //videopiece
import WriteAudioPiece from "./components/WriteAudioPiece"; //audiopiece
import PieceBox from "./components/PieceBox"; //piecebox
import DiaryBox from "./components/DiaryBox"; //diarybox
import TimeCapsuleBox from "./components/TimeCapsuleBox"; //timecapsulebox

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/myPage" element={<MyPage />} />
      <Route path="/friend" element={<Friend />} />
      <Route path="/makePiece" element={<MakePiece />} />
      <Route path="/writeTextPiece" element={<WriteTextPiece />} />
      <Route path="/writeImagePiece" element={<WriteImagePiece />} />
      <Route path="/writeVideoPiece" element={<WriteVideoPiece />} />
      <Route path="/writeAudioPiece" element={<WriteAudioPiece />} />
      <Route path="/pieceBox" element={<PieceBox />} />
      <Route path="/diaryBox" element={<DiaryBox />} />
      <Route path="/timecapsuleBox" element={<TimeCapsuleBox />} />
      </Routes>
    </Router>
  );
};

export default App;






