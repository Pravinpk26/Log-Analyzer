/**
 * SparklineChart.jsx
 * Renders a small sparkline using real data points.
 * Accepts a `data` prop (array of numbers) from TopCards.
 * Falls back to flat line if no data provided.
 */

import { ResponsiveContainer, LineChart, Line } from "recharts";

export default function SparklineChart({ color, data }) {
  // Convert array of numbers to recharts format
  const chartData = (data && data.length > 0)
    ? data.map((v) => ({ value: v }))
    : [{ value: 0 }, { value: 0 }, { value: 0 }];

  return (
    <div className="w-28 h-16">
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={3}
            dot={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
