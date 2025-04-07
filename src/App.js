import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

<<<<<<< HEAD
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
=======
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
import Calendar from "./components/Calendar"; //calendar
import Challenge from "./components/Challenge"; //challenge
import AdminPage from "./components/AdminPage"; //adminpage
import AdminEditChallenge from "./components/AdminEditChallenge"; //admineditChallenge
import AdminEditAsset from "./components/AdminEditAsset"; //admineditAsset
import AdminEditAds from "./components/AdminEditAds"; //admineditAds
import AdBanner from "./components/AdBanner"; //Adbanner
>>>>>>> b504c1f (subscription)

import CommunityPage from "./components/CommunityPage";
import UploadPost from "./components/UploadPost";
import PostList from "./components/PostList";
import PostDetailPage from "./components/PostDetailPage";

import DigitalAlbumList from "./components/DigitalAlbumList";
import NewAlbumPage from "./components/NewAlbumPage";
import AlbumDetail from "./components/AlbumDetail";

import MakeDiary from "./components/MakeDiary";
import PieceBoxMakeDiary from "./components/PieceBoxMakeDiary";

<<<<<<< HEAD
// 협업 일기 읽기 관련 (협업 일기 모음집에서 조회)
import CollaborativeDiaryBox from "./components/CollaborativeDiaryBox";

// 새 협업 일기 작성 플로우 컴포넌트
import CollaborativeDiarySetup from "./components/CollaborativeDiarySetup";
import CollaborativeDiarySelectPieces from "./components/CollaborativeDiarySelectPieces";
import CollaborativeDiaryCreate from "./components/CollaborativeDiaryCreate";
import InvitationList from "./components/InvitationList";

import ShootingStarBackground from "./components/ShootingStarBackground"; // 별똥별 애니메이션

const AppContent = () => {
  const location = useLocation();
  const excludedPaths = [
    "/home",
    "/signup",
    "/login",
    "/adminPage",
    "/adminEditChallenge",
    "/adminEditAsset",
    "/adminEditAds"
  ];

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

          {/* 협업 일기 읽기 (모음집 등) */}

          <Route path="/collaborativeDiaryBox" element={<CollaborativeDiaryBox />} />

          {/* 새 협업 일기 작성 플로우 */}
          <Route path="/collaborative-diary-setup" element={<CollaborativeDiarySetup />} />
          <Route path="/collaborative-select-pieces" element={<CollaborativeDiarySelectPieces />} />
          <Route path="/collaborative-create-diary" element={<CollaborativeDiaryCreate />} />
          <Route path="/invitations" element={<InvitationList/>}/>
        </Routes>

        {!excludedPaths.includes(location.pathname) && <AdBanner />}
      </div>
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
=======
import CollaborativeDiaryInvite from "./components/CollaborativeDiaryInvite";
import CollaborativeDiary from "./components/CollaborativeDiary";
import InvitationList from "./components/InvitationList";
import CollaborativeDiaryBox from "./components/CollaborativeDiaryBox";

import SubscriptionPage from "./components/SubscriptionPage";
import SubscriptionResult from "./components/SubscriptionResult";

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
  {/* 기존의 "/diaryBox" 대신 "/diary"로 수정 */}
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

  <Route path="/subscribe" element={<SubscriptionPage />} />
  <Route path="/subscribe/result" element={<SubscriptionResult />} />
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
>>>>>>> b504c1f (subscription)
