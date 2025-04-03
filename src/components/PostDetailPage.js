import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import FabricCanvasViewer from './FabricCanvasViewer';

const auroraStyle = `
@keyframes aurora {
  0% { transform: translateX(-100%) rotate(0deg); opacity: 0.3; }
  50% { transform: translateX(100%) rotate(10deg); opacity: 0.5; }
  100% { transform: translateX(-100%) rotate(0deg); opacity: 0.3; }
}

@keyframes pulseGlow {
  0% {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 1), 0 0 40px rgba(255, 255, 255, 0.8);
    transform: scale(1.05);
  }
  100% {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6);
    transform: scale(1);
  }
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

const PostDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [commentContent, setCommentContent] = useState("");
    const [comments, setComments] = useState([]);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (id) {
            // 게시글 불러오기
            axios.get(`https://api.puzzlelog.me/posts/${id}`)
                .then(response => {
                    const postData = response.data.data;
                    console.log("불러온 게시글 데이터:", postData);  // 게시글 데이터 확인
                    setPost(postData);
    
                    // 게시글의 diaryId로 일기 데이터 불러오기
                    if (postData.diaryId) {
                        console.log("일기 ID:", postData.diaryId);  // 일기 ID 확인
                        axios.get(`https://api.puzzlelog.me/diaries/${postData.diaryId}`)
                            .then(res => {
                                const diaryData = res.data.data;
                                console.log("불러온 일기 데이터:", diaryData);  // 일기 데이터 확인
                                setPost(prevPost => ({
                                    ...prevPost,
                                    diary: diaryData // post 객체에 diary 추가
                                }));
                            })
                            .catch(error => {
                                console.error("일기 데이터를 불러오는 중 오류 발생:", error);
                            });
                    } else {
                        console.log("일기 ID가 없습니다.");
                    }
                })
                .catch(error => {
                    console.error("게시글을 불러오는 중 오류 발생 : ", error);
                });
    
            // 댓글 불러오기
            axios.get(`https://api.puzzlelog.me/posts/${id}/comments`)
                .then(response => {
                    setComments(response.data.data);
                })
                .catch(error => {
                    console.error("댓글 불러오는 중 오류 발생 : ", error);
                });
        }
    }, [id]);     

    const toggleLike = (postId) => {
        axios.patch(`https://api.puzzlelog.me/posts/${postId}/like?userId=${userId}`)
            .then(response => {
                setPost(prevPost => ({
                    ...prevPost,
                    liked: response.data.data.liked,
                    likesCount: response.data.data.likesCount
                }));
            })
            .catch(error => {
                console.error("좋아요 처리 중 오류 발생: ", error);
            });
    };

    const handleCommentSubmit = () => {
        if (commentContent.trim() === "") {
            alert("댓글 내용을 입력해주세요.");
            return;
        }

        const commentData = {
            userId: userId,
            content: commentContent,
        };

        axios.post(`https://api.puzzlelog.me/posts/${id}/comments`, commentData)
            .then(response => {
                const newComment = response.data.data;
                setComments((prevComments) => (
                    Array.isArray(prevComments) ? [newComment, ...prevComments] : [newComment]
                ));
                setCommentContent(""); // 입력 필드 초기화
            })
            .catch(error => {
                console.error("댓글 작성 중 오류 발생 : ", error);
            });
    };

    // 댓글 삭제 함수
    const handleDeleteComment = (commentId) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            axios.delete(`https://api.puzzlelog.me/posts/${id}/comments/${commentId}`)
                .then(() => {
                    setComments((prevComments) => (
                        Array.isArray(prevComments) 
                            ? prevComments.filter(comment => comment.id !== commentId)
                            : []
                    ));
                })
                .catch(error => {
                    console.error("댓글 삭제 중 오류 발생 : ", error);
                });
        }
    };

    const handleDelete = () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            axios.delete(`https://api.puzzlelog.me/posts/${id}`)
                .then(() => {
                    alert("게시글이 삭제되었습니다.");
                    navigate("/postList");
                })
                .catch(error => {
                    console.error("게시글 삭제 중 오류 발생: ", error);
                });
        }
    };

    if (!post) {
        return <p className="text-center text-gray-600">게시글 불러오는 중</p>;
    }

    return (
        <div className="relative w-full h-screen overflow-auto bg-gradient-to-br from-blue-200 to-purple-300">
            <style>{auroraStyle}</style>
            <Header />

            <main className="mt-32 w-full max-w-7xl font-cafe24 mx-auto flex space-x-6">
                <div className="flex-1 bg-white p-12 rounded-lg shadow-md mb-12"
                    style={{
                        animation: "pulseGlow2 3s infinite",
                        background: "rgba(255, 255, 255, 0.3)",
                    }}
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
                        {post.userId === userId && (
                            <img
                                className="w-6 h-6 cursor-pointer close"
                                src="../close.svg"
                                alt="삭제"
                                onClick={handleDelete}
                            />
                        )}
                    </div>

                    <FabricCanvasViewer
                        diary={post?.diary || { elements: [] }}  // diary가 없으면 빈 배열로 전달
                        debugId={post?.diaryId}
                    />


                    <div className="flex items-center justify-between mt-8">
                        <button
                            className="text-xl focus:outline-none"
                            onClick={() => toggleLike(post.id)}
                        >
                            <span>
                                {post.liked ? "❤️" : "🤍"}
                                <span className="text-base">{post.likesCount}</span>
                            </span>
                        </button>
                        <span className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleString()}</span>
                    </div>
                </div>

                <div className="w-1/3 bg-white p-4 rounded-lg shadow-md mb-12"
                    style={{
                        animation: "pulseGlow2 3s infinite",
                        background: "rgba(255, 255, 255, 0.3)",
                    }}
                >
                    <div className="mb-4">
                        <div className="flex items-center space-x-1">
                            <img className="w-10 h-6" src="./../message-square.svg" alt="댓글" />
                            <span className="text-base text-gray-700">{comments?.length || 0}</span>
                        </div><br />
                        {comments && comments.length > 0 ? (
                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="border-b pb-2">
                                        <p className="text-sm font-medium text-[#6B4F35]">{comment.userId}</p>
                                        <div className="flex justify-between items-center">
                                            <p className="text-gray-600">{comment.content}</p>
                                            {comment.userId === userId && (
                                                <img
                                                    className="w-6 h-6 cursor-pointer close"
                                                    src="../close.svg"
                                                    alt="삭제"
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                />
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {new Date(comment.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">작성된 댓글이 없습니다.</p>
                        )}
                    </div>

                    <textarea
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="댓글 입력"
                        className="w-full h-24 p-4 border border-gray-300 rounded-md resize-none"
                    />

                    <div className="flex justify-between items-center">
                        <button
                            className="mt-4 px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition hover:border-transparent hover:scale-105"
                            onClick={() => navigate(-1)}
                        >
                            뒤로 가기
                        </button>
                        <button
                            onClick={handleCommentSubmit}
                            className="px-6 py-2 rounded-lg text-white transition hover:border-transparent hover:scale-105 bg-[#6A0DAD] hover:bg-[#7A3C98]"
                        >
                            댓글 작성
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PostDetailPage;