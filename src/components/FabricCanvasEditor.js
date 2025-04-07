import React, { useRef, useState, useLayoutEffect, useEffect, useImperativeHandle, forwardRef } from "react";
import { Canvas, Image, Textbox, Rect, Text, PencilBrush } from "fabric";
<<<<<<< HEAD
=======
import axios from "axios";
>>>>>>> b504c1f (subscription)

const FabricCanvasEditor = forwardRef(({ selectedPieces = [], allStickers = [] }, ref) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const videoPiecesRef = useRef([]);
  const audioPiecesRef = useRef([]);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [backgroundImages, setBackgroundImages] = useState([]);
  const [penColor, setPenColor] = useState("#000000");
  const [penWidth, setPenWidth] = useState(3);
  const [isEraserMode, setIsEraserMode] = useState(false);
  const [stickersData, setStickersData] = useState({});
  const [activeCategory, setActiveCategory] = useState("");
  const [currentMode, setCurrentMode] = useState(null);
  const [isStickerVisible, setIsStickerVisible] = useState(false);
  const [isPenOptionsVisible, setIsPenOptionsVisible] = useState(false);
  const [isBackgroundSelectorVisible, setIsBackgroundSelectorVisible] = useState(false);
  const [backgroundId, setBackgroundId] = useState("default-background-id");
<<<<<<< HEAD
=======
  const [isSubscribed, setIsSubscribed] = useState(false);  // ✅ 구독 상태 추가
>>>>>>> b504c1f (subscription)
  const backgroundImageRef = useRef(null);
  const canvas = useRef(null);
  const undoStack = useRef([]);
  const redoStack = useRef([]);


  const categoryKorean = {
    dolls: "인형",
    audio: "오디오",
    camera: "카메라",
    daily: "일상",
    emoji: "이모지",
    food: "음식",
    numberlanguage: "숫자/언어",
    tape: "테이프",
    vintage: "빈티지",
  };

<<<<<<< HEAD
=======
  const userId = localStorage.getItem("userId");

   // ✅ 구독 상태 확인 로직 추가
   useEffect(() => {
    if (!userId) return;

    axios
      .get(`https://api.puzzlelog.me/users/${userId}/subscription-status`)
      .then((response) => {
        if (response.data.success) {
          setIsSubscribed(response.data.data === "ACTIVE");
          console.log("구독 상태 확인: ", response.data.data);
        }
      })
      .catch((error) => {
        console.error("구독 상태 확인 오류: ", error.response?.data?.message || error.message);
      });
  }, [userId]);

  // ✅ 스티커 사용 가능 여부 체크 함수 수정
  const isStickerAvailable = async (sticker) => {
    if (!sticker.locked) return true; // 잠겨있지 않다면 사용 가능
    if (sticker.locked && isSubscribed) return true; // 잠겼지만 구독 중이라면 사용 가능

    // 서버에 확인 요청
    const canUse = await canUseSticker(sticker.id);
    return canUse;
  };
>>>>>>> b504c1f (subscription)

  // props.allStickers 기반으로 sticker & background 정리
  useEffect(() => {
    if (!Array.isArray(allStickers)) return;

    const stickerCategories = {};
    const backgrounds = [];

    allStickers.forEach((item) => {
      if (item.type === "AD" || item.type === "EMOTION") return;
      if (item.type === "BACKGROUND") {
        backgrounds.push(item);
        return;
      }
      const category = item.tags?.[0] || item.type || "기타";
      if (!stickerCategories[category]) stickerCategories[category] = [];
      stickerCategories[category].push(item);
    });

    setStickersData(stickerCategories);
    setActiveCategory(Object.keys(stickerCategories)[0] || "");
    setBackgroundImages(backgrounds);
  }, [allStickers]);


  // 배경 설정할 때 setBackgroundId 호출
  const applyBackground = (mediaId, imageId) => {
    Image.fromURL(mediaId, (img) => {
      img.set({
        selectable: false,
        evented: false,
      });
      canvas.current.setBackgroundImage(img, canvas.current.renderAll.bind(canvas));
      console.log("배경 이미지 ID 저장됨:", imageId);
      setBackgroundId(imageId);  // 여기서 ID 저장!
    });
  };

  const switchMode = (mode) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 공통: 지우개 이벤트 제거
    canvas.off('mouse:down');
    setIsEraserMode(false);

    if (mode === 'pen') {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.color = penColor;
      canvas.freeDrawingBrush.width = penWidth;
      canvas.selection = false;
      canvas.forEachObject((obj) => (obj.selectable = false));
      setIsPenOptionsVisible(true);
      setIsStickerVisible(false);
      setIsBackgroundSelectorVisible(false);
    } else if (mode === 'eraser') {
      canvas.isDrawingMode = false; // 드로잉 모드 꺼야 함
      canvas.selection = false;
      canvas.forEachObject((obj) => {
        if (obj.customType === 'penDrawing') {
          obj.selectable = true;
        } else {
          obj.selectable = false;
        }
      });

      setIsEraserMode(true);

      // 펜 객체 클릭하면 삭제
      canvas.on('mouse:down', (opt) => {
        const obj = opt.target;
        if (obj && obj.customType === 'penDrawing') {
          canvas.remove(obj);
          saveState();
          canvas.requestRenderAll();
        }
      });

      // 패널들 끄기
      setIsPenOptionsVisible(false);
      setIsStickerVisible(false);
      setIsBackgroundSelectorVisible(false);
    } else {
      // sticker, background 등
      canvas.isDrawingMode = false;
      canvas.selection = true;
      canvas.forEachObject((obj) => (obj.selectable = true));
      setIsEraserMode(false);
      setIsPenOptionsVisible(false);

      if (mode === 'sticker') {
        setIsStickerVisible(true);
        setIsBackgroundSelectorVisible(false);
      } else if (mode === 'background') {
        setIsStickerVisible(false);
        setIsBackgroundSelectorVisible(true);
      } else {
        setIsStickerVisible(false);
        setIsBackgroundSelectorVisible(false);
      }
    }

    setCurrentMode(mode);
    canvas.renderAll();
  };



