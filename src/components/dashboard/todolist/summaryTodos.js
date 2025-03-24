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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("http://localhost:5000/dashboard/summary", {
          method: 'GET',
          headers: {
            jwt_token: localStorage.token,
          },
        });

        // ตรวจสอบว่า response มีค่าหรือไม่
        if (res.ok) {
          const parseData = await res.json();
          console.log("Summary Data:", parseData);  // ตรวจสอบค่าที่ได้รับจาก API
          setSummary(parseData); // ตั้งค่าข้อมูลจาก API
        } else {
          console.error("Failed to fetch data");
        }
      } catch (err) {
        console.error("Error fetching summary:", err.message);
      }
    };

    fetchSummary();
  }, []);

  // ตรวจสอบค่าที่ได้รับจาก API เพื่อแสดงกราฟ
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
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill={(entry) => entry.color} barSize={60} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SummaryPage;
