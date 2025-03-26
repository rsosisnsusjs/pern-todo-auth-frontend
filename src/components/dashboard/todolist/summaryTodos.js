import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const SummaryPage = () => {
  const [summary, setSummary] = useState({
    totalTodos: 0,
    doneCount: 0,
    overdueCount: 0,
  });
  const [selectedRange, setSelectedRange] = useState("monthly");
  const [chartLimit, setChartLimit] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
        try {
            const res = await fetch(`http://localhost:5000/dashboard/summary?range=${selectedRange}`, {
                method: 'GET',
                headers: { jwt_token: localStorage.token },
            });

            if (res.ok) {
                const parseData = await res.json();
                console.log("Summary Data:", parseData);
                setSummary(parseData);
                
                if (parseData.totalTodos > chartLimit) {
                    let newLimit = chartLimit;
                    while (newLimit < parseData.totalTodos) {
                        newLimit *= 2;
                    }
                    setChartLimit(newLimit);
                }
            } else {
                console.error("Failed to fetch data");
            }
        } catch (err) {
            console.error("Error fetching summary:", err.message);
        }
    };

    fetchSummary();
}, [chartLimit, selectedRange]); 


  const chartData = [
    { name: "Total Todos", count: summary.totalTodos, color: "#007bff" },
    { name: "Overdue", count: summary.overdueCount, color: "#dc3545" },
    { name: "Done", count: summary.doneCount, color: "#28a745" },
  ];

  return (
    <div className="container mt-5">
      <button className="btn btn-secondary mb-3" onClick={() => navigate("/")}>Back</button>
      <h2 className="text-center">Summary of Todos</h2>

      {/* Dropdown for Selecting Date Range */}
      <div className="d-flex justify-content-center my-3">
        <select
          className="form-select w-25"
          value={selectedRange}
          onChange={(e) => setSelectedRange(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="six_months">Last 6 Months</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Summary Numbers */}
      <div className="d-flex justify-content-center">
        <h5 className="mx-3">📌 Total: <span className="text-primary">{summary.totalTodos}</span></h5>
        <h5 className="mx-3">⚠️ Overdue: <span className="text-danger">{summary.overdueCount}</span></h5>
        <h5 className="mx-3">✅ Done: <span className="text-success">{summary.doneCount}</span></h5>
      </div>

      {/* Bar Chart */}
      <div className="mt-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, chartLimit]} /> {/* กำหนดขอบเขต y-axis */}
            <Tooltip />
            <Bar dataKey="count" fill={(entry) => entry.color} barSize={60} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SummaryPage;
