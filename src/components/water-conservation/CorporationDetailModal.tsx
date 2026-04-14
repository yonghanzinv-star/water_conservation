import React from 'react';
import type { Corporation, Partnership } from './types';
import { X, Building2, Globe, MapPin, Calendar, AreaChart, ShoppingBag, Info, Leaf } from 'lucide-react';

interface CorporationDetailModalProps {
    corporation: Corporation | null;
    partnerships: Partnership[];
    getFarmerName: (id: string) => string;
    onClose: () => void;
}

const CorporationDetailModal: React.FC<CorporationDetailModalProps> = ({ corporation, partnerships, getFarmerName, onClose }) => {
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
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center z-[100] p-4 md:p-8" onClick={onClose}>
            <div 
                className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform animate-fade-in-up overflow-hidden" 
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Section */}
                <div className="p-8 md:p-12 border-b border-slate-100 relative">
                    <button 
                        onClick={onClose} 
                        className="absolute top-8 right-8 p-3 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    
                    <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-slate-50 shadow-xl mb-6 md:mb-0 md:mr-8 flex items-center justify-center bg-slate-100 overflow-hidden shrink-0">
                            {corporation.logoUrl ? (
                                <img 
                                    src={corporation.logoUrl} 
                                    alt={corporation.name} 
                                    className="w-full h-full object-cover" 
                                />
                            ) : (
                                <span className="text-xl md:text-2xl font-black text-slate-400 p-4 text-center leading-tight">
                                    {corporation.name.length > 4 ? corporation.name.substring(0, 4) : corporation.name}
                                </span>
                            )}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">{corporation.name}</h2>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                                <span className="px-4 py-1.5 bg-sky-100 text-sky-700 rounded-full text-xs font-black uppercase tracking-widest">
                                    {corporation.industry}
                                </span>
                                {corporation.esgFocus.map((focus, idx) => (
                                    <span key={idx} className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">
                                        #{focus}
                                    </span>
                                ))}
                            </div>
                            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm font-bold text-slate-400">
                                <span className="flex items-center"><MapPin size={16} className="mr-2 text-sky-500" />{corporation.city} {corporation.district}</span>
                                {corporation.website !== '#' && (
                                    <a href={corporation.website} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-sky-600 transition-colors">
                                        <Globe size={16} className="mr-2 text-sky-500" />訪問官方網站
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-8 md:p-12 overflow-y-auto wc-no-scrollbar bg-slate-50">
                    <div className="max-w-2xl mx-auto">
                        <section className="mb-12">
                            <h3 className="flex items-center text-2xl font-black text-slate-900 mb-8 pb-4 border-b-2 border-slate-200">
                                <ShoppingBag className="mr-3 text-sky-500" /> 認養與認購成果
                            </h3>

                            <div className="space-y-8">
                                {/* Manual Records (Primary for this update) */}
                                {hasManualRecords && sortedManualYears.map((record, idx) => (
                                    <div key={idx} className="relative pl-10">
                                        <div className="absolute left-1.5 top-0 bottom-0 w-1 bg-sky-100 rounded-full"></div>
                                        <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-sky-500 border-4 border-white shadow-sm font-black"></div>
                                        
                                        <h4 className="text-lg font-black text-slate-900 mb-3 flex items-center">
                                            民國 {record.year} 年
                                        </h4>
                                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                                <Leaf size={20} />
                                            </div>
                                            <p className="text-slate-700 font-bold text-lg leading-relaxed">{record.detail}</p>
                                        </div>
                                    </div>
                                ))}

                                {/* Existing Partnerships (Automated data) */}
                                {hasPartnerships && sortedPartnershipYears.map(year => (
                                    <div key={year} className="relative pl-10">
                                        <div className="absolute left-1.5 top-0 bottom-0 w-1 bg-sky-100 rounded-full"></div>
                                        <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-sky-500 border-4 border-white shadow-sm"></div>
                                        
                                        <h4 className="text-lg font-black text-slate-900 mb-3">
                                            {year} 年 (契作認養)
                                        </h4>
                                        <ul className="space-y-3">
                                            {partnershipsByYear[year].map(p => (
                                                <li key={p.id} className="bg-white p-5 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
                                                    <span className="font-bold text-slate-700">認養 {getFarmerName(p.farmerId)}</span>
                                                    <span className="px-3 py-1 bg-sky-500 text-white text-xs font-black rounded-full flex items-center">
                                                        <AreaChart size={14} className="mr-1.5" />
                                                        {p.adoptedArea} 公頃
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}

                                {!hasManualRecords && !hasPartnerships && (
                                    <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                                        <Info className="mx-auto w-12 h-12 text-slate-200 mb-4" />
                                        <p className="text-slate-400 font-bold">目前尚無公開的合作細節</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="p-8 bg-white border-t border-slate-100 flex justify-center">
                    <button
                        onClick={onClose}
                        className="px-12 py-5 bg-slate-900 text-white font-black rounded-3xl shadow-xl hover:bg-slate-800 transition-all active:scale-95 text-lg"
                    >
                        關閉並返回
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CorporationDetailModal;
