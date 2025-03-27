import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

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
import DiaryBox from "./components/DiaryBox.jsx"; //diarybox
import TimeCapsuleBox from "./components/TimeCapsuleBox"; //timecapsulebox
import Calendar from "./components/Calendar"; //calendar
import Challenge from "./components/Challenge"; //challenge
import AdminPage from "./components/AdminPage"; //adminpage
import AdminEditChallenge from "./components/AdminEditChallenge"; //admineditChallenge
import AdminEditAsset from "./components/AdminEditAsset"; //admineditAsset
import AdminEditAds from "./components/AdminEditAds"; //admineditAds
import AdBanner from "./components/AdBanner"; //Adbanner

import CommunityPage from "./components/CommunityPage";
import UploadPost from "./components/UploadPost";
import PostList from "./components/PostList";
import PostDetailPage from "./components/PostDetailPage";

import DigitalAlbumList from "./components/DigitalAlbumList";
import NewAlbumPage from "./components/NewAlbumPage";
import AlbumDetail from "./components/AlbumDetail";

import MakeDiary from "./components/MakeDiary";
import PieceBoxMakeDiary from "./components/PieceBoxMakeDiary";

import CollaborativeDiaryInvite from "./components/CollaborativeDiaryInvite";
import CollaborativeDiary from "./components/CollaborativeDiary";
import InvitationList from "./components/InvitationList";


const AppContent = () => {
  const location = useLocation();

  const excludedPaths = ["/home", "/signup", "/login", "/adminPage", "/adminEditChallenge", "/adminEditSticker", "/adminEditAds"];

  return (
    <div>
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
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/challenge" element={<Challenge />} />
        <Route path="/adminPage" element={<AdminPage />} />
        <Route path="/adminEditChallenge" element={<AdminEditChallenge />} />
        <Route path="/adminEditAsset" element={<AdminEditAsset />} />
        <Route path="/adminEditAds" element={<AdminEditAds />} />

        <Route path="/community" element={<CommunityPage />} />
        <Route path="/uploadPost" element={<UploadPost />} />
        <Route path="/postList" element={<PostList />} />
        <Route path="/post/:id" element={<PostDetailPage />} />

        <Route path="/digitalAlbum" element={<DigitalAlbumList />} />
        <Route path="/album/new" element={<NewAlbumPage />} />
        <Route path="/album/:albumId" element={<AlbumDetail />} />

        <Route path="/makeDiary" element={<MakeDiary />} />
        <Route path="/pieceBoxMakeDiary" element={<PieceBoxMakeDiary />} />

        <Route path="/collaborative-diary-invite" element={<CollaborativeDiaryInvite />} />
<Route path="/collaborative-diary/:diaryId" element={<CollaborativeDiary />} />
<Route path="/invitations" element={<InvitationList />} />

      </Routes>

      {!excludedPaths.includes(location.pathname) && <AdBanner />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;