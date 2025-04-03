import React, { useEffect, useRef } from "react";
import { Canvas, Image, Textbox as ImportedTextbox, Path as ImportedPath } from "fabric";

const FabricCanvasViewer = ({ diary, debugId }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    console.log(`🐾 [${debugId}] useEffect 진입`);

    const canvas = new Canvas(canvasRef.current, {
      width: 800,
      height: 800,
      selection: false,
      backgroundColor: diary.themeColor || "#f9ecdd",
    });

    const imgElement = new window.Image();
    imgElement.crossOrigin = "anonymous";

    imgElement.onload = () => {
      const bgImage = new Image(imgElement, {
        left: 0,
        top: 0,
        scaleX: 800 / imgElement.width,
        scaleY: 800 / imgElement.height,
        selectable: false,
        evented: false,
        originX: "left",
        originY: "top",
      });

      bgImage.isBackground = true; // 배경 플래그 지정
      canvas.add(bgImage);

      canvas.renderAll();
      renderElements(canvas);
    };

    imgElement.onerror = (e) => {
      console.warn("❌ 배경 이미지 로딩 실패:", diary.background?.mediaId, e);
    };

    imgElement.src = diary.background?.mediaId;

    console.log(`🎨 [${debugId}] fabric.Canvas 생성됨`);
    console.log(`🎨 [${debugId}] canvas.backgroundColor:`, canvas.backgroundColor);
    console.log(`🧩 [${debugId}] diary.elements.length:`, diary.elements?.length);

    diary.elements?.forEach((el, i) => {
      console.log(`🧩 [${debugId}] Element[${i}]`);
      console.log(" - type:", el.elementType);
      console.log(" - content:", el.content);
      console.log(" - date:", el.date);
      console.log(" - drawingData:", el.drawingData);
    });

    // fabric의 Textbox와 Path 클래스를 가져옵니다.
    const fabricTextbox = window.fabric?.Textbox || ImportedTextbox;
    const fabricPath = window.fabric?.Path || ImportedPath;

    const renderElements = async () => {
      const renderImages = async (elements) => {
        for (const el of elements) {
          const { content, position = [0, 0], scale = 1, rotation = 0 } = el;
          const [x, y] = position;
          await new Promise((resolve) => {
            const imgElement = new window.Image();
            imgElement.onload = () => {
              const fabricImg = new Image(imgElement, {
                left: x,
                top: y,
                scaleX: scale,
                scaleY: scale,
                angle: rotation,
                selectable: false,
                evented: false,
                originX: "left",
                originY: "top",
              });
              fabricImg.isSticker = false;
              fabricImg.isBackground = false;
              canvas.add(fabricImg);
              resolve();
            };
            imgElement.onerror = () => resolve();
            imgElement.src = content?.mediaId;
          });
        }
      };

      const renderStickers = async (elements) => {
        for (const el of elements) {
          const { content, position = [0, 0], scale = 1, rotation = 0 } = el;
          const [x, y] = position;
          await new Promise((resolve) => {
            const imgElement = new window.Image();
            imgElement.onload = () => {
              const fabricImg = new Image(imgElement, {
                left: x,
                top: y,
                scaleX: scale,
                scaleY: scale,
                angle: rotation,
                selectable: false,
                evented: false,
                originX: "left",
                originY: "top",
              });
              fabricImg.isSticker = true;
              canvas.add(fabricImg);
              resolve();
            };
            imgElement.onerror = () => resolve();
            imgElement.src = content?.mediaId;
          });
        }
      };

      const renderDrawings = async (elements) => {
        for (let i = 0; i < elements.length; i++) {
          const el = elements[i];
          const { drawingData, position = [0, 0], scale = 1, rotation = 0 } = el;
          const [x, y] = position;

          if (!drawingData) continue;

          const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg">${drawingData}</svg>`;
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(fullSvg, "image/svg+xml");
          const pathNode = svgDoc.querySelector("path");
          if (!pathNode) continue;

          const d = pathNode.getAttribute("d");
          if (!d) continue;

          let stroke = pathNode.getAttribute("stroke");
          const styleAttr = pathNode.getAttribute("style");

          console.log(`[${i}] styleAttr:`, styleAttr);
          console.log(`[${i}] 초기 stroke:`, stroke);

          if (!stroke && styleAttr) {
            const match = styleAttr.match(/stroke:\s*(#[0-9a-fA-F]{3,6}|rgb\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\))/);
            if (match) stroke = match[1];
          }
          if (!stroke) stroke = "#000000";

          let strokeWidth = parseFloat(pathNode.getAttribute("stroke-width"));
          if (isNaN(strokeWidth) && styleAttr) {
            const widthMatch = styleAttr.match(/stroke-width:\s*(\d+(?:\.\d+)?)/);
            if (widthMatch) strokeWidth = parseFloat(widthMatch[1]);
          }
          if (isNaN(strokeWidth)) strokeWidth = 2;

          console.log(`🎨 [${i}] stroke(final):`, stroke);
          console.log(`🎨 [${i}] strokeWidth(final):`, strokeWidth);

          const drawing = new fabricPath(d, {
            left: x,
            top: y,
            scaleX: scale,
            scaleY: scale,
            angle: rotation,
            stroke,
            strokeWidth,
            fill: null,
            selectable: false,
            evented: false,
            originX: "left",
            originY: "top",
          });

          canvas.add(drawing);
        }
      };

      const renderTexts = async (elements) => {
        for (const el of elements) {
          const { elementType, content, date, position = [0, 0], scale = 1, rotation = 0, size = [] } = el;
          const [x, y] = position;
          const [width = 150, height = 40] = size;
          // 수정: content?.text가 undefined이면 빈 문자열을 사용
          const textStr = elementType === "DATE"
            ? (date || content?.date || "날짜 없음")
            : (content?.text || "");
          // 텍스트 요소가 있을 때만 split 호출
          // 예: 여기서 내부적으로 fabricTextbox 생성 시 문제가 없도록 함
          const text = new fabricTextbox(textStr, {
            left: x,
            top: y,
            width: width,
            fontSize: (height / 2.5) || 24,
            angle: rotation,
            fill: "#000",
            selectable: false,
            evented: false,
            originX: "left",
            originY: "top",
          });
          canvas.add(text);
        }
      };

      const imageElements = diary.elements.filter(el => el.elementType === "IMAGE");
      const stickerElements = diary.elements.filter(el => el.elementType === "STICKER");
      const drawingElements = diary.elements.filter(el => el.elementType === "DRAWING");
      const textElements = diary.elements.filter(el => el.elementType === "TEXT" || el.elementType === "DATE");

      await renderImages(imageElements);
      await renderStickers(stickerElements);
      await renderDrawings(drawingElements);
      await renderTexts(textElements);

      const allObjects = canvas.getObjects();
      const drawings = allObjects.filter(o => o.type === "path");
      const stickers = allObjects.filter(o => o.type === "image" && o.isSticker);
      const images = allObjects.filter(o => o.type === "image" && !o.isSticker && !o.isBackground);
      const texts = allObjects.filter(o => o.type === "textbox");
      const background = allObjects.find(o => o.type === "image" && o.isBackground);

      const newOrder = [
        ...(background ? [background] : []),
        ...images,
        ...stickers,
        ...texts,
        ...drawings,
      ];

      canvas._objects = newOrder;
      canvas.renderAll();
      console.log("✅ canvas 최종 객체 순서:", canvas.getObjects().map(o => o.type || o.constructor.name));
    };

    renderElements();

    return () => {
      canvas.dispose();
      console.log(`🧹 [${debugId}] 캔버스 정리 완료`);
    };
  }, [diary]);

  const mediaElements = React.useMemo(() => {
    return diary.elements
      .filter(el => ["AUDIO", "VIDEO"].includes(el.elementType))
      .map((el, i) => {
        const [x, y] = el.position || [0, 0];
        const scale = el.scale || 1;
        const rotation = el.rotation || 0;

        return (
          <div
            key={`media-${i}`}
            style={{
              position: "absolute",
              top: `${y}px`,
              left: `${x}px`,
              width: `${300 * scale}px`,
              height: `${200 * scale}px`,
              transform: `rotate(${rotation}deg)`,
              zIndex: 30,
              pointerEvents: "auto",
            }}
          >
            {el.elementType === "AUDIO" ? (
              <audio src={el.content.mediaId} controls style={{ width: "100%" }} />
            ) : (
              <video src={el.content.mediaId} controls style={{ width: "100%", height: "100%" }} />
            )}
          </div>
        );
      });
  }, [diary.elements]);

  return (
    <div className="relative w-[800px] h-[800px]">
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        style={{
          backgroundColor: "transparent",
          border: "2px dashed red",
          position: "absolute",
          zIndex: 1,
        }}
      />
      {mediaElements}
    </div>
  );
};

export default FabricCanvasViewer;
