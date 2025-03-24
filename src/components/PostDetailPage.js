import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";

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
    const { id } = useParams(); // 게시글 id를 URL 파라미터에서 추출
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [commentContent, setCommentContent] = useState(""); // 댓글 입력 상태
    const [comments, setComments] = useState([]); // 댓글 목록
    const userId = "1"; // 임의로 userId를 1로 설정 (로그인한 사용자 ID로 변경 필요)

    useEffect(() => {

        if (id) { // id가 유효한지 확인
            // 게시글 불러오기
            axios.get(`http://api.puzzlelog.me/posts/${id}`)
                .then(response => {
                    setPost(response.data);
                })
                .catch(error => {
                    console.error("게시글을 불러오는 중 오류 발생 : ", error);
                });
            
            // 댓글 불러오기
            axios.get(`http://api.puzzlelog.me/posts/${id}/comments`)
                .then(response => {
                    console.log("댓글 응답 : ", response.data);
                    setComments(response.data);
                })
                .catch(error => {
                    console.error("댓글 불러오는 중 오류 발생 : ", error);
                });
        }
    }, [id]);

    const toggleLike = (postId) => {
        axios.patch(`http://api.puzzlelog.me/posts/${postId}/like?userId=${userId}`)
            .then(response => {
                // 현재 게시글의 좋아요 상태만 업데이트
                setPost(prevPost => ({
                    ...prevPost,
                    liked: response.data.liked,
                    likesCount: response.data.likesCount
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
            userId: userId, // 사용자 ID
            content: commentContent, // 댓글 내용
        };

        // 댓글 작성 API 요청
        axios.post(`http://api.puzzlelog.me/posts/${id}/comments`, commentData)
            .then(response => {
                setComments([...comments, response.data]); // 댓글 목록에 새 댓글 추가
                setCommentContent(""); // 댓글 입력창 초기화
            })
            .catch(error => {
                console.error("댓글 작성 중 오류 발생 : ", error);
            });
    };

    const handleDelete = () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            axios.delete(`http://api.puzzlelog.me/posts/${id}`)
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

    const handleLogout = () => {
        localStorage.removeItem("userId");
        navigate("/login");
    };

    const handleDeleteComment = (commentId) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            axios.delete(`http://api.puzzlelog.me/posts/${id}/comments/${commentId}`)
                .then(() => {
                    // 삭제된 댓글을 목록에서 제거
                    setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
                })
                .catch(error => {
                    console.error("댓글 삭제 중 오류 발생 : ", error);
                });
        }
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-200 to-purple-300">
            <style>{auroraStyle}</style>
            <Header />
            

            <main className="mt-44 w-full max-w-7xl font-cafe24 mx-auto justify-center items-center">
                {post ? (
                    <div className="bg-white p-6 rounded-lg shadow-md"
                        style={{
                            animation: "pulseGlow2 3s infinite",
                            background: "rgba(255, 255, 255, 0.3)",
                        }}
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-bold">{post.title}</h2>
                            {/* 본인이 작성한 게시글일 때만 삭제 버튼 표시 */}
                            {post.userId === userId && (
                                <img
                                    className="w-6 h-6 cursor-pointer close"
                                    src="../close.svg"
                                    alt="삭제"
                                    onClick={handleDelete}
                                />
                            )}
                        </div>
                            
                        <p className="text-gray-700 mt-2">{post.content}</p>
                        <div className="flex items-center justify-between mt-4">
                            {/* 좋아요 버튼 */}
                            <button
                                className="text-2xl focus:outline-none"
                                onClick={() => toggleLike(post.id)}
                            >
                                <span>
                                    {post.liked ? "❤️" : "🤍"}

                                    <span className="text-lg">
                                        {post.likesCount}
                                    </span>
                                </span>
                            </button>

                            {/* 게시글 작성 시간 */}
                            <span className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleString()}</span>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600 text-lg text-center">게시글을 불러오는 중입니다...</p>
                )}

                <div className="mt-6 bg-white p-4 rounded-lg shadow-md"
                    style={{
                        animation: "pulseGlow2 3s infinite",
                        background: "rgba(255, 255, 255, 0.3)",
                    }}
                >

                    <div className="mb-4">

                        {/* 댓글 아이콘과 댓글 개수 */}
                        <div className="flex items-center space-x-1">
                            <img 
                                className="w-10 h-6"
                                src="./../message-square.svg"
                                alt="댓글"
                            />
                            <span className="text-lg text-gray-700">{comments.length}</span>
                        </div><br />

                        {/* 댓글 목록 표시 */}
                        {comments.length > 0 ? (
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
                            <p className="text-gray-600">댓글이 없습니다.</p>
                        )}
                    </div>

                    <textarea
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="댓글 입력"
                        className="w-full h-24 p-4 border border-gray-300 rounded-md resize-none"
                    />
                    <button
                        onClick={handleCommentSubmit}
                        className="px-6 py-2 rounded-lg text-white transition hover:border-transparent hover:scale-105 bg-[#6A0DAD] hover:bg-[#7A3C98]" style={{ backgroundColor: "rgba(116, 48, 183, 0.6)" }}
                    >
                        댓글 작성
                    </button>
                </div>

                <button
                    className="mt-4 px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition hover:border-transparent hover:scale-105" style={{ backgroundColor: "rgba(169, 169, 169, 0.6)" }}
                    onClick={() => navigate(-1)}
                >
                    뒤로 가기
                </button>
            </main>
        </div>
    );
};

export default PostDetailPage;
