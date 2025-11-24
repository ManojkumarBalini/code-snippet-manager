import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

const StatsCard = ({ title, value, icon, color, trend }) => {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl bg-gradient-to-r ${color} text-white`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${
            trend.isPositive 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
          }`}>
            {trend.isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
      
      <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
        {value}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 font-medium">
        {title}
      </p>
    </div>
  )
}

export default StatsCard