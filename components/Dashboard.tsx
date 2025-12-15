import React from 'react';
import { Unit, Estate } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Building2, Users, IndianRupee, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  units: Unit[];
  estates: Estate[];
}

export const Dashboard: React.FC<DashboardProps> = ({ units, estates }) => {
  const totalUnits = units.length;
  const totalEmployees = units.reduce((acc, u) => acc + u.employeeCount, 0);
  const totalRentPending = units.filter(u => u.rentStatus === 'PENDING' || u.rentStatus === 'OVERDUE').length;
  const totalMonthlyRevenue = units.reduce((acc, u) => acc + u.monthlyRent, 0);

  // Chart Data Preparation
  const unitsByEstate = estates.map(estate => ({
    name: estate.name.replace(' Estate', ''),
    count: units.filter(u => u.estateId === estate.id).length
  }));

  const rentStatusData = [
    { name: 'Paid', value: units.filter(u => u.rentStatus === 'PAID').length },
    { name: 'Pending', value: units.filter(u => u.rentStatus === 'PENDING').length },
    { name: 'Overdue', value: units.filter(u => u.rentStatus === 'OVERDUE').length },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Units" 
          value={totalUnits} 
          icon={<Building2 className="text-blue-600" />} 
          bg="bg-blue-50" 
        />
        <StatCard 
          title="Total Employees" 
          value={totalEmployees} 
          icon={<Users className="text-purple-600" />} 
          bg="bg-purple-50" 
        />
        <StatCard 
          title="Monthly Revenue" 
          value={`₹${totalMonthlyRevenue.toLocaleString()}`} 
          icon={<IndianRupee className="text-emerald-600" />} 
          bg="bg-emerald-50" 
        />
         <StatCard 
          title="Rent Issues" 
          value={totalRentPending} 
          subtext="Pending or Overdue"
          icon={<AlertTriangle className="text-amber-600" />} 
          bg="bg-amber-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Units per Estate</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={unitsByEstate}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{fill: '#f1f5f9'}}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Rent Collection Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={rentStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {rentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Quick Actions Panel could go here */}
    </div>
  );
};

const StatCard = ({ title, value, icon, bg, subtext }: { title: string, value: string | number, icon: React.ReactNode, bg: string, subtext?: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h4 className="text-2xl font-bold text-slate-900 mt-1">{value}</h4>
      {subtext && <p className="text-xs text-amber-600 mt-1 font-medium">{subtext}</p>}
    </div>
    <div className={`p-3 rounded-lg ${bg}`}>
      {icon}
    </div>
  </div>
);
