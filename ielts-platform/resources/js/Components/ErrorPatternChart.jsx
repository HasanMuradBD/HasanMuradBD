import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#EF4444','#F97316','#F59E0B','#EAB308','#84CC16','#22C55E','#14B8A6','#06B6D4','#6366F1','#8B5CF6'];

export default function ErrorPatternChart({ patterns }) {
    if (!patterns || patterns.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="text-sm font-semibold text-gray-700 mb-2">Error Patterns</h2>
                <p className="text-sm text-gray-400 text-center py-8">No error data yet. Error tags appear after practice tests are reviewed.</p>
            </div>
        );
    }

    const data = patterns.map(p => ({ ...p, label: p.tag.replace(/_/g, ' ') }));
    const max = Math.max(...data.map(d => d.count));

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Error Patterns — Last 30 Days</h2>
            <ResponsiveContainer width="100%" height={Math.max(180, data.length * 32)}>
                <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} domain={[0, max + 1]} />
                    <YAxis type="category" dataKey="label" width={140} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => [`${v} errors`, 'Count']} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
