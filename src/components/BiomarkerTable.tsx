import React, { useState, useMemo } from 'react';
import { Search, Filter, HelpCircle, ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import { Biomarker, MarkerCategory, MarkerStatus } from '../types/report.ts';
import { FunctionalRangeBadge } from './FunctionalRangeBadge.tsx';

interface BiomarkerTableProps {
  biomarkers: Biomarker[];
}

export const BiomarkerTable: React.FC<BiomarkerTableProps> = ({ biomarkers }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [onlyAbnormal, setOnlyAbnormal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    biomarkers.forEach((b) => set.add(b.category));
    return ['All', ...Array.from(set)];
  }, [biomarkers]);

  const filteredBiomarkers = useMemo(() => {
    return biomarkers.filter((b) => {
      const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
      
      const isAbnormal = b.status !== 'optimal' && b.status !== 'normal';
      const matchesAbnormal = !onlyAbnormal || isAbnormal;

      return matchesSearch && matchesCategory && matchesAbnormal;
    });
  }, [biomarkers, searchQuery, selectedCategory, onlyAbnormal]);

  const getStatusBadge = (status: MarkerStatus) => {
    switch (status) {
      case 'optimal':
      case 'normal':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Normal
          </span>
        );
      case 'borderline_high':
      case 'borderline_low':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> Borderline
          </span>
        );
      case 'high':
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            <AlertTriangle className="w-3 h-3 text-orange-600" /> Out of Range
          </span>
        );
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
            <XCircle className="w-3 h-3 text-rose-600" /> Critical Flag
          </span>
        );
      default:
        return null;
    }
  };

  const renderVisualRange = (marker: Biomarker) => {
    if (marker.numericValue === undefined || marker.refMin === undefined || marker.refMax === undefined) {
      return <span className="text-xs text-slate-400 italic">Reference: {marker.refRangeString}</span>;
    }

    const val = marker.numericValue;
    const min = marker.refMin;
    const max = marker.refMax;
    
    // Position percentage between 0% and 100%
    const span = (max - min) * 1.5 || 1;
    const lowerBound = Math.max(0, min - (max - min) * 0.25);
    const upperBound = max + (max - min) * 0.25;
    
    let positionPct = ((val - lowerBound) / (upperBound - lowerBound)) * 100;
    positionPct = Math.max(5, Math.min(95, positionPct));

    const isNormal = val >= min && val <= max;

    return (
      <div className="w-full max-w-xs space-y-1">
        <div className="relative h-2 rounded-full bg-slate-200 overflow-hidden flex">
          {/* Low zone */}
          <div className="w-1/4 bg-amber-200" />
          {/* Normal zone */}
          <div className="w-1/2 bg-emerald-300" />
          {/* High zone */}
          <div className="w-1/4 bg-rose-200" />
        </div>
        
        {/* Pointer Pin */}
        <div className="relative h-3 w-full">
          <div
            style={{ left: `${positionPct}%` }}
            className={`absolute top-0 -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 border-white shadow-xs ${
              isNormal ? 'bg-emerald-600' : 'bg-rose-600 ring-2 ring-rose-200'
            }`}
          />
        </div>

        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>Min: {min}</span>
          <span>Max: {max}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-5">
      {/* Title & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-['Outfit'] text-slate-900">
            Biomarker Matrix & Range Analysis
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Showing {filteredBiomarkers.length} of {biomarkers.length} extracted clinical markers
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search biomarker..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
            />
          </div>

          {/* Filter Abnormal Only */}
          <button
            onClick={() => setOnlyAbnormal(!onlyAbnormal)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              onlyAbnormal
                ? 'bg-rose-50 text-rose-700 border-rose-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {onlyAbnormal ? 'Showing Out-of-Range' : 'Filter Abnormal'}
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-teal-700 text-white shadow-xs font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Biomarker List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Biomarker / Category</th>
              <th className="py-3 px-4">Result Value</th>
              <th className="py-3 px-4">Standard Range</th>
              <th className="py-3 px-4 hidden md:table-cell">Visual Range Scale</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBiomarkers.map((marker) => {
              const isExpanded = expandedId === marker.id;
              const isAbnormal = marker.status !== 'optimal' && marker.status !== 'normal';

              return (
                <React.Fragment key={marker.id}>
                  <tr
                    onClick={() => setExpandedId(isExpanded ? null : marker.id)}
                    className={`cursor-pointer transition-colors ${
                      isAbnormal ? 'bg-amber-50/20 hover:bg-amber-50/40' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{marker.name}</span>
                        {marker.clinicalSignificance && (
                          <span className="text-slate-400 hover:text-teal-600">
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-normal">{marker.category}</span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                      <span className={isAbnormal ? 'text-rose-600' : 'text-emerald-700'}>
                        {marker.value}
                      </span>{' '}
                      <span className="text-[11px] font-normal text-slate-500">{marker.unit}</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-mono">
                      {marker.refRangeString}
                    </td>

                    <td className="py-3.5 px-4 hidden md:table-cell">
                      {renderVisualRange(marker)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {getStatusBadge(marker.status)}
                    </td>
                  </tr>

                  {/* Expanded Insight Accordion */}
                  {isExpanded && (
                    <tr className="bg-slate-50/80">
                      <td colSpan={5} className="py-3 px-6 text-xs text-slate-700 border-l-4 border-teal-500 space-y-2">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">Clinical Significance & Context:</p>
                            <p className="text-slate-600 mt-0.5 leading-relaxed">{marker.clinicalSignificance || 'Standard clinical laboratory biomarker.'}</p>
                            {marker.interpretation && (
                              <p className="text-[11px] font-medium text-teal-800 mt-1">
                                Laboratory Finding: <span className="font-bold">{marker.interpretation}</span>
                              </p>
                            )}
                            <FunctionalRangeBadge biomarker={marker} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>

        {filteredBiomarkers.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-xs">
            No biomarkers match your current search or category filter.
          </div>
        )}
      </div>
    </div>
  );
};
