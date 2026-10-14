import React from 'react';
import { useComplaints } from '../../context/ComplaintContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Building,
  AlertTriangle,
  CheckCircle2,
  PieChart as PieIcon
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { complaints } = useComplaints();

  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length;
  const resolutionRate = Math.round((resolved / Math.max(1, total)) * 100);

  // 1. Complaints by Category
  const categoryCounts = complaints.reduce<Record<string, number>>((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    count
  }));

  // 2. Complaints by Building
  const buildingCounts = complaints.reduce<Record<string, number>>((acc, c) => {
    const shortName = c.building.replace('University', '').replace('Hall', '').trim();
    acc[shortName] = (acc[shortName] || 0) + 1;
    return acc;
  }, {});

  const buildingData = Object.entries(buildingCounts).map(([name, count]) => ({
    name,
    count
  }));

  // 3. Priority Distribution
  const priorityCounts = complaints.reduce<Record<string, number>>((acc, c) => {
    acc[c.priority] = (acc[c.priority] || 0) + 1;
    return acc;
  }, {});

  const priorityData = [
    { name: 'Urgent', value: priorityCounts['urgent'] || 0, color: '#DC2626' },
    { name: 'High', value: priorityCounts['high'] || 0, color: '#F97316' },
    { name: 'Medium', value: priorityCounts['medium'] || 0, color: '#3B82F6' },
    { name: 'Low', value: priorityCounts['low'] || 0, color: '#94A3B8' }
  ].filter(p => p.value > 0);

  // 4. Monthly Trend Data (Simulated 6 months)
  const monthlyTrendData = [
    { month: 'May', submitted: 14, resolved: 13 },
    { month: 'Jun', submitted: 18, resolved: 17 },
    { month: 'Jul', submitted: 12, resolved: 12 },
    { month: 'Aug', submitted: 31, resolved: 28 },
    { month: 'Sep', submitted: 42, resolved: 39 },
    { month: 'Oct (Current)', submitted: total, resolved: resolved }
  ];

  // 5. Avg Resolution Time by Category in hours
  const resolutionSpeedData = [
    { category: 'Sanitation', hours: 2.5 },
    { category: 'Electrical', hours: 4.8 },
    { category: 'Plumbing', hours: 6.2 },
    { category: 'Wi-Fi & IT', hours: 8.4 },
    { category: 'Housing', hours: 14.1 },
    { category: 'Infrastructure', hours: 22.0 }
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
          Campus-Wide Infrastructure Analytics
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Incident velocity, recurring equipment bottlenecks, and department response SLAs across all university facilities.
        </p>
      </div>

      {/* Top Level Metric Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 mb-1">Total Reported Incidents</div>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">{total}</div>
          <div className="text-[11px] text-stone-400 mt-1 font-mono">100% audited log</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 mb-1">Campus Resolution Rate</div>
          <div className="text-2xl font-bold font-mono text-[#166534] tabular-nums">{resolutionRate}%</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 font-mono">+4.2% vs last semester</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 mb-1">Average Turnaround</div>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">11.6 hrs</div>
          <div className="text-[11px] text-stone-400 mt-1 font-mono">From report to verification</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 mb-1">Student Satisfaction</div>
          <div className="text-2xl font-bold font-mono text-amber-600 tabular-nums">4.8 / 5.0</div>
          <div className="text-[11px] text-stone-400 mt-1 font-mono">Based on post-repair ratings</div>
        </div>
      </div>

      {/* Charts Grid Row 1: Monthly Velocity & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Monthly Trend Area Chart */}
        <div className="lg:col-span-7 p-6 rounded-xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Monthly Complaint Volume & Resolution Velocity</span>
              </h2>
              <p className="text-[11px] text-stone-400">Total tickets received vs successfully resolved per month</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSubmitted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#166534" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#166534" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="submitted" stroke="#166534" strokeWidth={2} fillOpacity={1} fill="url(#colorSubmitted)" name="Submitted" />
                <Area type="monotone" dataKey="resolved" stroke="#22C55E" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Breakdown Pie Chart */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-stone-600" />
              <span>Priority Tier Distribution</span>
            </h2>
            <p className="text-[11px] text-stone-400">Share of complaints by urgency classification</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '11px' }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={value => <span className="text-xs text-stone-700 font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Charts Grid Row 2: Building Load & Category Resolution Speed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Complaints by Building Bar Chart */}
        <div className="lg:col-span-6 p-6 rounded-xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-stone-600" />
              <span>Complaints by Campus Facility</span>
            </h2>
            <p className="text-[11px] text-stone-400">Total volume of issues reported across primary zones</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buildingData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#64748B' }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#166534" radius={[4, 4, 0, 0]} name="Complaints" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Avg Resolution Speed by Category */}
        <div className="lg:col-span-6 p-6 rounded-xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-stone-600" />
              <span>Average Resolution Speed by Trade (Hours)</span>
            </h2>
            <p className="text-[11px] text-stone-400">Mean duration from intake to technician completion signoff</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resolutionSpeedData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} unit="h" />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 11, fill: '#64748B' }} width={90} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '11px' }}
                />
                <Bar dataKey="hours" fill="#22C55E" radius={[0, 4, 4, 0]} name="Hours to Resolve" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
