import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, ThemeProvider, createTheme, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import axios from "axios";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

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
  const [emotions, setEmotions] = useState({});

  const token = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");

  const navigate = useNavigate();

  const handleEmotionClick = (dateKey) => {
    navigate(`/diary?date=${dateKey}`);
  };
  
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const { firstDayOfMonth, lastDateOfMonth } = getMonthData(year, month);

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

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

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

        const emotionMap = {};
        for (const [dateKey, diary] of Object.entries(newestDiaryByDate)) {
          const directUrl = diary.emotion?.mediaId;
          if (directUrl) {
            emotionMap[dateKey] = directUrl;
            continue;
          }
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
            background: "linear-gradient(to bottom right, #1e1b4b, #3b0764)",
          }}
        >
          <Header />
          <Box sx={{ mt: 25, width: "100%", maxWidth: 1400, textAlign: "left" }}></Box>

          <Paper
            elevation={0}
            sx={{
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
                    mx: 1,
                    fontFamily: "Cafe24Oneprettynight, sans-serif",
                  }}
                >
                  {year}
                </Typography>
                <IconButton onClick={handleNextYear}>
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
                    mx: 1,
                    fontFamily: "Cafe24Oneprettynight, sans-serif",
                  }}
                >
                  {selectedDate.toLocaleDateString("en-US", { month: "long" })}
                </Typography>
                <IconButton onClick={handleNextMonth}>
                  <ArrowForwardIos sx={{ color: "#fff" }} /> {/* 화살표 색상 흰색 */}
                </IconButton>
              </Box>
            </Box>

            {/* 요일 헤더 */}
            <Box sx={{ display: "flex", justifyContent: "space-around", mb: 3 }}>
              {daysOfWeek.map((day, index) => (
                <Typography
                  key={index}
                  sx={{
                    width: "60px", // 너비 증가
                    textAlign: "center",
                    fontSize: "1.6rem", // 글씨 크기 증가
                    fontWeight: "bold",
                    color: "#fff", // 흰색으로 변경
                  }}
                >
                  {day}
                </Typography>
              ))}
            </Box>

            {/* 날짜 칸 렌더링 */}
            <Box>
              {weeks.map((week, weekIndex) => (
                <Box key={weekIndex} sx={{ display: "flex", justifyContent: "space-around", mb: 2 }}>
                  {week.map((day, dayIndex) => {
                    if (!day) {
                      return <Box key={dayIndex} sx={{ width: "80px", height: "80px" }} />; // 빈 칸 크기 증가
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
                          width: "80px", // 날짜 칸 너비 증가
                          height: "80px", // 날짜 칸 높이 증가
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          cursor: "pointer",
                          backgroundColor: isToday ? "rgba(255, 255, 255, 0.2)" : "transparent", // 오늘 날짜 배경 조정
                          color: "#fff", // 기본 글씨 색상 흰색
                          opacity: 0.9, // 투명도 조정
                        }}
                        onClick={() => setSelectedDate(new Date(year, month, day))}
                      >
                        <Typography
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

export default EmotionCalendar;