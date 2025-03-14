import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
            <button 
                onClick={() => navigate("/myPage")}
                style={{ fontSize: "24px", padding: "10px 20px", cursor: "pointer" }}
            >
                마이페이지
            </button>
            <button 
                onClick={() => navigate("/friend")}
                style={{ fontSize: "24px", padding: "10px 20px", cursor: "pointer" }}
            >
                친구목록
            </button>
            <button 
                onClick={() => navigate("/makePiece")}
                style={{ fontSize: "24px", padding: "10px 20px", cursor: "pointer" }}
            >
                조각생성
            </button>
        </div>
        
    );
};

export default Home;