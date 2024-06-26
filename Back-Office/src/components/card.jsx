import React, { useState, useEffect } from "react";
import axios from "axios";

function Card() {
  const [statistics, setStatistics] = useState({
    userCount: 0,
    categoryCount: 0,
    productCount: 0,
    orderCount: 0
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("https://packpal-backend.vercel.app/statistics");
        setStatistics(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  const cards = [
    { name: "User", number: statistics.userCount },
    { name: "Categories", number: statistics.categoryCount },
    { name: "Product", number: statistics.productCount },
    { name: "Orders", number: statistics.orderCount }
  ];

  return (
    <div className="flex" style={{background: '#ffffff', borderRadius: '12px', paddingLeft:'20px', paddingRight:'20px', paddingTop:'20px', paddingBottom:'70px'}}>
      <main className="w-full">
        <div className="flex flex-wrap px-5 mt-9">
          {cards.map((card, index) => (
            <div
              className="w-full max-w-full px-3 mt-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4"
              key={index}
            >
              <div className="bg-[#0C2D57] shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl">
                <div className="p-6">
                  <p className="text-sm font-semibold text-white uppercase mb-2">
                    {card.name}
                  </p>
                  <p className="text-2xl font-bold text-[#d9a74a]">
                    {card.number}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Card;
