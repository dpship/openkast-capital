import { Area, AreaChart, ResponsiveContainer } from "recharts";

type Props = {
  data: number[];
  color?: string;
  height?: number;
};

export function Sparkline({ data, color = "var(--primary)", height = 44 }: Props) {
  const chartData = data.map((v, i) => ({ i, v }));
  const id = `spark-${Math.random().toString(36).slice(2)}`;
  return (
    <div style={{ height, width: "100%" }}>
      <ResponsiveContainer>
        <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#${id})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
