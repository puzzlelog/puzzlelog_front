import React, { useState } from "react";
import { Box, Typography, Paper, ThemeProvider, createTheme, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import Header from "../components/Header";

// MUI 테마 수정
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

// 주어진 달의 첫 번째 날과 마지막 날을 계산하는 함수
const getMonthData = (year, month) => {
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
  return { firstDayOfMonth, lastDateOfMonth };
};

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

const EmotionCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 7, 17));
  const [emotions, setEmotions] = useState({}); // 날짜별 이모티콘 이미지 상태

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const { firstDayOfMonth, lastDateOfMonth } = getMonthData(year, month);

  // 날짜 배열 생성 (빈 칸 포함하고 마지막 주 채우기)
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null); // 첫 번째 날 이전의 빈 칸
  }
  for (let i = 1; i <= lastDateOfMonth; i++) {
    days.push(i); // 실제 날짜
  }
  const lastDayOfMonth = new Date(year, month, lastDateOfMonth).getDay();
  const remainingDays = 7 - ((lastDayOfMonth + 1) % 7 || 7);
  for (let i = 1; i <= remainingDays; i++) {
    days.push(null); // 다음 달의 빈 칸
  }

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // 이동 함수
  const handlePrevYear = () => {
    setSelectedDate(new Date(year - 1, month, 1));
  };

  const handleNextYear = () => {
    setSelectedDate(new Date(year + 1, month, 1));
  };

  const handlePrevMonth = () => {
    setSelectedDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(year, month + 1, 1));
  };
  

  // 이미지 업로드 핸들러
  const handleImageUpload = (day, event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // 파일을 URL로 변환
      setEmotions((prev) => ({
        ...prev,
        [`${year}-${month}-${day}`]: imageUrl, // 날짜별로 이미지 저장
      }));
    }
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#F7F3E5", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Header />
        <br/>
        <Box sx={{ mt: 5, width: "90%", maxWidth: 1400, textAlign: "left" }}></Box>

        <Paper elevation={0} sx={{ mt: 2, p: 2, width: "90%", maxWidth: "1400px", backgroundColor: "transparent", border: "1px solid #000", borderRadius: "12px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            {/* 년 이동 */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton onClick={handlePrevYear}>
                <ArrowBackIos />
              </IconButton>
              <Typography sx={{ fontSize: "1.4rem", color: "#6B4F35", mx: 1, fontFamily: "Cafe24Oneprettynight, sans-serif" }}>
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
              <Typography sx={{ fontSize: "1.4rem", color: "#6B4F35", mx: 1, fontFamily: "Cafe24Oneprettynight, sans-serif"}}>
                {selectedDate.toLocaleDateString("en-US", { month: "long" })}
              </Typography>
              <IconButton onClick={handleNextMonth}>
                <ArrowForwardIos />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-around", mb: 2 }}>
            {daysOfWeek.map((day, index) => (
              <Typography key={index} sx={{ width: "40px", textAlign: "center", fontSize: "1.3rem", fontWeight: "bold", color: "#6B4F35" }}>
                {day}
              </Typography>
            ))}
          </Box>

          <Box>
            {weeks.map((week, weekIndex) => (
              <Box key={weekIndex} sx={{ display: "flex", justifyContent: "space-around", mb: 1 }}>
                {week.map((day, dayIndex) => (
                  <Box
                    key={dayIndex}
                    sx={{
                      width: "60px", // 셀 크기 조정
                      height: "60px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      cursor: day ? "pointer" : "default",
                      backgroundColor:
                        day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()
                          ? "#F5E6D3"
                          : "transparent",
                      color:
                        day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()
                          ? "#6B4F35"
                          : "#000",
                    }}
                  >
                    {/* 날짜 표시 */}
                    <Typography
                     onClick={() => day && setSelectedDate(new Date(year, month, day))}
                     sx={{ fontSize: "1.2rem", fontFamily: "Cafe24Oneprettynight, sans-serif" }} 
                    >
                    {day || ""}
                    </Typography>


                    {/* 이모티콘 이미지 표시 */}
                    {day && emotions[`${year}-${month}-${day}`] ? (
                      <img
                        src={emotions[`${year}-${month}-${day}`]}
                        alt="emotion"
                        style={{ width: "24px", height: "24px", marginTop: "4px" }}
                      />
                    ) : (
                      day && (
                        <input
                          type="file"
                          accept="image/png"
                          style={{ display: "none" }}
                          id={`file-input-${year}-${month}-${day}`}
                          onChange={(e) => handleImageUpload(day, e)}
                        />
                      )
                    )}

                    {/* 이미지 업로드 버튼 */}
                    {day && !emotions[`${year}-${month}-${day}`] && (
                      <label htmlFor={`file-input-${year}-${month}-${day}`}>
                        <Typography sx={{ fontSize: "0.8rem", color: "#6B4F35", cursor: "pointer" }}>
                          +
                        </Typography>
                      </label>
                    )}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default EmotionCalendar;