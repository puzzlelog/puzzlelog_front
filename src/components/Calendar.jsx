import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, ThemeProvider, createTheme, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import axios from "axios";
import Header from "../components/Header";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
=======
import { useNavigate } from "react-router-dom"; // react-router-dom 사용 시
>>>>>>> b504c1f (subscription)

// 오로라 애니메이션 및 박스 그림자 예시
const auroraStyle = `
@keyframes aurora {
  0% { transform: translateX(-100%) rotate(0deg); opacity: 0.3; }
  50% { transform: translateX(100%) rotate(10deg); opacity: 0.5; }
  100% { transform: translateX(-100%) rotate(0deg); opacity: 0.3; }
}

@keyframes pulseGlow2 {
  0% {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 1), 0 0 40px rgba(255, 255, 255, 0.8);
  }
  100% {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6);
  }
}
`;

// MUI 테마 예시
const customTheme = createTheme({
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontSize: "1.5rem",
          fontWeight: "bold",
        },
      },
    },
  },
});

// 달의 첫 날, 마지막 날 계산 함수
const getMonthData = (year, month) => {
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
  return { firstDayOfMonth, lastDateOfMonth };
};

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

const EmotionCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
<<<<<<< HEAD
=======
  // 날짜별 감정 이모티콘 이미지 URL을 저장하는 상태
>>>>>>> b504c1f (subscription)
  const [emotions, setEmotions] = useState({});

  const token = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");

<<<<<<< HEAD
  const navigate = useNavigate();

=======
  const navigate = useNavigate(); // 네비게이션 훅

  // 이모티콘 클릭 시, 해당 날짜의 일기모음집 페이지로 이동
>>>>>>> b504c1f (subscription)
  const handleEmotionClick = (dateKey) => {
    navigate(`/diary?date=${dateKey}`);
  };
  
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

<<<<<<< HEAD
  const { firstDayOfMonth, lastDateOfMonth } = getMonthData(year, month);

=======
  // 달력 렌더링에 필요한 정보
  const { firstDayOfMonth, lastDateOfMonth } = getMonthData(year, month);

  // 1) 날짜 배열 생성 (빈 칸 포함)
>>>>>>> b504c1f (subscription)
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= lastDateOfMonth; i++) {
    days.push(i);
  }
  const lastDayOfMonth = new Date(year, month, lastDateOfMonth).getDay();
  const remainingDays = 7 - ((lastDayOfMonth + 1) % 7 || 7);
  for (let i = 1; i <= remainingDays; i++) {
    days.push(null);
  }

<<<<<<< HEAD
=======
  // 주(week) 단위로 끊어서 렌더링하기 위한 배열
>>>>>>> b504c1f (subscription)
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

<<<<<<< HEAD
=======
  // 2) 백엔드에서 diaries 불러오기
>>>>>>> b504c1f (subscription)
  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        if (!userId) {
          console.log("userId가 없습니다. 중단합니다.");
          return;
        }
        if (!token) {
          console.log("accessToken이 없습니다. 중단합니다.");
          return;
        }

<<<<<<< HEAD
=======
        // API 호출 (includeElements=true)
>>>>>>> b504c1f (subscription)
        const res = await axios.get(
          `https://api.puzzlelog.me/diaries?userId=${userId}&includeElements=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        let diariesData = res.data.data?.diaries || res.data.diaries || [];
        console.log("Parsed diariesData (array):", diariesData);

<<<<<<< HEAD
=======
        // 날짜별로 가장 최신 일기만 추리기
>>>>>>> b504c1f (subscription)
        const newestDiaryByDate = {};
        for (const diary of diariesData) {
          const diaryDate = diary.createdAt
            ? new Date(diary.createdAt).toISOString().split("T")[0]
            : null;
          if (!diaryDate) continue;

          if (
            !newestDiaryByDate[diaryDate] ||
            new Date(diary.createdAt) > new Date(newestDiaryByDate[diaryDate].createdAt)
          ) {
            newestDiaryByDate[diaryDate] = diary;
          }
        }

<<<<<<< HEAD
        const emotionMap = {};
        for (const [dateKey, diary] of Object.entries(newestDiaryByDate)) {
=======
        // 최신 일기의 emotion만 가져와서 매핑
        const emotionMap = {};
        for (const [dateKey, diary] of Object.entries(newestDiaryByDate)) {
          // directUrl (emotion.mediaId)가 있으면 바로 사용
>>>>>>> b504c1f (subscription)
          const directUrl = diary.emotion?.mediaId;
          if (directUrl) {
            emotionMap[dateKey] = directUrl;
            continue;
          }
<<<<<<< HEAD
=======
          // 없으면 emotionContentId로 조회
>>>>>>> b504c1f (subscription)
          const emotionId = diary.emotionContentId;
          if (emotionId) {
            try {
              const stickerRes = await axios.get(
                `https://api.puzzlelog.me/assets/${emotionId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                  withCredentials: true,
                }
              );
              const stickerUrl = stickerRes.data.data?.mediaId;
              if (stickerUrl) {
                emotionMap[dateKey] = stickerUrl;
              }
            } catch (err) {
              console.error("스티커 조회 중 오류:", err);
            }
          }
        }
        console.log("Final emotionMap:", emotionMap);
        setEmotions(emotionMap);
      } catch (error) {
        console.error("일기 데이터를 가져오지 못했습니다:", error);
      }
    };

    fetchDiaries();
  }, [userId, token]);

