import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';

export default function BandTrajectoryChart({ history, target }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Band Trajectory</h3>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={history} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} label={{ value: 'Day', position: 'insideBottom', offset: -2, fontSize: 11 }} />
                    <YAxis domain={[4, 9]} ticks={[4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9]} tick={{ fontSize: 11 }} />
                    <Tooltip
                        formatter={(val) => [`Band ${val}`, 'Score']}
                        labelFormatter={(l) => `Day ${l}`}
                    />
                    <ReferenceLine y={target} stroke="#4F46E5" strokeDasharray="5 5" label={{ value: `Target ${target}`, fill: '#4F46E5', fontSize: 11 }} />
                    <Line type="monotone" dataKey="band" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
