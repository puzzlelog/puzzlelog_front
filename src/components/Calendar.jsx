import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, ThemeProvider, createTheme, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import axios from "axios";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom"; // react-router-dom 사용 시

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
  // 날짜별 감정 이모티콘 이미지 URL을 저장하는 상태
  const [emotions, setEmotions] = useState({});

  const token = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");

  const navigate = useNavigate(); // 네비게이션 훅

  // 이모티콘 클릭 시, 해당 날짜의 일기모음집 페이지로 이동
  const handleEmotionClick = (dateKey) => {
    navigate(`/diary?date=${dateKey}`);
  };
  
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  // 달력 렌더링에 필요한 정보
  const { firstDayOfMonth, lastDateOfMonth } = getMonthData(year, month);

  // 1) 날짜 배열 생성 (빈 칸 포함)
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

  // 주(week) 단위로 끊어서 렌더링하기 위한 배열
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // 2) 백엔드에서 diaries 불러오기
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

        // API 호출 (includeElements=true)
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

        // 날짜별로 가장 최신 일기만 추리기
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

        // 최신 일기의 emotion만 가져와서 매핑
        const emotionMap = {};
        for (const [dateKey, diary] of Object.entries(newestDiaryByDate)) {
          // directUrl (emotion.mediaId)가 있으면 바로 사용
          const directUrl = diary.emotion?.mediaId;
          if (directUrl) {
            emotionMap[dateKey] = directUrl;
            continue;
          }
          // 없으면 emotionContentId로 조회
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

  // 이전/다음 연도 & 이전/다음 달 이동 함수
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
            background: "linear-gradient(to bottom right, #BBDEFB, rgb(220, 188, 255))",
          }}
        >
          <Header />
          <Box sx={{ mt: 25, width: "100%", maxWidth: 1400, textAlign: "left" }}></Box>

          <Paper
            elevation={0}
            sx={{
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
                    mx: 1,
                    fontFamily: "Cafe24Oneprettynight, sans-serif",
                  }}
                >
                  {year}
                </Typography>
                <IconButton onClick={handleNextYear}>
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
                    mx: 1,
                    fontFamily: "Cafe24Oneprettynight, sans-serif",
                  }}
                >
                  {selectedDate.toLocaleDateString("en-US", { month: "long" })}
                </Typography>
                <IconButton onClick={handleNextMonth}>
                  <ArrowForwardIos />
                </IconButton>
              </Box>
            </Box>

            {/* 요일 헤더 */}
            <Box sx={{ display: "flex", justifyContent: "space-around", mb: 2 }}>
              {daysOfWeek.map((day, index) => (
                <Typography
                  key={index}
                  sx={{
                    width: "40px",
                    textAlign: "center",
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    color: "#6B4F35",
                  }}
                >
                  {day}
                </Typography>
              ))}
            </Box>

            {/* 날짜 칸 렌더링 */}
            <Box>
              {weeks.map((week, weekIndex) => (
                <Box key={weekIndex} sx={{ display: "flex", justifyContent: "space-around", mb: 1 }}>
                  {week.map((day, dayIndex) => {
                    if (!day) {
                      return <Box key={dayIndex} sx={{ width: "60px", height: "60px" }} />;
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
                          width: "60px",
                          height: "60px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          cursor: "pointer",
                          backgroundColor: isToday ? "#f7e4d6" : "transparent",
                          color: isToday ? "#6B4F35" : "#000",
                          opacity: 0.7,
                        }}
                        onClick={() => setSelectedDate(new Date(year, month, day))}
                      >
                        <Typography
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
