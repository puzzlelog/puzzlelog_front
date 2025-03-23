import React, { useRef, useState, useLayoutEffect, useEffect, useImperativeHandle, forwardRef } from "react";
import { Canvas, Image, Textbox, Rect, Text, PencilBrush } from "fabric";

const FabricCanvasEditor = forwardRef(({ selectedPieces = [] }, ref) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const videoPiecesRef = useRef([]);
  const audioPiecesRef = useRef([]);


  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [backgroundImages, setBackgroundImages] = useState([]);
  const undoStack = useRef([]);
  const redoStack = useRef([]);


  const backgroundImageRef = useRef(null);

  const [isStickerVisible, setIsStickerVisible] = useState(false);
  const [isPenOptionsVisible, setIsPenOptionsVisible] = useState(false);
  const [isBackgroundSelectorVisible, setIsBackgroundSelectorVisible] = useState(false);


  const [penColor, setPenColor] = useState("#000000");
  const [penWidth, setPenWidth] = useState(3);
  const [isEraserMode, setIsEraserMode] = useState(false);

  const [stickersData, setStickersData] = useState({});
  const [activeCategory, setActiveCategory] = useState("");

  const [currentMode, setCurrentMode] = useState(null);

  
  //const [backgroundImageId, setBackgroundImageId] = useState("default-background-id");

  const [backgroundId, setBackgroundId] = useState("default-background-id");

  const canvas = useRef(null);



  // 배경 설정할 때 setBackgroundId 호출
  const applyBackground = (imageURL, imageId) => {
    Image.fromURL(imageURL, (img) => {
      img.set({
        selectable: false,
        evented: false,
      });
      canvas.current.setBackgroundImage(img, canvas.current.renderAll.bind(canvas));
      console.log("✅ 배경 이미지 ID 저장됨:", imageId); 
      setBackgroundId(imageId);  // 여기서 ID 저장!
    });
  };
  
  


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
      canvas.isDrawingMode = false; // ❗ 드로잉 모드 꺼야 함
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


  


  useEffect(() => {
    fetch("http://api.puzzlelog.me/api/admin/stickers", {
      method: "GET",
      credentials: "include", // 세션 쿠키 포함 필수!
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("🟢 스티커 데이터:", data);

        if (data.success && Array.isArray(data.data)) {
          // 카테고리별로 정리하기
          const categorizedStickers = {};

          data.data.forEach((sticker) => {
            // 🔽 여기서 AD 타입 스티커 제외
            if (sticker.type === "AD" || sticker.type === "background") {
              console.log("❌ AD 스티커 제외:", sticker);
              return; // 다음 반복으로 넘어감
            }



            const category = sticker.type || "기타";

            if (!categorizedStickers[category]) {
              categorizedStickers[category] = [];
            }
            categorizedStickers[category].push(sticker);
          });

          console.log("🟢 AD 제외 후 카테고리별 스티커:", categorizedStickers);

          setStickersData(categorizedStickers);
          setActiveCategory(Object.keys(categorizedStickers)[0]); // 첫 번째 카테고리
        } else {
          console.error("스티커 데이터 형식 오류:", data);
        }
      })
      .catch((error) => console.error("스티커 API 불러오기 실패:", error));
  }, []);




  useEffect(() => {
    fetch("http://api.puzzlelog.me/api/admin/stickers", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("🟢 전체 스티커 API 응답 =", result);

        if (result.success && Array.isArray(result.data)) {
          const backgrounds = result.data.filter(
            (item) => item.type === "background" && !item.isDeleted
          );
          console.log("🟢 background만 필터링 =", backgrounds);
          setBackgroundImages(backgrounds);
        } else {
          console.error("❌ 스티커 API 데이터 형식 오류:", result);
        }
      })
      .catch((err) => console.error("❌ 배경 API fetch 실패:", err));
  }, []);





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


      // 🔥 여기서 prototype으로 강제 추가
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

      // ✅ 날짜 추가
      const dateText = new Textbox(new Date().toISOString().split('T')[0], {
        left: 50,
        top: 30,
        fontSize: 24,
        fill: "black",
        selectable: true,
      });
      canvas.add(dateText);
      canvas.renderAll();


      // ✅ 펜 custome type추가
      canvas.on('path:created', (e) => {
        e.path.set({
          customType: 'penDrawing', // 커스텀 속성
        });
        saveState(); // 상태 저장
      });

      canvasRef.current = canvas;
      console.log("✅ 캔버스 초기화 완료");
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
      selectedPieces.forEach((piece, index) => {
        if (piece.type === "IMAGE") {
          const imgElement = new window.Image();
          imgElement.crossOrigin = "anonymous";
          imgElement.src = piece.mediaId;;

          imgElement.onload = () => {
            const fabricImg = new Image(imgElement, {
              left: Math.random() * 300,
              top: Math.random() * 300,
              scaleX: 0.5,
              scaleY: 0.5,
              selectable: true,
              hasControls: true,
            });

            canvasRef.current.add(fabricImg);
            canvasRef.current.renderAll();
            console.log("✅ HTMLImageElement → Fabric Image 추가 완료!", canvasRef.current.getObjects());
          };

          imgElement.onerror = (err) => {
            console.error("❌ HTMLImageElement 로딩 실패:", err);
          };
        } else if (piece.type === "TEXT") {
          const text = new Textbox(piece.content, {
            left: 100 + index * 180,
            top: 100,
            fontSize: 24,
            fill: "black",
            selectable: true,
          });
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
    console.log("🟢 스티커 데이터:", stickers);
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
      console.log("📣 getBackgroundImageId 호출됨, 값:", backgroundId);
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
          console.log("📅 DATE 요소 확인:", obj.text);
          elements.push({
            elementType: "DATE",
            date: obj.text, 
            position: [obj.left, obj.top],
            scale: 1.0,
            rotation: obj.angle || 0,
          });
        }
  
        // 펜 드로잉
        if (obj.type === "path" && obj.customType === "penDrawing") { 

          const svgString = obj.toSVG();
          console.log("🎨 SVG Path 확인:", svgString);
        
          

          elements.push({
            elementType: "DRAWING", 
            drawingData: svgString,
            position: [obj.left, obj.top],
            scale: 1.0,
            rotation: obj.angle || 0,
          });
        }
  
      });
    }
    console.log("🟢 canvas에서 추출한 elements:", elements);
    return elements;
  };
  

  // 되돌리기랑 돌아가기? 암튼 그 2개기능
  // const handleUndo = () => {
  //   if (undoStack.current.length > 0 && canvasRef.current) {
  //     const lastState = undoStack.current.pop();
  //     redoStack.current.push(canvasRef.current.toJSON());
  //     canvasRef.current.loadFromJSON(lastState, () => {
  //       canvasRef.current.renderAll();
  //       canvasRef.current.discardActiveObject();
  //       canvasRef.current.requestRenderAll();
  //     });
  //   }


  //   // else if(undoStack.current.length == 0) {
  //   //     alert('초기화');
  //   //     undoStack.current = [];
  //   //     redoStack.current = [];
  //   // }
  // };

  // const handleRedo = () => {
  //   if (redoStack.current.length > 0 && canvasRef.current) {
  //     const nextState = redoStack.current.pop();
  //     undoStack.current.push(canvasRef.current.toJSON());
  //     canvasRef.current.loadFromJSON(nextState, () => {
  //       canvasRef.current.renderAll();
  //       canvasRef.current.discardActiveObject();
  //       canvasRef.current.requestRenderAll();
  //     });
  //   }
  // };

  // const disableEraserMode = () => {
  //   if (canvasRef.current) {
  //     const canvas = canvasRef.current;
  //     canvas.selection = true;
  //     canvas.forEachObject((obj) => {
  //       obj.selectable = true;
  //     });
  //     canvas.off('mouse:down');
  //   }
  // };
  

  return (
    <div ref={containerRef} className="relative w-[800px] h-[500px] z-10 overflow-visible">

      {/* 사이드바 */}
      <aside className="w-20 bg-[#F0ECE1] flex flex-col items-center py-4 space-y-4 rounded-r-3xl shadow-md fixed left-0 top-1/4 z-20">

        <button onClick={() => switchMode('pen')}>✏️</button>
        <button onClick={() => switchMode('sticker')}>🖼️</button>
        <button onClick={() => switchMode('eraser')}>🧽</button>
        <button onClick={() => switchMode('background')}>🎨</button>


        <button onClick={() => {
          const activeObj = canvasRef.current.getActiveObject();
          if (activeObj) {
            canvasRef.current.remove(activeObj);
            canvasRef.current.discardActiveObject();
            canvasRef.current.renderAll();
            saveState();
          }
        }}>
          🗑️
        </button>

      </aside>

      {/* 펜 옵션 */}
      {isPenOptionsVisible && (
        <div className="absolute left-[-680px] top-[100px] bg-[#F7F3E5] p-4 rounded-lg shadow-md max-h-80 overflow-y-auto z-20 grid grid-cols-2 gap-2">
          <div>
            <label>굵기:</label>
            <input
              type="range"
              min="1"
              max="15"
              value={penWidth}
              onChange={(e) => {
                setPenWidth(e.target.value);
                updatePenSettings(e.target.value, penWidth);
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

        <div className="absolute left-[-680px] top-[100px] bg-[#F7F3E5] p-4 rounded-lg shadow-md max-h-[500px] overflow-y-auto z-20 w-[600px] ">
          <div className="flex mb-2 space-x-2 flex-wrap">
            {stickersData &&
              Object.keys(stickersData).length > 0 &&
              Object.keys(stickersData).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-1 rounded whitespace-nowrap ${activeCategory === category ? "bg-[#D6B896] text-white" : "bg-[#F7F3E5]"}`}
                >
                  {categoryKorean[category] || category}
                </button>
              ))}
          </div>
          <div className="flex flex-wrap gap-4 scrollbar-thin scrollbar-track-[#F7F3E5] scrollbar-thumb-[#D6B896] ">
            {stickersData[activeCategory]?.map((sticker) => (
              <img
                key={sticker.id}
                src={sticker.imageUrl} // 클라우드 이미지 URL
                alt={sticker.name}
                className="w-14 h-14 cursor-pointer"
                onClick={() => {
                  if (canvasRef.current) {

                    console.log("🟢 스티커 클릭됨! URL:", sticker.imageUrl);


                    const imgElement = new window.Image();
                    imgElement.crossOrigin = "anonymous";
                    imgElement.src = sticker.imageUrl;

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
                      canvasRef.current.setActiveObject(fabricImg); // 얘가 bringToFront 역할
                      canvasRef.current.renderAll();
                      console.log("✅ 스티커 캔버스에 추가됨:", fabricImg);
                      saveState();
                    };







                  }
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* 배경 패널 */}
      {isBackgroundSelectorVisible && (
        <div className="absolute left-[-680px] top-[100px] bg-[#F7F3E5] p-4 rounded-lg shadow-md max-h-[500px] overflow-y-auto z-20 w-[600px] grid grid-cols-4 gap-4">
          {backgroundImages.length === 0 && <p>❌ 배경 이미지 없음!</p>} {/* 데이터 없을 때 표시 */}

          {backgroundImages.map((bg, index) => {
            console.log(`🟢 배경 이미지 렌더링: ${bg.name}, URL: ${bg.imageUrl}`); // ✅ 확인!
            return (
              <img
                key={index}
                src={bg.imageUrl}
                alt={bg.name}
                className="w-20 h-20 cursor-pointer object-cover"
                onClick={() => {
                  console.log(`🟢 배경 선택됨: ${bg.name}`);
                  changeBackground(bg.imageUrl, bg.id); // 배경 변경
                }}
              />
            );
          })}
        </div>
      )}



    </div>
  );
});

export default FabricCanvasEditor;
