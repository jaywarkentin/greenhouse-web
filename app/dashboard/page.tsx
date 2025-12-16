"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const [readings, setReadings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
  fetchReadings();

  const id = setInterval(fetchReadings, 10000); // every 10 seconds
  return () => clearInterval(id);
}, []);
  
  async function fetchReadings() {
    const {
  data: { session },
} = await supabase.auth.getSession();

if (!session) {
  window.location.href = "/login";
  return;
}
    const { data, error } = await supabase
      .from("readings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
      console.log("Supabase data:", data);
      console.log("Supabase error:", error);
    if (!error && data) {
      setReadings(data.reverse());
    }
  }

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-6">
        🌱 Greenhouse Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Stat label="Temperature (°F)" value={latest("temperature_f")} />
        <Stat label="Humidity (%)" value={latest("humidity")} />
        <Stat label="Pressure (hPa)" value={latest("pressure_hpa")} />
      </div>

      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">Temperature Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={readings}>
            <XAxis dataKey="created_at" hide />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="temperature_f"
              stroke="#16a34a"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  function latest(key: string) {
    return readings.length
      ? readings[readings.length - 1][key]?.toFixed(2)
      : "--";
  }
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow text-center">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold text-green-700">{value}</p>
    </div>
  );
}