<<<<<<< HEAD
  useEffect(() => {
    fetch("https://api.puzzlelog.me/assets", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(" 전체 스티커 API 응답 =", result);

        if (result.success && Array.isArray(result.data)) {
          const backgrounds = result.data.filter(
            (item) => item.type === "background" && !item.Deleted
          );
          console.log(" background만 필터링 =", backgrounds);
          setBackgroundImages(backgrounds);
        } else {
          console.error(" 스티커 API 데이터 형식 오류:", result);
        }
      })
      .catch((err) => console.error(" 배경 API fetch 실패:", err));
  }, []);
=======
  // 사용자별 스티커 목록 조회
  useEffect(() => {
    if (!userId) return;

    axios
      .get(`https://api.puzzlelog.me/assets/user/${userId}/type/STICKER`, { withCredentials: true })
      .then((res) => {
        console.log("사용자 스티커 API 응답 : ", res.data);

        if (res.data.success && Array.isArray(res.data.data)) {
          const stickerCategories = {};
          const backgrounds = []; // 배경을 따로 분리하기 위한 배열 추가

          res.data.data.forEach((item) => {
            const category = item.tags?.[0] || item.type || "기타";

            // 배경 이미지 필터링 추가
            if (item.type === "BACKGROUND") {
              backgrounds.push(item);
              return;
            }

            if (!stickerCategories[category]) stickerCategories[category] = [];
            stickerCategories[category].push(item);
          });

          setStickersData(stickerCategories);
          setBackgroundImages(backgrounds); // 배경 이미지 상태 업데이트
          setActiveCategory(Object.keys(stickerCategories)[0] || "");
        } else {
          console.error("스티커 API 데이터 형식 오류 : ", res.data);
        }
      })
      .catch((err) => console.error("스티커 API fetch 실패 : ", err));
  }, [userId]);
