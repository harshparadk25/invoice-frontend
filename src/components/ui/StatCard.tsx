import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  delay?: number;
}

const bgMap = {
  blue: 'bg-indigo-50',
  green: 'bg-emerald-50',
  purple: 'bg-purple-50',
  orange: 'bg-orange-50',
  red: 'bg-red-50',
};

const iconColorMap = {
  blue: 'text-indigo-600',
  green: 'text-emerald-600',
  purple: 'text-purple-600',
  orange: 'text-orange-600',
  red: 'text-red-600',
};

export default function StatCard({ title, value, icon, trend, trendUp, color = 'blue', delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="bg-white rounded-xl p-5 border border-dark-200/60 hover:border-dark-300/60 hover:shadow-sm transition-all"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[13px] text-dark-400 font-medium truncate">{title}</p>
          <p className="text-[26px] font-bold mt-1 text-dark-900 tabular-nums leading-tight">{value}</p>
          {trend && (
            <p className={`text-xs mt-1.5 font-medium ${trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${bgMap[color]} shrink-0`}>
          <div className={`${iconColorMap[color]}`}>{icon}</div>
        </div>
      </div>
    </motion.div>
  );
}
