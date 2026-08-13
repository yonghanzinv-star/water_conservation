import React from 'react';
import type { Corporation, Partnership } from './types';
import { X, Building2, Globe, MapPin, AreaChart, ShoppingBag, Info, Leaf } from 'lucide-react';

interface CorporationDetailModalProps {
    corporation: Corporation | null;
    partnerships: Partnership[];
    getFarmerName: (id: string) => string;
    onClose: () => void;
}

const CorporationDetailModal: React.FC<CorporationDetailModalProps> = ({ corporation, partnerships, getFarmerName, onClose }) => {
    // ESC key close support
    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!corporation) return null;

    // Support both automated partnerships and manual purchase records
    const hasManualRecords = corporation.manualRecords && corporation.manualRecords.length > 0;
    const hasPartnerships = partnerships.length > 0;

    const partnershipsByYear = partnerships.reduce((acc, p) => {
        const year = p.adoptionYear;
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(p);
        return acc;
    }, {} as Record<number, Partnership[]>);

    const sortedPartnershipYears = Object.keys(partnershipsByYear).map(Number).sort((a, b) => b - a);
    const sortedManualYears = corporation.manualRecords ? [...corporation.manualRecords].sort((a, b) => b.year - a.year) : [];

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4 sm:p-6" onClick={onClose}>
            <div 
                className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col transform animate-fade-in-up overflow-hidden border border-slate-200" 
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Section */}
                <div className="p-6 border-b border-slate-100 relative bg-white sticky top-0 z-10 flex items-start justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border border-slate-100 shadow-sm flex items-center justify-center bg-slate-50 overflow-hidden shrink-0">
                            {corporation.logoUrl ? (
                                <img 
                                    src={corporation.logoUrl} 
                                    alt={corporation.name} 
                                    className="w-[90%] h-[90%] object-contain" 
                                />
                            ) : (
                                <span className="text-sm font-bold text-slate-400 p-2 text-center leading-tight">
                                    {corporation.name.length > 4 ? corporation.name.substring(0, 4) : corporation.name}
                                </span>
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">{corporation.name}</h2>
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className="px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-100 rounded text-xs font-semibold">
                                    {corporation.industry}
                                </span>
                                {corporation.esgFocus.map((focus, idx) => (
                                    <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                                        #{focus}
                                    </span>
                                ))}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs font-medium text-slate-500">
                                <span className="flex items-center gap-1"><MapPin size={14} className="text-sky-600" />{corporation.city} {corporation.district}</span>
                                {corporation.website !== '#' && (
                                    <a href={corporation.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-sky-600 transition-colors">
                                        <Globe size={14} className="text-sky-600" />官方網站
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 sm:p-8 overflow-y-auto wc-no-scrollbar bg-slate-50/50">
                    <div className="max-w-2xl mx-auto">
                        <section>
                            <h3 className="text-sm font-bold text-slate-700 mb-5 flex items-center gap-2 border-b border-slate-200 pb-2">
                                <ShoppingBag size={16} className="text-sky-600" /> 水源保育支持行為
                            </h3>

                            <div className="space-y-6">
                                {/* Manual Records */}
                                {hasManualRecords && sortedManualYears.map((record, idx) => (
                                    <div key={idx} className="relative pl-6">
                                        <div className="absolute left-1.5 top-1.5 bottom-0 w-0.5 bg-slate-200"></div>
                                        <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-sky-500 border-2 border-white shadow-sm"></div>
                                        
                                        <h4 className="text-sm font-bold text-slate-800 mb-2">
                                            民國 {record.year} 年
                                        </h4>
                                        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-md shrink-0">
                                                <Leaf size={16} />
                                            </div>
                                            <p className="text-slate-600 text-sm leading-relaxed">{record.detail}</p>
                                        </div>
                                    </div>
                                ))}

                                {/* Existing Partnerships */}
                                {hasPartnerships && sortedPartnershipYears.map(year => (
                                    <div key={year} className="relative pl-6">
                                        <div className="absolute left-1.5 top-1.5 bottom-0 w-0.5 bg-slate-200"></div>
                                        <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-sky-500 border-2 border-white shadow-sm"></div>
                                        
                                        <h4 className="text-sm font-bold text-slate-800 mb-2">
                                            {year} 年 (契作認養)
                                        </h4>
                                        <ul className="space-y-2">
                                            {partnershipsByYear[year].map(p => (
                                                <li key={p.id} className="bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-sm flex justify-between items-center">
                                                    <span className="font-medium text-sm text-slate-700">認養 {getFarmerName(p.farmerId)}</span>
                                                    <span className="px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-100 text-xs font-semibold rounded flex items-center gap-1">
                                                        <AreaChart size={12} />
                                                        {p.adoptedArea} 公頃
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}

                                {!hasManualRecords && !hasPartnerships && (
                                    <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                                        <Info className="mx-auto w-8 h-8 text-slate-300 mb-2" />
                                        <p className="text-slate-500 text-sm">目前尚無公開的合作細節</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="px-6 py-4 bg-white border-t border-slate-100 flex justify-end sticky bottom-0 z-10">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-800 text-white text-sm font-medium rounded-md shadow-sm hover:bg-slate-700 transition-colors"
                    >
                        關閉
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CorporationDetailModal;