>>>>>>> b504c1f (subscription)


  const sendObjectToBack = (canvas, obj) => {
    const objects = canvas.getObjects();
    canvas._objects = objects.filter((o) => o !== obj);
    canvas._objects.unshift(obj);
    canvas.renderAll();
  };


  // 캔버스 초기화
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (container && !canvasRef.current) {
      const canvasEl = document.createElement("canvas");
      canvasEl.width = 800;
      canvasEl.height = 800;
      canvasEl.className = "absolute top-0 left-0";

      container.appendChild(canvasEl);



      const canvas = new Canvas(canvasEl, {
        backgroundColor: "#FFFFFF",
        selection: true,
      });


      // 여기서 prototype으로 강제 추가
      if (!canvas.setBackgroundImage) {
        canvas.setBackgroundImage = function (img, callback, options) {
          this.backgroundImage = img;
          if (options) {
            Object.assign(this.backgroundImage, options);
          }
          if (callback) callback();
        };


      }

      canvas.freeDrawingBrush = new PencilBrush(canvas);
      canvas.freeDrawingBrush.width = penWidth;
      canvas.freeDrawingBrush.color = penColor;
      canvas.isDrawingMode = false;

      //  날짜 추가
      const dateText = new Textbox(new Date().toISOString().split('T')[0], {
        left: 50,
        top: 30,
        fontSize: 24,
        fill: "black",
        selectable: true,
      });
      canvas.add(dateText);
      canvas.renderAll();


      //  펜 custome type추가
      canvas.on('path:created', (e) => {
        e.path.set({
          customType: 'penDrawing', // 커스텀 속성
        });
        saveState(); // 상태 저장
      });

      canvasRef.current = canvas;
      console.log(" 캔버스 초기화 완료");
      setIsCanvasReady(true);

      const handleKeyDown = (e) => {
        if (e.key === "Delete" || e.key === "Backspace") {
          const activeObjects = canvas.getActiveObjects();
          if (activeObjects.length) {
            activeObjects.forEach((obj) => canvas.remove(obj));
            canvas.discardActiveObject();
            saveState();
          }
        }
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        canvas.dispose();
        canvasRef.current = null;
        if (container && canvasEl.parentNode === container) {
          container.removeChild(canvasEl);
        }
      };
    }


  }, []);



  // 배경 변경 함수
  const changeBackground = (url, imageId) => {
    console.log("🟢 배경 선택됨:", url);
    const imgElement = new window.Image();
    imgElement.crossOrigin = "anonymous";
    imgElement.src = url;

    imgElement.onload = () => {
      const canvas = canvasRef.current;


      console.log("현재 배경:", backgroundImageRef.current);

      canvas.preserveObjectStacking = true;

      canvas.getObjects().forEach(obj => {
        if (obj.isBackground) {
          canvas.remove(obj); // 무조건 삭제
        }
      });


      const fabricImg = new Image(imgElement, {
        left: 0,
        top: 0,
        selectable: false, // 선택 자체 불가
        evented: false,    // 드래그, 클릭 등 이벤트 안받음
        hasControls: false, // 크기조절 박스 안보임
        hasBorders: false,  // 테두리 표시 없음
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        selectable: false,
        evented: false,
        scaleX: canvas.width / imgElement.width,
        scaleY: canvas.height / imgElement.height,
      });

      // 기존 배경 이미지가 있다면 제거
      if (backgroundImageRef.current) {
        console.log("🗑️ 기존 배경 삭제됨");
        canvas.remove(backgroundImageRef.current);
      }

      canvas.add(fabricImg); // 추가
      sendObjectToBack(canvas, fabricImg); // 맨뒤로보내버려

      backgroundImageRef.current = fabricImg;
      canvas.renderAll();

      console.log("✅ 새로운 배경 적용 완료, ID:", imageId);
      setBackgroundId(imageId);  // 🟢 여기서 저장
    };

  };

  // selectedPieces 올라가도록
  useEffect(() => {
    if (isCanvasReady && canvasRef.current) {
      console.log(" selectedPieces 들어온 값:", selectedPieces);
      selectedPieces.forEach((piece, index) => {
        console.log(` piece[${index}]`, piece);
        if (piece.type === "IMAGE") {
          const imgElement = new window.Image();
          imgElement.crossOrigin = "anonymous";
          imgElement.src = piece.mediaId;;

          imgElement.onload = () => {
            if (!canvasRef.current) return;
            const fabricImg = new Image(imgElement, {
              left: Math.random() * 300,
              top: Math.random() * 300,
              scaleX: 0.5,
              scaleY: 0.5,
              selectable: true,
              hasControls: true,
            });

            fabricImg.contentId = piece.id;

            canvasRef.current.add(fabricImg);
            canvasRef.current.renderAll();
            console.log(" HTMLImageElement → Fabric Image 추가 완료!", canvasRef.current.getObjects());
          };

          imgElement.onerror = (err) => {
            console.error(" HTMLImageElement 로딩 실패:", err);
          };
        } else if (piece.type === "TEXT") {
          console.log(" 텍스트 조각 확인:", piece.text);
          const text = new Textbox(
            piece.text || "내용 없음",
            {
              left: 100 + index * 180,
              top: 100,
              fontSize: 24,
              fill: "black",
              selectable: true,
            }
          );

          text.contentId = piece.id;

          canvasRef.current.add(text);
          canvasRef.current.renderAll();
          saveState();
        }

      });
    }
  }, [isCanvasReady, selectedPieces]);

  const saveState = () => {
    if (canvasRef.current) {
      const json = canvasRef.current.toJSON();
      undoStack.current.push(json);
      redoStack.current = [];
    }
  };

  const getStickerData = () => {
    const stickers = [];
    if (canvasRef.current) {
      canvasRef.current.getObjects().forEach((obj) => {
        if (obj.type === "image" && obj.stickerId) {
          stickers.push({
            id: obj.stickerId,
            left: obj.left,
            top: obj.top,
            scale: obj.scaleX,
            rotation: obj.angle,
          });
        }
      });
    }
    console.log(" 스티커 데이터:", stickers);
    return stickers;
  };

  // 외부에서 호출 가능한 메서드 정의
  useImperativeHandle(ref, () => ({
    getCanvasJSON: () => {
      if (canvasRef.current) {
        return canvasRef.current.toJSON();
      }
      return null;
    },
    getBackgroundImage: () => {
      if (backgroundImageRef.current) {
        return backgroundImageRef.current.getSrc();
      }
      return null;
    },
    getVideoPieces: () => {
      return videoPiecesRef.current;
    },
    getAudioPieces: () => {
      return audioPiecesRef.current;
    },

    getCanvasElements,
    getStickerData,
    getBackgroundImageId: () => {
      console.log(" getBackgroundImageId 호출됨, 값:", backgroundId);
      return backgroundId;
    },
    applyBackground,

  }));

  // 비디오 및 오디오 조각 처리 로직 추가
  useEffect(() => {
    if (selectedPieces) {
      videoPiecesRef.current = selectedPieces.filter(piece => piece.type === 'VIDEO');
      audioPiecesRef.current = selectedPieces.filter(piece => piece.type === 'AUDIO');
    }
  }, [selectedPieces]);

  const toggleDrawing = () => {
    if (canvasRef.current) {
      canvasRef.current.isDrawingMode = !canvasRef.current.isDrawingMode;
    }
  };

  const updatePenSettings = (color, width) => {
    if (canvasRef.current) {
      canvasRef.current.freeDrawingBrush.color = color; // 지우개 여부 신경 X
      canvasRef.current.freeDrawingBrush.width = parseInt(width, 10);
    }
  };

  const toggleEraserMode = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      setIsEraserMode((prev) => {
        const next = !prev;
        if (next) {

          canvas.selection = false;
          canvas.forEachObject((obj) => {
            if (obj.customType === 'penDrawing') {
              obj.selectable = true;
            } else {
              obj.selectable = false; // 펜 아닌 건 못 선택하게
            }
          });

          canvas.on('mouse:down', (opt) => {
            const obj = opt.target;
            if (obj && obj.customType === 'penDrawing') {
              canvas.remove(obj);
              saveState();
              canvas.requestRenderAll();
            }
          });
        } else {

          canvas.selection = true;
          canvas.forEachObject((obj) => {
            obj.selectable = true;
          });
          canvas.off('mouse:down'); // 지우개 모드 이벤트 해제
        }
        return next;
      });
    }
  };

  //날짜, 펜, 스티커 모두 추출하는 함수
  const getCanvasElements = () => {
    const elements = [];
    if (canvasRef.current) {
      canvasRef.current.getObjects().forEach((obj) => {

        if (obj.type === "textbox" && obj.text && /^\d{4}-\d{2}-\d{2}$/.test(obj.text)) {
          console.log(" DATE 요소 확인:", obj.text);
          elements.push({
            elementType: "DATE",
            date: obj.date,
            position: [obj.left, obj.top],
            scale: 1.0,
            rotation: obj.angle || 0,
          });
        }

        // TEXT 조각 추가!
        else if (obj.type === "textbox" && obj.text && !/^\d{4}-\d{2}-\d{2}$/.test(obj.text)) {

          console.log("📝 TEXT 요소 추출:", obj.text);

          elements.push({
            elementType: "TEXT",
            contentId: obj.contentId || null, // 선택 조각이면 ID가 있을 수도 있음
            text: obj.text,
            position: [obj.left, obj.top],
            scale: obj.scaleX || 1.0,
            rotation: obj.angle || 0,
          });
          return;
        }

        // 펜 드로잉
        if (obj.type === "path" && obj.customType === "penDrawing") {

          const svgString = obj.toSVG();
          console.log(" SVG Path 확인:", svgString);

          elements.push({
            elementType: "DRAWING",
            drawingData: svgString,
            position: [obj.left, obj.top],
            scale: 1.0,
            rotation: obj.angle || 0,
          });
        }

        // 이미지 요소 추가
        if (obj.type === "image" && obj.stickerId === undefined && obj.contentId) {
          console.log("이미지 요소 추출됨:", obj.contentId);
          elements.push({
            elementType: "IMAGE",
            contentId: obj.contentId,
            position: [obj.left, obj.top],
            scale: obj.scaleX,
            rotation: obj.angle || 0,
          });
        }
      });
    }
    console.log("canvas에서 추출한 elements:", elements);
    return elements;
  };

