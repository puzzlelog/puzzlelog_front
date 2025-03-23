import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Image, Textbox, Path } from "fabric";
import axios from "axios";

const FabricCanvasViewer = ({ diaryId }) => {
    const canvasRef = useRef(null);
    const fabricCanvas = useRef(null);
    const [diaryData, setDiaryData] = useState(null);
    const [backgroundURL, setBackgroundURL] = useState(null);

    // 1️⃣ diary 상세정보 가져오기
    useEffect(() => {
        const fetchDiaryDetails = async () => {
            try {
                const res = await axios.get(`http://api.puzzlelog.me/diaries/${diaryId}`, { withCredentials: true });
                setDiaryData(res.data.data);
            } catch (err) {
                console.error("Diary 상세 불러오기 실패:", err);
            }
        };
        fetchDiaryDetails();
    }, [diaryId]);

    // 2️⃣ backgroundContentId 이미지 URL 가져오기
    useEffect(() => {

        if (diaryData?.backgroundContentId && diaryData.backgroundContentId !== "default-background-id") {
            const fetchBackground = async () => {
                try {
                    const res = await axios.get(`http://api.puzzlelog.me/api/admin/stickers/${diaryData.backgroundContentId}`, {
                        withCredentials: true,
                    });
                    if (res.data.success) {
                        setBackgroundURL(res.data.data.imageUrl);
                    }
                } catch (err) {
                    console.warn("배경 이미지 URL 불러오기 실패:", err);
                }
            };
            fetchBackground();
        }
    }, [diaryData]);

    // 3️⃣ Canvas 렌더링
    useEffect(() => {
        if (!diaryData) return;

        console.log("📥 렌더링할 elements:", diaryData.elements);
        console.log("🟢 backgroundContentId:", diaryData.backgroundContentId);
        console.log("🟢 backgroundURL:", backgroundURL);


        if (fabricCanvas.current) fabricCanvas.current.dispose();

        const canvas = new Canvas(canvasRef.current, { selection: false });
        fabricCanvas.current = canvas;



        // 배경 이미지 적용
        if (backgroundURL) {
            Image.fromURL(backgroundURL, (img) => {
                img.set({ selectable: false, evented: false });
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
            });
        }

        // 요소 렌더링
        (diaryData.elements || []).forEach((element) => {
            switch (element.elementType) {
                case 'STICKER':
                case 'IMAGE':
                    if (element.contentId && element.contentId.startsWith('http')) {
                        Image.fromURL(element.contentId, (img) => {
                            img.set({
                                left: element.position[0],
                                top: element.position[1],
                                scaleX: element.scale,
                                scaleY: element.scale,
                                angle: element.rotation,
                                selectable: false,
                                evented: false,
                            });
                            canvas.add(img);
                        }, { crossOrigin: 'anonymous' }); // crossOrigin 추가
                    } else {
                        console.warn("⚠️ 이미지 URL 잘못됨:", element.contentId);
                    }
                    break;

                case 'TEXT':
                    if (element.contentId) { // contentId 존재할 때만 생성
                        const text = new Textbox(element.contentId, {
                            left: element.position[0],
                            top: element.position[1],
                            fontSize: 24,
                            fill: 'black',
                            scaleX: element.scale,
                            scaleY: element.scale,
                            angle: element.rotation,
                            selectable: false,
                            evented: false,
                        });
                        canvas.add(text);
                    } else {
                        console.warn("⚠️ TEXT 요소 contentId가 null입니다:", element);
                    }
                    break;
                case 'DRAWING':
                    if (element.drawingData) {
                        const svg = decodeURIComponent(element.drawingData);
                        canvas.loadFromSVG(svg, (objects) => {
                            objects.forEach(obj => {
                                obj.set({
                                    left: element.position[0],
                                    top: element.position[1],
                                    scaleX: element.scale,
                                    scaleY: element.scale,
                                    angle: element.rotation,
                                    selectable: false,
                                    evented: false,
                                });
                                canvas.add(obj);
                            });
                            canvas.renderAll();
                        });
                    }
                    break;
                case 'DATE':
                    const dateText = new Textbox(element.date, {
                        left: element.position[0],
                        top: element.position[1],
                        fontSize: 20,
                        fill: 'gray',
                        selectable: false,
                        evented: false,
                    });
                    canvas.add(dateText);
                    break;
                case 'VIDEO':
                case 'AUDIO':
                    const mediaElement = document.createElement(
                        element.elementType === 'VIDEO' ? 'video' : 'audio'
                    );
                    mediaElement.src = element.contentId;
                    mediaElement.controls = true;
                    mediaElement.style.position = 'absolute';
                    mediaElement.style.left = `${element.position[0]}px`;
                    mediaElement.style.top = `${element.position[1]}px`;
                    mediaElement.style.transform = `scale(${element.scale}) rotate(${element.rotation}deg)`;
                    mediaElement.style.pointerEvents = 'none';
                    mediaElement.style.zIndex = 50;
                    canvas.wrapperEl.appendChild(mediaElement);
                    break;
                default:
                    console.warn('알 수 없는 요소 타입:', element.elementType);
            }
        });

        return () => {
            canvas.dispose();
        };
    }, [diaryData, backgroundURL]);

    return (
        <div style={{ position: 'relative' }}>
            <canvas ref={canvasRef} width={800} height={600} />
        </div>
    );
};

export default FabricCanvasViewer;
