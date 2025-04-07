import Header from "./Header";
import React, { useState } from 'react';
import axios from 'axios';

function SubscriptionPage () {

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const [subscriptionStatus, setSubscriptionStatus] = useState("미구독");

    // 결제 버튼 클릭 시 호출
    const handleSubscription = async () => {
        try {
            const response = await axios.post('https://api.puzzlelog.me/subscription', {
                partnerOrderId: `sub_${userId}_${Date.now()}`,
                partnerUserId: userId,
                itemName: 'Monthly Subscription',
                totalAmount: 4990
            });
            const { nextRedirectUrl } = response.data.data;
            if (nextRedirectUrl) {
                window.location.href = nextRedirectUrl;
            } else {
                alert('결제 URL을 불러오지 못했습니다.');
            }
        } catch (error) {
            console.error("결제 준비 중 오류 : ", error.response?.data?.message || error.message);
            alert("결제 준비 중 오류가 발생했습니다.");
        }
    };

    // 구독 상태 확인
    const checkSubscriptionStatus = async () => {
        try {
            const response = await axios.get(`https://api.puzzlelog.me/users/${userId}/subscription-status`);
            setSubscriptionStatus(response.data.data || "미구독");
        } catch (error) {
            console.error("구독 상태 확인 중 오류 : ", error.response?.data?.message || error.message);
            alert("구독 상태를 확인할 수 없습니다.");
        }
    };

    // 페이지 로드 시 구독 상태 확인
    React.useEffect(() => {
        checkSubscriptionStatus();
    }, []);

    return (
        <div className="relative w-full h-screen overflow-auto bg-gradient-to-br from-blue-200 to-purple-300">
            <Header />

            <main className="mt-40 w-full max-w-5xl font-cafe24 mx-auto justify-center items-center">
                <div className="flex flex-col gap-4 items-start justify-start">
                    <h1 className="text-4xl font-bold text-gray-900">구독 정보</h1>
                    <p className="text-lg text-gray-700">일상이 특별해지는 순간, 구독으로 더 많은 기능을 자유롭게 사용하세요!</p>
                    <p className="text-lg text-gray-800 mb-12">현재 구독 상태 : <span className="font-semibold">{subscriptionStatus}</span></p>
                </div>

                <div className="w-full flex flex-col items-center justify-center bg-white shadow-lg rounded-2xl p-8">
                    <div className="flex flex-col items-center w-full mb-4">
                        <div className="w-full flex justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900">Basic plan</h2>
                                <p className="text-md text-gray-600">기억을 꾸미는 작은 변화, 일상의 특별함으로!</p>
                            </div>
                            <div className="text-4xl font-bold text-gray-900">
                                4,990
                                <span className="text-xl">/mo</span>
                            </div>
                        </div>
                        
                        <hr className="my-4 border-gay-300 w-full" />

                        <div className="w-full">
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Includes :</h3>
                            <ul className="list-inside space-y-2">
                                <li className="flex items-center">
                                    <img src="/check0.svg" alt="check" className="w-6 h-6 mr-2" />다양한 테마 스티커 잠금 해제
                                </li>
                                <li className="flex items-center">
                                    <img src="/check0.svg" alit="check" className="w-6 h-6 mr-2" />광고 없는 사용 환경
                                </li>
                            </ul>
                        </div>

                        <hr className="my-4 border-gray-300 w-full" />

                        <button
                            onClick={handleSubscription}
                            className="px-6 py-2 rounded-lg text-white transition hover:border-transparent border hover:scale-105 bg-[#6A0DAD] hover:bg-[#7A3C98]" style={{ backgroundColor: "rgba(116, 48, 183, 0.6)" }}
                        >
                            Get started
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SubscriptionPage;