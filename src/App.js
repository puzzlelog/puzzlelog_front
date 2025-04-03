import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Home from "./components/Home";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import MyPage from "./components/MyPage";
import Friend from "./components/Friend";
import MakePiece from "./components/MakePiece";
import WriteTextPiece from "./components/WriteTextPiece";
import WriteImagePiece from "./components/WriteImagePiece";
import WriteVideoPiece from "./components/WriteVideoPiece";
import WriteAudioPiece from "./components/WriteAudioPiece";
import PieceBox from "./components/PieceBox";
import DiaryBox from "./components/DiaryBox";
import TimeCapsuleBox from "./components/TimeCapsuleBox";
import Calendar from "./components/Calendar";
import Challenge from "./components/Challenge";
import AdminPage from "./components/AdminPage";
import AdminEditChallenge from "./components/AdminEditChallenge";
import AdminEditAsset from "./components/AdminEditAsset";
import AdminEditAds from "./components/AdminEditAds";
import AdBanner from "./components/AdBanner";

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
import CollaborativeDiaryBox from "./components/CollaborativeDiaryBox";

import ShootingStarBackground from "./components/ShootingStarBackground"; // ⭐ 별똥별 애니메이션 추가


const AppContent = () => {
  const location = useLocation();

  const excludedPaths = ["/home", "/signup", "/login", "/adminPage", "/adminEditChallenge", "/adminEditSticker", "/adminEditAds"];

  return (
    <>
      <ShootingStarBackground />
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-200 to-purple-300">
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
          <Route path="/diary" element={<DiaryBox />} />
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
          <Route path="/collaborativeDiaryBox" element={<CollaborativeDiaryBox />} />


        </Routes>

        {!excludedPaths.includes(location.pathname) && <AdBanner />}
      </div>
    </>
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