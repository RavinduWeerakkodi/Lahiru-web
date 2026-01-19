
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { cleanupOldData } from "@/lib/tracking";
import { collection, onSnapshot, query, getDocs, orderBy, limit } from "firebase/firestore";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#fbbf24', '#f472b6', '#a78bfa', '#38bdf8', '#34d399', '#fb7185', '#818cf8'];

function StatCard({ title, count, color, valueSize = "text-3xl", textColor }) {
    return (
        <div className="p-6 rounded-xl bg-brand-surface/80 backdrop-blur-md border border-white/5 shadow-sm">
            <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">{title}</h3>
            <p
                className={`${valueSize} font-bold ${color ? color : ''} truncate`}
                style={textColor ? { color: textColor } : {}}
            >
                {count}
            </p>
        </div>
    );
}

export default function Dashboard() {
    const [stats, setStats] = useState({
        serviceCounts: {},
        inquiries: "-",
        topLanguage: "-",
        topSource: "-"
    });
    const [recentInquiries, setRecentInquiries] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [services, setServices] = useState([]);

    // Visitor Stats State
    const [visitorStats, setVisitorStats] = useState([]);
    const [deviceStats, setDeviceStats] = useState([]);
    const [countryStats, setCountryStats] = useState([]);

    // 1. Fetch Services & Cleanup Old Data
    useEffect(() => {
        cleanupOldData(); // Run cleanup on dashboard load

        const fetchServices = async () => {
            try {
                const q = query(collection(db, "service_cards"), orderBy("order", "asc"));
                const snap = await getDocs(q);
                const data = snap.docs.map(doc => ({
                    id: doc.id,
                    title: doc.data().en?.title || doc.id,
                    ...doc.data()
                }));
                setServices(data);
            } catch (err) {
                console.error("Error fetching services:", err);
            }
        };
        fetchServices();
    }, []);

    // 2. Real-time Visitor Stats (Last 14 Days)
    useEffect(() => {
        const q = query(collection(db, "daily_stats"), orderBy("date", "desc"), limit(14));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = [];
            let devices = {};
            let countries = {};

            snapshot.forEach(doc => {
                const d = doc.data();
                data.unshift({
                    date: d.date.slice(5), // MM-DD
                    fullDate: d.date,
                    visitors: d.visitors || 0
                });

                if (d.devices) {
                    Object.entries(d.devices).forEach(([k, v]) => devices[k] = (devices[k] || 0) + v);
                }
                if (d.countries) {
                    Object.entries(d.countries).forEach(([k, v]) => countries[k] = (countries[k] || 0) + v);
                }
            });

            setVisitorStats(data);
            setDeviceStats(Object.entries(devices).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value })));
            setCountryStats(Object.entries(countries).map(([name, value]) => ({ name, value })));
        }, (error) => {
            console.error("Error listening to daily_stats:", error);
        });
        return () => unsubscribe();
    }, []);

    // 3. Real-time Inquiries & Analytics
    useEffect(() => {
        // Even if no services fetched yet, we can show general stats, but logic depends on services for breakdown
        // if (services.length === 0) return; 

        const q = query(collection(db, "inquiries"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            let total = 0;
            const langCounts = { en: 0, si: 0, ta: 0 };
            const sourceCounts = {};
            const allInquiries = [];
            const dynamicServiceCounts = {};

            // Initialize service counts
            services.forEach(s => dynamicServiceCounts[s.title] = 0);

            // Initialize Last 7 Days structure
            const today = new Date();
            const last7Days = {};
            for (let i = 6; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                last7Days[dateStr] = {
                    date: dateStr,
                    shortDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    total: 0,
                    ...dynamicServiceCounts
                };
            }

            snapshot.forEach(doc => {
                const data = doc.data();
                const id = doc.id;
                total++;

                // Service Count
                const type = data.service?.type || "General";
                if (dynamicServiceCounts[type] !== undefined) {
                    dynamicServiceCounts[type]++;
                }

                // Chart Aggregation
                if (data.createdAt?.toDate) {
                    const date = data.createdAt.toDate().toISOString().split('T')[0];
                    if (last7Days[date]) {
                        last7Days[date].total++;
                        if (last7Days[date][type] !== undefined) {
                            last7Days[date][type]++;
                        }
                    }
                }

                // Language Stats
                const lang = data.customer?.language || "en";
                if (langCounts[lang] !== undefined) langCounts[lang]++;
                else langCounts[lang] = 1;

                // Source Traffic
                let referrer = data.source?.referrer || "Direct";
                try {
                    if (referrer !== "Direct" && referrer.startsWith("http")) {
                        const url = new URL(referrer);
                        referrer = url.hostname.replace("www.", "");
                    }
                } catch (e) { }

                if (!referrer || referrer === "Direct") {
                    referrer = "Direct / " + (data.source?.page || "Unknown");
                }
                sourceCounts[referrer] = (sourceCounts[referrer] || 0) + 1;

                allInquiries.push({ id, ...data });
            });

            // Set Chart Data
            setChartData(Object.values(last7Days));

            // Top Language
            const topLang = Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0];
            const topLangLabel = topLang ? `${topLang[0].toUpperCase()} (${Math.round((topLang[1] / total) * 100)}%)` : "-";

            // Top Source
            const topSrc = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])[0];
            const topSrcLabel = topSrc ? `${topSrc[0]}` : "-";

            setStats({
                serviceCounts: dynamicServiceCounts,
                inquiries: total,
                topLanguage: total > 0 ? topLangLabel : "-",
                topSource: total > 0 ? topSrcLabel : "-"
            });

            // Recent Inquiries
            allInquiries.sort((a, b) => {
                const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
                const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
                return tB - tA;
            });
            setRecentInquiries(allInquiries.slice(0, 5));

        }, (error) => {
            console.error("Error listening to dashboard stats:", error);
        });

        return () => unsubscribe();
    }, [services]);

    return (
        <div>
            {/* Custom Styles for Recharts Tooltip */}
            <style>{`
                .recharts-tooltip-cursor { stroke: rgba(255, 255, 255, 0.1) !important; }
                .recharts-default-tooltip { background-color: #1a1a1a !important; border-color: #333 !important; }
            `}</style>

            <div className="mb-10">
                <h1 className="text-3xl font-bold text-brand-text tracking-tight">Dashboard Overview</h1>
                <p className="text-brand-muted mt-1">Real-time platform activity and visitor analytics.</p>
            </div>

            {/* Inquiries & Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {services.slice(0, 3).map((service, idx) => (
                    <StatCard
                        key={service.id}
                        title={`${service.title} Inquiries`}
                        count={stats.serviceCounts[service.title] || 0}
                        textColor={COLORS[idx % COLORS.length]}
                    />
                ))}
                <StatCard title="Total WhatsApp Clicks" count={stats.inquiries} textColor="#fbbf24" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <StatCard title="Top Language" count={stats.topLanguage} textColor="#38bdf8" valueSize="text-2xl" />
                <StatCard title="Top Source" count={stats.topSource} textColor="#34d399" valueSize="text-xl" />
            </div>

            {/* VISITOR ANALYTICS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="p-6 rounded-2xl bg-brand-surface/80 backdrop-blur-md border border-white/5 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-brand-text">Daily Visitors (14 Days)</h2>
                        <span className="text-xs text-brand-muted bg-white/5 px-2 py-1 rounded">Unique Visits</span>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={visitorStats}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff' }} cursor={{ stroke: 'rgba(255,255,255,0.05)' }} />
                                <Line type="monotone" dataKey="visitors" stroke="#34d399" strokeWidth={3} dot={{ r: 4, fill: '#34d399' }} activeDot={{ r: 6 }} name="Unique Visitors" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-brand-surface/80 backdrop-blur-md border border-white/5 shadow-xl flex flex-col">
                    <h2 className="text-xl font-semibold mb-6 text-brand-text">Audience Breakdown</h2>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="h-[250px] relative">
                            <h3 className="text-sm font-bold text-center text-brand-muted mb-2">Device</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={deviceStats} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {deviceStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                            {deviceStats.length === 0 && <div className="absolute inset-0 flex items-center justify-center text-xs text-brand-muted">Waiting for data...</div>}
                        </div>

                        <div className="h-[250px] relative">
                            <h3 className="text-sm font-bold text-center text-brand-muted mb-2">Country</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={countryStats} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {countryStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                            {countryStats.length === 0 && <div className="absolute inset-0 flex items-center justify-center text-xs text-brand-muted">Waiting for data...</div>}
                        </div>
                    </div>
                </div>
            </div>

            {/* INQUIRY TRENDS */}
            <div className="mb-8 p-6 rounded-2xl bg-brand-surface/80 backdrop-blur-md border border-white/5 shadow-xl">
                <h2 className="text-xl font-semibold mb-6 text-brand-text">WhatsApp Clicks (7 Days)</h2>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis dataKey="shortDate" stroke="#888" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#ccc' }} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Line type="monotone" dataKey="total" stroke="#fbbf24" strokeWidth={3} dot={{ r: 4, fill: '#fbbf24' }} name="Total Inquiries" activeDot={{ r: 6 }} />
                            {services.map((service, idx) => (
                                <Line
                                    key={service.id}
                                    type="monotone"
                                    dataKey={service.title}
                                    stroke={COLORS[idx % COLORS.length]}
                                    strokeWidth={2}
                                    dot={false}
                                    name={service.title}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 p-6 rounded-2xl bg-brand-surface/80 backdrop-blur-md border border-white/5 shadow-xl">
                    <h2 className="text-xl font-semibold mb-4 text-brand-text">Recent WhatsApp Clicks</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-brand-muted text-xs uppercase tracking-wider border-b border-white/10">
                                    <th className="pb-3 pl-2">Source</th>
                                    <th className="pb-3">Lang</th>
                                    <th className="pb-3">Device</th>
                                    <th className="pb-3 text-right pr-2">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {recentInquiries.length === 0 ? (
                                    <tr><td colSpan="4" className="py-4 text-center text-brand-muted">No data available.</td></tr>
                                ) : (
                                    recentInquiries.map((inq, i) => (
                                        <tr key={inq.id || i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                            <td className="py-3 pl-2 text-brand-text font-medium">{inq.source?.page}</td>
                                            <td className="py-3 text-brand-muted uppercase">{inq.customer?.language}</td>
                                            <td className="py-3 text-brand-muted capitalize">{inq.source?.device}</td>
                                            <td className="py-3 text-right pr-2">
                                                <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded">Clicked</span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-brand-surface/80 backdrop-blur-md border border-white/5 shadow-xl">
                    <h2 className="text-xl font-semibold mb-4 text-brand-text">Insights</h2>
                    <div className="p-4 bg-brand-bg/50 rounded-xl border border-white/5">
                        <p className="text-sm text-brand-muted mb-2">💡 <strong>Tip:</strong></p>
                        <p className="text-xs text-brand-text/80 leading-relaxed">
                            Data updates in real-time. Visitor counts are unique per day/device.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
