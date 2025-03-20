import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);  // 필터링된 게시글
    const [filter, setFilter] = useState('all');  // 'all' 또는 'mine' 필터 상태
    const navigate = useNavigate();
    const userId = "1";

    useEffect(() => {
        axios.get("http://localhost:8080/api/posts")
            .then(response => {
                console.log("📌 게시글 데이터:", response.data); // 데이터 확인
    
                if (Array.isArray(response.data.data)) {
                    const postsWithCommentCount = response.data.data.map(post => {
                        // 각 게시글의 댓글 개수도 가져오기
                        return axios.get(`http://localhost:8080/api/posts/${post.id}/comments/count`)
                            .then(commentCountResponse => ({
                                ...post,
                                commentCount: commentCountResponse.data.data
                            }));
                    });
    
                    // 모든 요청이 완료된 후에 상태 업데이트
                    Promise.all(postsWithCommentCount).then(posts => {
                        console.log("📌 최종 게시글 목록:", posts);
                        setPosts(posts);
                        setFilteredPosts(posts);  // 전체 게시글을 필터링된 목록으로 설정
                    });
                } else {
                    console.error("응답 데이터에 'data' 속성이 없거나 배열이 아닙니다.");
                }
            })
            .catch(error => {
                console.error("게시글을 불러오는 중 오류 발생 : ", error);
            });
    }, []);

    useEffect(() => {
        if (filter === 'mine') {
            setFilteredPosts(posts.filter(post => post.userId === userId));  // 내 게시글만 필터링
        } else {
            setFilteredPosts(posts);  // 전체 게시글 표시
        }
    }, [filter, posts]);  // filter나 posts가 변경될 때마다 실행

    const toggleLike = (postId) => {
        axios.patch(`http://localhost:8080/api/posts/${postId}/like?userId=${userId}`)
            .then(response => {
                const updatedPosts = posts.map(post => 
                    post.id === postId ? { ...post, liked: response.data.data.liked, likesCount: response.data.data.likesCount } : post
                );
                setPosts(updatedPosts);
            })
            .catch(error => {
                console.error("좋아요 처리 중 오류 발생: ", error);
            });
    };

    const handleLogout = () => {
        localStorage.removeItem("userId");
        navigate("/login");
    };

    const deletePost = (postId) => {
        axios.delete(`http://localhost:8080/api/posts/${postId}`)
            .then(() => {
                setPosts(posts.filter(post => post.id !== postId));
            })
            .catch(error => {
                console.error("게시글 삭제 중 오류 발생: ", error);
            });
    };

    return (
        <div className="min-h-screen bg-[#F7F3E5] flex flex-col items-center">
            <header className="w-full flex justify-between items-center px-10 py-4">
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

            <main className="mt-20 w-full max-w-[1550px]">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">커뮤니티</h1>
                    <button
                        onClick={() => navigate("/uploadPost")}
                        className="text-white text-left font-medium text-base leading-[150%] relative px-6 py-2 bg-[#DEB784] rounded-md hover:bg-[#C89A60]"
                    >
                        게시글 작성
                    </button>
                </div>

                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-[#DEB784]' : 'bg-gray-300'}`}
                    >
                        전체 게시글
                    </button>
                    <button
                        onClick={() => setFilter('mine')}
                        className={`px-4 py-2 rounded-md ${filter === 'mine' ? 'bg-[#DEB784]' : 'bg-gray-300'}`}
                    >
                        내 게시글
                    </button>
                </div>

                {filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map(post => (
                            <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex justify-between items-center">
                                    <h2 
                                        className="text-xl font-semibold cursor-pointer"
                                        onClick={() => navigate(`/post/${post.id}`)}
                                    >
                                        {post.title}
                                    </h2>

                                    {/* 본인이 작성한 게시글일 때만 삭제 버튼 표시 */}
                                    {post.userId === userId && (
                                        <img
                                            className="w-6 h-6 cursor-pointer close"
                                            src="close.svg"
                                            alt="삭제"
                                            onClick={() => deletePost(post.id)}
                                        />
                                    )}
                                </div>

                                <p className="text-gray-700 mt-2 cursor-pointer"
                                    onClick={() => navigate(`/post/${post.id}`)}>{post.content}</p>
                                <p className="text-gray-700 mt-2">
                                    {new Date(post.createdAt).toLocaleString()}
                                </p>

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

                                    {/* 댓글 아이콘과 댓글 개수 */}
                                    <div className="flex items-center">
                                        <img 
                                            className="w-10 h-6 cursor-pointer"
                                            onClick={() => navigate(`/post/${post.id}`)} 
                                            src="message-square.svg" 
                                            alt="댓글" 
                                        />
                                        <span className="ml-2 text-lg">
                                            {post.commentCount}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 text-lg text-center">작성된 게시글이 없습니다.</p>
                )}
            </main>
        </div>
    );
};

export default PostList;
