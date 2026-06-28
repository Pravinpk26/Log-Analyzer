import {
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function SparklineChart({
  color,
}) {

  const data = [
    { value: 20 },
    { value: 24 },
    { value: 18 },
    { value: 27 },
    { value: 22 },
    { value: 31 },
    { value: 28 },
    { value: 34 },
    { value: 29 },
    { value: 36 },
  ];

  return (

    <div className="w-28 h-16">

      <ResponsiveContainer>

        <LineChart data={data}>

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