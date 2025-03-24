import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);  // 필터링된 게시글
    const [filter, setFilter] = useState('all');  // 'all' 또는 'mine' 필터 상태
    const navigate = useNavigate();
    const userId = "1";

    useEffect(() => {
        axios.get("http://api.puzzlelog.me/posts")
            .then(response => {
                console.log("📌 게시글 데이터:", response.data); // 데이터 확인
    
                if (Array.isArray(response.data.data)) {
                    const postsWithCommentCount = response.data.data.map(post => {
                        // 각 게시글의 댓글 개수도 가져오기
                        return axios.get(`http://api.puzzlelog.me/posts/${post.id}/comments/count`)
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
        axios.patch(`http://api.puzzlelog.me/posts/${postId}/like?userId=${userId}`)
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
        axios.delete(`http://api.puzzlelog.me/posts/${postId}`)
            .then(() => {
                setPosts(posts.filter(post => post.id !== postId));
            })
            .catch(error => {
                console.error("게시글 삭제 중 오류 발생: ", error);
            });
    };

    return (
        <>
            <style>{auroraStyle}</style>
            <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-200 to-purple-300">
                <Header />

                <main className="mt-44 w-full max-w-7xl font-cafe24 mx-auto justify-center items-center">
                <div className="text-center">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl text-left text-[#6B4F35]">커뮤니티</h2>
                        <button
                            onClick={() => navigate("/uploadPost")}
                            className="px-5 py-1 border border-white bg-white/20 text-black rounded-md font-cafe24pretty text-lg hover:bg-white hover:text-black transition-all duration-300 transition hover:border-transparent hover:scale-105"
                        >
                            게시글 작성
                        </button>
                    </div>

                    <div className="flex space-x-4 mb-6">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 opacity-60 transition hover:border-transparent border hover:scale-105 rounded-md ${filter === 'all' ? 'bg-[#7430B7] text-white' : 'bg-gray-200'}`}
                        >
                            전체 게시글
                        </button>
                        <button
                            onClick={() => setFilter('mine')}
                            className={`px-4 py-2 opacity-60 rounded-md transition hover:border-transparent border hover:scale-105 rounded-md ${filter === 'mine' ? 'bg-[#7430B7] text-white' : 'bg-gray-300'}`}
                        >
                            내 게시글
                        </button>
                    </div>

                    {filteredPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                            {filteredPosts.map(post => (
                                <div key={post.id} className="rounded-lg shadow-2xl shadow-indigo-500/50 flex flex-row items-center justify-center text-xl"
                                    style={{
                                    animation: "pulseGlow2 3s infinite",
                                    display: "flex",
                                    flexDirection: "column", // Flexbox의 방향을 column으로 변경
                                    justifyContent: "center", // 중앙 정렬
                                    alignItems: "center", // 중앙 정렬
                                    background: "rgba(255, 255, 255, 0.2)", // 배경을 하얀색으로 설정하고 투명도 0.9로 설정
                                    transition: "all 0.3s ease",
                                    width: '110%', 
                                    maxWidth: '1200px', 
                                    height: 'auto', 
                                    padding: '40px', 
                                }}>
                                    <div className="flex justify-between items-center w-full">
                                        <h2 
                                            className="text-xl font-semibold cursor-pointer transition hover:border-transparent hover:scale-105"
                                            onClick={() => navigate(`/post/${post.id}`)}
                                        >
                                            {post.title}
                                        </h2>

                                        {/* 본인이 작성한 게시글일 때만 삭제 버튼 표시 */}
                                        {post.userId === userId && (
                                            <img
                                                className="w-6 h-6 cursor-pointer close hover:border-transparent hover:scale-110"
                                                src="close.svg"
                                                alt="삭제"
                                                onClick={() => deletePost(post.id)}
                                            />
                                        )}
                                    </div>

                                    <p className="text-gray-700 mt-4 cursor-pointer"
                                        onClick={() => navigate(`/post/${post.id}`)}>{post.content}</p>
                                    
                                    <div className="flex justify-between items-center w-full mt-6">
                                        <p className="text-gray-700">
                                            {new Date(post.createdAt).toLocaleString()}
                                        </p>

                                        {/* 좋아요 버튼 */}
                                        <button className="text-2xl focus:outline-none transition hover:border-transparent hover:scale-105" onClick={() => toggleLike(post.id)}>
                                            <span>
                                                {post.liked ? "❤️" : "🤍"}
                                                <span className="text-lg ml-2">{post.likesCount}</span>
                                            </span>
                                        </button>

                                        {/* 댓글 아이콘과 댓글 개수 */}
                                        <div className="flex items-center transition hover:border-transparent hover:scale-105">
                                            <img 
                                                className="w-10 h-6 cursor-pointer"
                                                onClick={() => navigate(`/post/${post.id}`)} 
                                                src="message-square.svg" 
                                                alt="댓글" 
                                            />
                                            <span className="ml-2 text-lg">{post.commentCount}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 text-lg text-center">작성된 게시글이 없습니다.</p>
                    )}
                </div>
                </main>
            </div>
        </>
    );
};

export default PostList;