<<<<<<< HEAD
=======
  // ✅ 스티커를 캔버스에 추가하는 함수 수정
  const addStickerToCanvas = async (sticker) => {
    const canUse = await isStickerAvailable(sticker);
    if (!canUse) {
      alert("🔒 이 스티커는 결제 후 사용 가능합니다.");
      return;
    }

    const imgElement = new window.Image();
    imgElement.crossOrigin = "anonymous";
    imgElement.src = sticker.mediaId;

    imgElement.onload = () => {
      const fabricImg = new Image(imgElement, {
        left: 150,
        top: 150,
        scaleX: 0.4,
        scaleY: 0.4,
        selectable: true,
        hasControls: true,
        lockUniScaling: false,
        cornerColor: "black",
        borderColor: "black",
      });

      fabricImg.stickerId = sticker.id;
      canvasRef.current.add(fabricImg);
      canvasRef.current.setActiveObject(fabricImg);
      canvasRef.current.renderAll();
      saveState();
    };
  };

  // ✅ 스티커 사용 가능 여부
  const canUseSticker = async (stickerId) => {
    try {
      const response = await axios.get(
        `https://api.puzzlelog.me/assets/user/${userId}/sticker/${stickerId}`
      );
      if (response.data.success) {
        return response.data.data; // 사용 가능 여부 반환
      } else {
        console.error("스티커 사용 여부 확인 실패 : ", response.data.message);
        return false;
      }
    } catch (error) {
      console.error("스티커 사용 여부 조회 중 오류 : ", error);
      return false;
    }
  };

  // ✅ 스티커 렌더링 함수 수정
  const renderSticker = (sticker) => {
    const isLocked = sticker.locked && !isSubscribed;

    return (
      <div
        key={sticker.id}
        className="relative w-14 h-14 group"
        style={{ position: "relative" }}
      >
        {/* 스티커 이미지 */}
        <img
          src={sticker.mediaId}
          alt={sticker.name}
          className={`w-full h-full object-contain cursor-pointer transition-opacity duration-300 
            ${isLocked ? "opacity-40 cursor-not-allowed" : "opacity-100"}`}
          onClick={() => {
            if (!isLocked) addStickerToCanvas(sticker);
          }}
        />

        {/* 잠금 상태 표시 */}
        {isLocked && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xs rounded">
            🔒 결제 후 사용 가능
          </div>
        )}
      </div>
    );
  };

