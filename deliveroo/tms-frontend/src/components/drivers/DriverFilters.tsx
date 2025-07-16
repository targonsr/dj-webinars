import React from 'react';
import { Driver } from '../../model/drivers';
import { Search, Filter, User, X } from 'lucide-react';

interface DriverFiltersProps {
  searchTerm: string;
  statusFilter: 'all' | Driver['status'];
  contractTypeFilter: 'all' | Driver['contractType'];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: 'all' | Driver['status']) => void;
  onContractTypeChange: (value: 'all' | Driver['contractType']) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  resultCount: number;
}

export const DriverFilters: React.FC<DriverFiltersProps> = ({
  searchTerm,
  statusFilter,
  contractTypeFilter,
  onSearchChange,
  onStatusChange,
  onContractTypeChange,
  onClearFilters,
  hasActiveFilters,
  resultCount
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search drivers..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Status Filter */}
        <div className="relative">
          <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as any)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="on-route">On Route</option>
            <option value="resting">Resting</option>
            <option value="off-duty">Off Duty</option>
            <option value="sick-leave">Sick Leave</option>
          </select>
        </div>
        
        {/* Contract Type Filter */}
        <div className="relative">
          <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={contractTypeFilter}
            onChange={(e) => onContractTypeChange(e.target.value as any)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            <option value="all">All Contract Types</option>
            <option value="full-time">Full Time</option>
            <option value="contractor">Contractor</option>
          </select>
        </div>
        
        {/* Results Count and Clear */}
        <div className="md:col-span-2 flex items-center justify-between gap-4">
          <div className="text-sm text-gray-600 flex items-center">
            <span className="font-medium">{resultCount}</span>
            <span className="ml-1">drivers found</span>
          </div>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              title="Clear all filters"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};