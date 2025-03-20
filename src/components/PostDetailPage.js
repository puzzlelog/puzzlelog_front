import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
            axios.get(`http://localhost:8080/api/posts/${id}`)
                .then(response => {
                    setPost(response.data);
                })
                .catch(error => {
                    console.error("게시글을 불러오는 중 오류 발생 : ", error);
                });
            
            // 댓글 불러오기
            axios.get(`http://localhost:8080/api/posts/${id}/comments`)
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
        axios.patch(`http://localhost:8080/api/posts/${postId}/like?userId=${userId}`)
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
        axios.post(`http://localhost:8080/api/posts/${id}/comments`, commentData)
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
            axios.delete(`http://localhost:8080/api/posts/${id}`)
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
            axios.delete(`http://localhost:8080/api/posts/${id}/comments/${commentId}`)
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
        <div className="min-h-screen bg-[#F7F3E5] flex flex-col items-center">
            {/* 헤더 영역 */}
            <header className="w-full flex justify-between items-center px-10 py-4">
                {/* 로고 이미지 */}
                <img
                    src="/logo.png"
                    alt="PuzzleLog Logo"
                    className="w-36 cursor-pointer"
                    onClick={() => navigate("/home")}
                />

                <nav className="flex gap-6 text-sm">
                    <a href="/makePiece" className="hover:underline">조각 쓰기</a>
                    <a href="#" className="hover:underline">일기장 쓰기</a>
                    <a href="#" className="hover:underline">감정 캘린더</a>
                    <a href="#" className="hover:underline">커뮤니티</a>
                    <a href="#" className="hover:underline">모음집</a>
                    <a href="/myPage" className="hover:underline">마이페이지</a>
                </nav>

                <button
                    onClick={handleLogout}
                    className="px-6 py-2 border border-[#6B4F35] text-[#6B4F35] rounded-md"
                >
                    로그아웃
                </button>
            </header>

            <main className="mt-20 w-full max-w-[1500px]">
                {post ? (
                    <div className="bg-white p-6 rounded-lg shadow-md">
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

                <div className="mt-6 bg-white p-4 rounded-lg shadow-md">

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
                        className="text-white text-left font-medium text-base leading-[150%] relative px-6 py-2 bg-[#DEB784] rounded-md hover:bg-[#C89A60]"
                    >
                        댓글 작성
                    </button>
                </div>

                <button
                    className="mt-6 px-4 py-2 bg-gray-400 text-white rounded-md"
                    onClick={() => navigate(-1)}
                >
                    뒤로 가기
                </button>
            </main>
        </div>
    );
};

export default PostDetailPage;
