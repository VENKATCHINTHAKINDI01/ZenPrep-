"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface ScoreChartProps {
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
}

// Shorten category names for radar chart labels
const shortNames: Record<string, string> = {
  "Communication Skills": "Communication",
  "Technical Knowledge": "Technical",
  "Problem Solving": "Problem Solving",
  "Cultural Fit": "Cultural Fit",
  "Confidence and Clarity": "Confidence",
  "Depth of Knowledge": "Depth",
};

const ScoreChart = ({ categoryScores }: ScoreChartProps) => {
  // Format data for recharts
  const data = categoryScores.map((cat) => ({
    category: shortNames[cat.name] || cat.name,
    score: cat.score,
    fullMark: 100,
  }));

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid
            stroke="#4B4D4F"
            strokeOpacity={0.5}
          />
          <PolarAngleAxis
            dataKey="category"
            tick={{
              fill: "#d6e0ff",
              fontSize: 11,
              fontWeight: 500,
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#27282f",
              border: "1px solid #4B4D4F",
              borderRadius: "8px",
              color: "#d6e0ff",
            }}
            formatter={(value: number) => [`${value}/100`, "Score"]}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#cac5fe"
            fill="#cac5fe"
            fillOpacity={0.25}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreChart;
