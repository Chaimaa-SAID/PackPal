import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import axios from "axios";

function DoughnutChartComponent() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    getStatistic();
  }, []);

  const getStatistic = async () => {
    try {
      const response = await axios.get("https://packpal-backend.vercel.app/statistics");
      const { userCount, productCount, orderCount, categoryCount } = response.data;
      const formattedData = [
        { name: "Users", value: userCount },
        { name: "Products", value: productCount },
        { name: "Orders", value: orderCount },
        { name: "Categories", value: categoryCount },
      ];
      setChartData(formattedData);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };
const COLORS = ["#0C2D57", "#d9a74a"];
  return (
    
    <ResponsiveContainer width="80%" height={400} style={{marginTop:'60px', marginLeft:'15px', background: '#ffffff', borderRadius: '12px'}}>
  <PieChart>
    <Pie
      data={chartData}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      innerRadius={70}
      outerRadius={120}
      fill="#8884d8"
      label
    >
      {chartData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip content={customTooltip} />
    <Legend />
  </PieChart>
</ResponsiveContainer>


  );
}

const customTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-[#0C2D57] flex flex-col gap-4 rounded-md">
        <p className="text-medium text-lg text-white">{payload[0].name}</p>
        <p className="text-sm text-white">
          Value: <span className="ml-2">{payload[0].value}</span>
        </p>
      </div>
    );
  }

  return null;
};

export default DoughnutChartComponent;
