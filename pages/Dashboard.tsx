import React from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { Users, DollarSign, TrendingUp, Clock, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Dashboard = () => {
  const { leads, tasks, theme } = useCRM();

  // Metrics Logic
  const totalLeads = leads.length;
  const wonLeads = leads.filter(l => l.status === 'Closed Won').length;
  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : 0;
  const pipelineValue = leads.reduce((sum, lead) => 
    (lead.status !== 'Closed Lost' && lead.status !== 'Closed Won') ? sum + lead.potentialValue : sum, 0
  );
  
  // Charts Data
  const leadsByStatus = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.keys(leadsByStatus).map(status => ({
    name: status,
    value: leadsByStatus[status]
  }));

  const leadsBySource = leads.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sourceData = Object.keys(leadsBySource).map(source => ({
    name: source,
    value: leadsBySource[source]
  }));

  const MetricCard = ({ title, value, subtext, icon: Icon, colorClass, trend, trendUp }: any) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10 dark:bg-opacity-20`}>
          <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
        {trend && (
           <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
              {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {trend}
           </div>
        )}
      </div>
      <div>
         <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{value}</h3>
         <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{title}</p>
         <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{subtext}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
           <p className="text-slate-500 dark:text-slate-400 mt-1">Overview of your sales performance.</p>
        </div>
        <div className="flex items-center gap-3">
           <select className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Quarter</option>
              <option>This Year</option>
           </select>
           <button className="p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <RefreshCw size={18} />
           </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Leads" 
          value={totalLeads} 
          subtext="vs. 28 last week" 
          icon={Users} 
          colorClass="bg-blue-500" 
          trend="12%"
          trendUp={true}
        />
        <MetricCard 
          title="Pipeline Value" 
          value={`$${(pipelineValue / 1000).toFixed(1)}k`} 
          subtext="Weighted revenue" 
          icon={DollarSign} 
          colorClass="bg-green-500" 
          trend="5%"
          trendUp={true}
        />
        <MetricCard 
          title="Win Rate" 
          value={`${conversionRate}%`} 
          subtext="Closed won / Total" 
          icon={TrendingUp} 
          colorClass="bg-indigo-500" 
          trend="2%"
          trendUp={false}
        />
        <MetricCard 
          title="Open Tasks" 
          value={tasks.filter(t => t.status === 'Pending').length} 
          subtext="Urgent actions" 
          icon={Clock} 
          colorClass="bg-orange-500" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-800 dark:text-white">Pipeline Stages</h3>
             <button className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">View Report</button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} layout="vertical" margin={{ left: 0, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12, fill: theme === 'dark' ? '#94a3b8' : '#64748b'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                    color: theme === 'dark' ? '#fff' : '#000',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                  }}
                  cursor={{fill: theme === 'dark' ? '#334155' : '#f1f5f9'}}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Lead Sources</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Channel performance breakdown</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                    color: theme === 'dark' ? '#fff' : '#000',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {sourceData.slice(0, 4).map((entry, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;