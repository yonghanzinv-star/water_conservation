import React from 'react';
import type { Corporation, Partnership } from './types';
import { X, Building2, Globe, MapPin, Calendar, AreaChart } from 'lucide-react';

interface CorporationDetailModalProps {
    corporation: Corporation | null;
    partnerships: Partnership[];
    getFarmerName: (id: string) => string;
    onClose: () => void;
}

const CorporationDetailModal: React.FC<CorporationDetailModalProps> = ({ corporation, partnerships, getFarmerName, onClose }) => {
    if (!corporation) return null;

    const partnershipsByYear = partnerships.reduce((acc, p) => {
        const year = p.adoptionYear;
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(p);
        return acc;
    }, {} as Record<number, Partnership[]>);

    const sortedYears = Object.keys(partnershipsByYear).map(Number).sort((a, b) => b - a);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col transform animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <img src={corporation.logoUrl} alt={corporation.name} className="w-16 h-16 rounded-full object-cover border-4 border-gray-100" />
                            <div className="ml-4">
                                <h2 className="text-2xl font-bold text-gray-800">{corporation.name}</h2>
                                <p className="text-sm text-gray-500">{corporation.industry}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <X className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>
                    <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center"><MapPin size={14} className="mr-1.5" />{corporation.city}{corporation.district}</span>
                        <a href={corporation.website} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-blue-600 hover:underline">
                            <Globe size={14} className="mr-1.5" />訪問官網
                        </a>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">合作紀錄</h3>
                    {sortedYears.length > 0 ? (
                        <div className="space-y-6">
                            {sortedYears.map(year => (
                                <div key={year}>
                                    <h4 className="flex items-center text-md font-bold text-gray-800">
                                        <Calendar size={18} className="mr-2 text-blue-500" />
                                        {year} 年
                                    </h4>
                                    <ul className="mt-2 ml-2 border-l-2 border-blue-200 pl-4 space-y-2">
                                        {partnershipsByYear[year].map(p => (
                                            <li key={p.id} className="text-sm text-gray-700 flex justify-between items-center">
                                                <span>認養 <span className="font-semibold">{getFarmerName(p.farmerId)}</span></span>
                                                <span className="bg-blue-100 text-blue-800 font-medium px-2 py-0.5 rounded-full flex items-center">
                                                    <AreaChart size={14} className="mr-1.5" />
                                                    {p.adoptedArea} 公頃
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-8">暫無合作紀錄</p>
                    )}
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-200 text-right rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        關閉
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CorporationDetailModal;
