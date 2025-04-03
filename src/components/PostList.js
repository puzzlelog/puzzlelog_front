import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);  // 필터링된 게시글
  const [diaries, setDiaries] = useState([]);
  const [filter, setFilter] = useState('all');  // 'all' 또는 'mine'
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;  
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // 페이지 변경 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 게시글 불러오기
useEffect(() => {
    axios.get("https://api.puzzlelog.me/posts")
      .then(response => {
        if (Array.isArray(response.data.data)) {
          console.log("불러온 게시글 데이터:", response.data.data); // 게시글 데이터 확인
          const postsWithCommentCount = response.data.data.map(post =>
            axios.get(`https://api.puzzlelog.me/posts/${post.id}/comments/count`)
              .then(commentCountResponse => ({
                ...post,
                commentCount: commentCountResponse.data.data
              }))
          );
          Promise.all(postsWithCommentCount).then(posts => {
            // createdAt을 기준으로 내림차순 정렬
            const sortedPosts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setPosts(sortedPosts);
            setFilteredPosts(sortedPosts);
          });
        } else {
          console.error("응답 데이터에 'data' 속성이 없거나 배열이 아닙니다.");
        }
      })
      .catch(error => {
        console.error("게시글을 불러오는 중 오류 발생 : ", error);
      });
  }, []);  

  // 일기 불러오기 (공유된 일기만 포함할 수도 있음)
  useEffect(() => {
    axios.get(`https://api.puzzlelog.me/diaries?userId=${userId}&includeElements=true`)
      .then(res => {
        // 예시에서는 openAt이 null 인 일기를 불러옵니다.
        const onlyDiaries = res.data.data.diaries.filter(d => d.openAt === null);
        setDiaries(onlyDiaries);
      })
      .catch(err => {
        console.error("일기 데이터를 불러오는 중 오류 발생:", err);
      });
  }, [userId]);

  // 필터링: 'mine'인 경우 내 게시글만, 아니면 전체
  useEffect(() => {
    if (filter === 'mine') {
      setFilteredPosts(posts.filter(post => post.userId === userId));
    } else {
      setFilteredPosts(posts);
    }
  }, [filter, posts, userId]);

  // 게시글 페이징 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // 모든 일기를 빠르게 조회하기 위해 Map 생성 (key: diary.id)
  const diaryMap = useMemo(() => {
    const map = new Map();
    diaries.forEach(diary => {
      map.set(diary.diaryId, diary);
    });
    return map;
  }, [diaries]);

  const toggleLike = (postId) => {
    axios.patch(`https://api.puzzlelog.me/posts/${postId}/like?userId=${userId}`)
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
    axios.delete(`https://api.puzzlelog.me/posts/${postId}`)
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
      <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-200 to-purple-300 overflow-auto">
        <Header />
        <main className="mt-28 w-full max-w-5xl font-cafe24 mx-auto">
          <div className="text-center">
            <h2 className="text-3xl text-left text-[#6B4F35] mb-6 font-bold">커뮤니티</h2>
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 opacity-60 transition hover:border-transparent hover:scale-105 rounded-md ${filter === 'all' ? 'bg-[#7430B7] text-white' : 'bg-gray-200'}`}
                >
                  전체 게시글
                </button>
                <button
                  onClick={() => setFilter('mine')}
                  className={`px-4 py-2 opacity-60 transition hover:border-transparent hover:scale-105 rounded-md ${filter === 'mine' ? 'bg-[#7430B7] text-white' : 'bg-gray-300'}`}
                >
                  내 게시글
                </button>
              </div>
              <button
                onClick={() => navigate("/uploadPost")}
                className="mr-6 px-4 py-1 border border-white bg-white/20 text-black rounded-md text-lg hover:bg-white hover:text-black transition-all duration-300 hover:border-transparent hover:scale-105"
              >
                게시글 작성
              </button>
            </div>
            {filteredPosts.length > 0 ? (
              <>
                <div className="grid grid-cols-1">
                  {currentPosts.map((post) => {
                    // 각 게시글에 연결된 일기는 post.diaryId를 이용해 diaryMap에서 조회합니다.
                    const diary = diaryMap.get(post.diaryId);
                    console.log(`게시글 ID: ${post.id}, 일기 ID: ${post.diaryId}, 찾은 일기:`, diary);
                    return (
                      <div key={post.id} className="rounded-lg shadow-2xl shadow-indigo-500/50 flex flex-col items-center justify-center text-xl mb-6"
                        style={{
                          animation: "pulseGlow2 3s infinite",
                          background: "rgba(255, 255, 255, 0.2)",
                          transition: "all 0.3s ease",
                          width: '100%', 
                          maxWidth: '1000px',
                          padding: '20px'
                        }}>
                        <div className="flex justify-between items-center w-full m-2">
                          <h2 
                            className="text-2xl font-semibold cursor-pointer transition hover:border-transparent hover:scale-105"
                            onClick={() => navigate(`/post/${post.id}`)}
                          >
                            {post.title}
                          </h2>
                          
                          {post.userId === userId && (
                            <img
                              className="w-6 h-6 cursor-pointer close hover:border-transparent hover:scale-110"
                              src="close.svg"
                              alt="삭제"
                              onClick={() => deletePost(post.id)}
                            />
                          )}
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <p className="text-left mb-4">작성자 : {post.userId}</p>
                          <p className="text-gray-700">
                            {new Date(post.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {/* 게시글과 연결된 일기가 있으면 FabricCanvasViewer를 통해 보여줍니다 */}
                        <div className="max-w-[1800px] mx-auto">
                          {diary ? (
                            <div
                              key={diary.diaryId}
                              className="overflow-hidden p-4 flex justify-center items-center w-full h-[800px]"
                            >
                              <FabricCanvasViewer diary={diary} debugId={post.diaryId}/>
                            </div>
                          ) : (
                            <div className="text-center text-gray-700 text-xl font-cafe24 mt-20">
                              연결된 일기가 없습니다.
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between items-center w-full mt-6">
                          <button className="text-2xl focus:outline-none transition hover:border-transparent hover:scale-105" onClick={() => toggleLike(post.id)}>
                            <span>
                              {post.liked ? "❤️" : "🤍"}
                              <span className="text-2xl ml-2">{post.likesCount}</span>
                            </span>
                          </button>
                          <div className="flex items-center transition hover:border-transparent hover:scale-105">
                            <img 
                              className="w-12 h-7 cursor-pointer"
                              onClick={() => navigate(`/post/${post.id}`)} 
                              src="message-square.svg" 
                              alt="댓글" 
                            />
                            <span className="text-2xl">{post.commentCount}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center mt-6">
                  <button 
                    onClick={() => paginate(currentPage - 1)} 
                    disabled={currentPage === 1} 
                    className="px-4 py-2 bg-[#7430B7] text-white rounded-md mr-2 disabled:bg-gray-400"
                  >
                    이전
                  </button>
                  <button 
                    onClick={() => paginate(currentPage + 1)} 
                    disabled={currentPage * postsPerPage >= filteredPosts.length} 
                    className="px-4 py-2 bg-[#7430B7] text-white rounded-md ml-2 disabled:bg-gray-400"
                  >
                    다음
                  </button>
                </div><br />
              </>
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