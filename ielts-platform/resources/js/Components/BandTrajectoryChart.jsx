import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend, ResponsiveContainer } from 'recharts';

const MODULE_COLORS = {
    band:      '#10B981',
    reading:   '#3B82F6',
    listening: '#8B5CF6',
    writing:   '#F59E0B',
    speaking:  '#EF4444',
};

export default function BandTrajectoryChart({ history, target }) {
    const hasModuleData = history.some(d => d.reading || d.listening || d.writing || d.speaking);

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Band Trajectory</h3>
            <ResponsiveContainer width="100%" height={220}>
                <LineChart data={history} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} label={{ value: 'Day', position: 'insideBottom', offset: -2, fontSize: 11 }} />
                    <YAxis domain={[4, 9]} ticks={[4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9]} tick={{ fontSize: 11 }} />
                    <Tooltip
                        formatter={(val, name) => [`Band ${val}`, name.charAt(0).toUpperCase() + name.slice(1)]}
                        labelFormatter={(l) => `Day ${l}`}
                    />
                    {hasModuleData && <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />}
                    <ReferenceLine y={target} stroke="#4F46E5" strokeDasharray="5 5" label={{ value: `Target ${target}`, fill: '#4F46E5', fontSize: 11 }} />
                    <Line type="monotone" dataKey="band" name="Overall" stroke={MODULE_COLORS.band} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    {hasModuleData && <>
                        <Line type="monotone" dataKey="reading"   name="Reading"   stroke={MODULE_COLORS.reading}   strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                        <Line type="monotone" dataKey="listening" name="Listening" stroke={MODULE_COLORS.listening} strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                        <Line type="monotone" dataKey="writing"   name="Writing"   stroke={MODULE_COLORS.writing}   strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                        <Line type="monotone" dataKey="speaking"  name="Speaking"  stroke={MODULE_COLORS.speaking}  strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                    </>}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
