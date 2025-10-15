"use client"

import { useEffect, useState } from "react";

export default function GameHistory({user , setDisableGame}) {
const [games,setGames] = useState([]);
  useEffect(()=>{
    const getHistoryGames=async()=>{
      const res = await fetch(`/api/game-data/${user._id}`);
      const data = await res.json();
      setGames(data.games);
      if (data.games.length >= 3) {
        setDisableGame(true);
      }
     
    }
    getHistoryGames();
  },[])

  return (
<div className="mt-8">
  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
    تاریخچه بازی‌های انجام‌شده
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {games.map((game,index) => (
      <div
        key={game._id}
        className="bg-[#f9fafb] rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-5 flex flex-col justify-between text-center"
      >
         <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {index === 0 ? "بازی اول" : index === 1 ? "بازی دوم" : index === 2 ? "بازی سوم" : null}
          </h3>
          {/* <p className="text-gray-600 mb-1">تاریخ: {game.date}</p>
          <p
            className={`font-bold ${
              game.result === "برد"
                ? "text-green-600"
                : game.result === "باخت"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            نتیجه: {game.result}
          </p> */}
        </div> 
        <div className="mt-3 text-sm text-gray-700 font-medium">
          امتیاز شما: {game._id}
        </div>
      </div>
    ))}
  </div>

  <p className="text-center text-gray mt-6 text-sm">
    حداکثر سه بازی می توانید انجام دهید.
  </p>
</div>

  );
}