<<<<<<< HEAD
=======
  // 이전/다음 연도 & 이전/다음 달 이동 함수
>>>>>>> b504c1f (subscription)
  const handlePrevYear = () => setSelectedDate(new Date(year - 1, month, 1));
  const handleNextYear = () => setSelectedDate(new Date(year + 1, month, 1));
  const handlePrevMonth = () => setSelectedDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setSelectedDate(new Date(year, month + 1, 1));

  return (
    <>
      <style>{auroraStyle}</style>
      <ThemeProvider theme={customTheme}>
        <Box
          sx={{
            minHeight: "100vh",
            backgroundColor: "#F7F3E5",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            width: "100%",
            height: "100vh",
            overflow: "hidden",
<<<<<<< HEAD
            background: "linear-gradient(to bottom right, #1e1b4b, #3b0764)",
=======
            background: "linear-gradient(to bottom right, #BBDEFB, rgb(220, 188, 255))",
>>>>>>> b504c1f (subscription)
          }}
        >
          <Header />
          <Box sx={{ mt: 25, width: "100%", maxWidth: 1400, textAlign: "left" }}></Box>

          <Paper
            elevation={0}
            sx={{
<<<<<<< HEAD
              mt: 4, // 상단 여백 증가
              p: 4, // 내부 패딩 증가
              width: "95%", // 너비 증가
              maxWidth: "1600px", // 최대 너비 증가
              backgroundColor: "transparent",
              animation: "pulseGlow2 3s infinite",
              borderRadius: "16px", // 모서리 둥글기 증가
              boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)", // 그림자 강화
            }}
          >
            {/* 상단: 년/월 이동 버튼 */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton onClick={handlePrevYear}>
                  <ArrowBackIos sx={{ color: "#fff" }} /> {/* 화살표 색상 흰색 */}
                </IconButton>
                <Typography
                  sx={{
                    fontSize: "1.8rem", // 글씨 크기 증가
                    color: "#fff", // 흰색으로 변경
=======
              mt: 2,
              p: 3,
              width: "90%",
              maxWidth: "1400px",
              backgroundColor: "transparent",
              animation: "pulseGlow2 3s infinite",
              borderRadius: "12px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* 상단: 년/월 이동 버튼 */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              {/* 연도 이동 */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton onClick={handlePrevYear}>
                  <ArrowBackIos />
                </IconButton>
                <Typography
                  sx={{
                    fontSize: "1.4rem",
                    color: "#6B4F35",
>>>>>>> b504c1f (subscription)
                    mx: 1,
                    fontFamily: "Cafe24Oneprettynight, sans-serif",
                  }}
                >
                  {year}
                </Typography>
                <IconButton onClick={handleNextYear}>
<<<<<<< HEAD
                  <ArrowForwardIos sx={{ color: "#fff" }} /> {/* 화살표 색상 흰색 */}
                </IconButton>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton onClick={handlePrevMonth}>
                  <ArrowBackIos sx={{ color: "#fff" }} /> {/* 화살표 색상 흰색 */}
                </IconButton>
                <Typography
                  sx={{
                    fontSize: "1.8rem", // 글씨 크기 증가
                    color: "#fff", // 흰색으로 변경
=======
                  <ArrowForwardIos />
                </IconButton>
              </Box>

              {/* 월 이동 */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton onClick={handlePrevMonth}>
                  <ArrowBackIos />
                </IconButton>
                <Typography
                  sx={{
                    fontSize: "1.4rem",
                    color: "#6B4F35",
>>>>>>> b504c1f (subscription)
                    mx: 1,
                    fontFamily: "Cafe24Oneprettynight, sans-serif",
                  }}
                >
                  {selectedDate.toLocaleDateString("en-US", { month: "long" })}
                </Typography>
                <IconButton onClick={handleNextMonth}>
<<<<<<< HEAD
                  <ArrowForwardIos sx={{ color: "#fff" }} /> {/* 화살표 색상 흰색 */}
=======
                  <ArrowForwardIos />
>>>>>>> b504c1f (subscription)
                </IconButton>
              </Box>
            </Box>

            {/* 요일 헤더 */}
<<<<<<< HEAD
            <Box sx={{ display: "flex", justifyContent: "space-around", mb: 3 }}>
=======
            <Box sx={{ display: "flex", justifyContent: "space-around", mb: 2 }}>
>>>>>>> b504c1f (subscription)
              {daysOfWeek.map((day, index) => (
                <Typography
                  key={index}
                  sx={{
<<<<<<< HEAD
                    width: "60px", // 너비 증가
                    textAlign: "center",
                    fontSize: "1.6rem", // 글씨 크기 증가
                    fontWeight: "bold",
                    color: "#fff", // 흰색으로 변경
=======
                    width: "40px",
                    textAlign: "center",
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    color: "#6B4F35",
>>>>>>> b504c1f (subscription)
                  }}
                >
                  {day}
                </Typography>
              ))}
            </Box>

            {/* 날짜 칸 렌더링 */}
            <Box>
              {weeks.map((week, weekIndex) => (
<<<<<<< HEAD
                <Box key={weekIndex} sx={{ display: "flex", justifyContent: "space-around", mb: 2 }}>
                  {week.map((day, dayIndex) => {
                    if (!day) {
                      return <Box key={dayIndex} sx={{ width: "80px", height: "80px" }} />; // 빈 칸 크기 증가
=======
                <Box key={weekIndex} sx={{ display: "flex", justifyContent: "space-around", mb: 1 }}>
                  {week.map((day, dayIndex) => {
                    if (!day) {
                      return <Box key={dayIndex} sx={{ width: "60px", height: "60px" }} />;
>>>>>>> b504c1f (subscription)
                    }

                    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const isToday =
                      day === selectedDate.getDate() &&
                      month === selectedDate.getMonth() &&
                      year === selectedDate.getFullYear();

                    return (
                      <Box
                        key={dayIndex}
                        sx={{
<<<<<<< HEAD
                          width: "80px", // 날짜 칸 너비 증가
                          height: "80px", // 날짜 칸 높이 증가
=======
                          width: "60px",
                          height: "60px",
>>>>>>> b504c1f (subscription)
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          cursor: "pointer",
<<<<<<< HEAD
                          backgroundColor: isToday ? "rgba(255, 255, 255, 0.2)" : "transparent", // 오늘 날짜 배경 조정
                          color: "#fff", // 기본 글씨 색상 흰색
                          opacity: 0.9, // 투명도 조정
=======
                          backgroundColor: isToday ? "#f7e4d6" : "transparent",
                          color: isToday ? "#6B4F35" : "#000",
                          opacity: 0.7,
>>>>>>> b504c1f (subscription)
                        }}
                        onClick={() => setSelectedDate(new Date(year, month, day))}
                      >
                        <Typography
<<<<<<< HEAD
                          sx={{
                            fontSize: "1.5rem", // 날짜 글씨 크기 증가
                            fontFamily: "Cafe24Oneprettynight, sans-serif",
                            color: "#fff", // 흰색으로 변경
                          }}
                        >
                          {day}
                        </Typography>
                        {emotions[dateKey] && (
                         <img
  src={emotions[dateKey]}
  alt="emotion"
  style={{
    width: "48px",
    height: "48px",
    marginTop: "6px",
    cursor: "pointer",
  }}
  onClick={(event) => {
    event.stopPropagation();
    handleEmotionClick(dateKey);
  }}
/>

=======
                          sx={{ fontSize: "1.2rem", fontFamily: "Cafe24Oneprettynight, sans-serif" }}
                        >
                          {day}
                        </Typography>
                        {/* 감정 스티커 이미지 표시 (있으면) */}
                        {emotions[dateKey] && (
                          <img
                            src={emotions[dateKey]}
                            alt="emotion"
                            style={{ width: "24px", height: "24px", marginTop: "4px", cursor: "pointer" }}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleEmotionClick(dateKey);
                            }}
                          />
>>>>>>> b504c1f (subscription)
                        )}
                      </Box>
                    );
                  })}
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </ThemeProvider>
    </>
  );
};

<<<<<<< HEAD
export default EmotionCalendar;
=======
export default EmotionCalendar;
>>>>>>> b504c1f (subscription)