>>>>>>> b504c1f (subscription)
  return (
    <div ref={containerRef} className="relative w-[800px] h-[500px] z-10 overflow-visible">

      {/* 사이드바 */}
      <aside className="w-20 bg-[#3b0764] flex flex-col items-center py-4 space-y-4 rounded-r-3xl shadow-md shadow-[#5A4A3A] fixed left-0 top-1/4 z-20">
        <button onClick={() => switchMode('pen')}>✏️</button>
        <button onClick={() => switchMode('sticker')}>🖼️</button>
        <button onClick={() => switchMode('eraser')}>🧽</button>
        <button onClick={() => switchMode('background')}>🎨</button>
        <button
          onClick={() => {
            const activeObj = canvasRef.current.getActiveObject();
            if (activeObj) {
              canvasRef.current.remove(activeObj);
              canvasRef.current.discardActiveObject();
              canvasRef.current.renderAll();
              saveState();
            }
          }}
        >
          🗑️
        </button>
      </aside>

      {/* 펜 옵션 */}
      {isPenOptionsVisible && (
        <div className="fixed left-[200px] top-[300px] bg-[#3b0764] p-4 rounded-lg shadow-md max-h-80 overflow-y-auto z-20 grid grid-cols-2 gap-2">

          <div>
            <label>굵기:</label>
            <input
              type="range"
              min="1"
              max="15"
              value={penWidth}
              onChange={(e) => {
                setPenWidth(e.target.value);
                updatePenSettings(penColor, e.target.value);
              }}
            />
          </div>
          <div>
            <label>색상:</label>
            <input
              type="color"
              value={penColor}
              onChange={(e) => {
                setPenColor(e.target.value);
                if (!isEraserMode) updatePenSettings(e.target.value, penWidth);
              }}
            />
          </div>
        </div>
      )}

      {/* 스티커 패널 */}
      {isStickerVisible && (
        <div className="fixed left-[200px] top-[300px] bg-[#3b0764] p-4 rounded-lg shadow-md max-h-[500px] overflow-y-auto z-20 w-[600px]">
<<<<<<< HEAD

=======
>>>>>>> b504c1f (subscription)
          <div className="flex mb-2 space-x-2 flex-wrap">
            {stickersData &&
              Object.keys(stickersData).length > 0 &&
              Object.keys(stickersData).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-1 rounded whitespace-nowrap transition 
                    ${activeCategory === category
                      ? "bg-[#D6B896] text-white"
                      : "bg-transparent text-[#F7F3E5] hover:bg-[#F7F3E5] hover:text-[#3b0764] border border-[#F7F3E5]"}`}
<<<<<<< HEAD

=======
>>>>>>> b504c1f (subscription)
                >
                  {categoryKorean[category] || category}
                </button>
              ))}
          </div>
          <div className="flex flex-wrap gap-4 scrollbar-thin scrollbar-track-[#F7F3E5] scrollbar-thumb-[#D6B896] ">
<<<<<<< HEAD
            {stickersData[activeCategory]?.map((sticker) => (
              <div
                key={sticker.id}
                className="relative w-14 h-14 group"
                style={{ position: 'relative' }}
              >
                <img
                  src={sticker.mediaId}
                  alt={sticker.name}
                  className={`w-full h-full object-contain cursor-pointer 
          ${sticker.locked ? "opacity-40 cursor-not-allowed" : ""}`}
                  onClick={() => {
                    if (sticker.locked) {
                      alert("🔒 이 스티커는 결제 후 사용 가능합니다.");
                      return;
                    }

                    const imgElement = new window.Image();
                    imgElement.crossOrigin = "anonymous";
                    imgElement.src = sticker.mediaId;

                    imgElement.onload = () => {
                      const fabricImg = new Image(imgElement, {
                        left: 150,
                        top: 150,
                        scaleX: 0.4,
                        scaleY: 0.4,
                        selectable: true,
                        hasControls: true,
                        lockUniScaling: false,
                        cornerColor: "black",
                        borderColor: "black",
                      });

                      fabricImg.stickerId = sticker.id;
                      canvasRef.current.add(fabricImg);
                      canvasRef.current.setActiveObject(fabricImg);
                      canvasRef.current.renderAll();
                      saveState();
                    };
                  }}
                />

                {sticker.locked && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 text-white text-[10px] flex items-center justify-center text-center rounded">
                    결제 후 사용 가능
                  </div>
                )}
              </div>
            ))}
          </div>

=======
            {stickersData[activeCategory]?.map((sticker) => renderSticker(sticker))}
          </div>
>>>>>>> b504c1f (subscription)
        </div>
      )}

      {/* 배경 패널 */}
      {isBackgroundSelectorVisible && (
        <div className="fixed left-[200px] top-[300px] bg-[#3b0764] p-4 rounded-lg shadow-md max-h-[500px] overflow-y-auto z-20 w-[600px] grid grid-cols-4 gap-4">

          {backgroundImages.length === 0 && <p>❌ 배경 이미지 없음!</p>} {/* 데이터 없을 때 표시 */}

          {backgroundImages.map((bg, index) => {
            console.log(`🟢 배경 이미지 렌더링: ${bg.name}, URL: ${bg.mediaId}`); // ✅ 확인!
            return (
              <img
                key={index}
                src={bg.mediaId}
                alt={bg.name}
                className="w-20 h-20 cursor-pointer object-cover"
                onClick={() => {
                  console.log(`🟢 배경 선택됨: ${bg.name}`);
                  changeBackground(bg.mediaId, bg.id); // 배경 변경
                }}
              />
            );
          })}
        </div>
      )}
<<<<<<< HEAD

=======
>>>>>>> b504c1f (subscription)
    </div>
  );
});

export default FabricCanvasEditor;