import React from 'react';
import type { Farmer } from './types';
import { X, MapPin, Trees, Sprout, TrendingUp, HelpCircle, AreaChart, TestTube2, User } from 'lucide-react';

interface FarmerDetailModalProps {
    farmer: Farmer | null;
    onClose: () => void;
}

const FarmerDetailModal: React.FC<FarmerDetailModalProps> = ({ farmer, onClose }) => {
    if (!farmer) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">{farmer.name}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        <img src={farmer.imageUrls?.[0]} alt={farmer.name} className="w-full h-64 rounded-lg object-cover" />
                        <div>
                            <h4 className="font-bold mb-2 text-gray-700">農場照片</h4>
                            <div className="grid grid-cols-3 gap-2">
                                {farmer.imageUrls.map((url, index) => (
                                    <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                                        <img src={url} alt={`${farmer.name} photo ${index + 1}`} className="w-full h-24 object-cover rounded-md hover:opacity-80 transition-opacity" />
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold mb-2 mt-4 text-gray-700">農場位置</h4>
                            <iframe
                                src={farmer.googleMapEmbedUrl}
                                width="100%"
                                height="250"
                                style={{ border: 0 }}
                                allowFullScreen={false}
                                loading="lazy"
                                className="rounded-md"
                            ></iframe>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        <InfoCard>
                            <InfoItem icon={User} title="負責人" content={farmer.personInCharge} />
                            <InfoItem icon={MapPin} title="地點" content={`${farmer.city}${farmer.district} - ${farmer.location}`} />
                            <InfoItem icon={Sprout} title="主要作物" content={Array.isArray(farmer.crop) ? farmer.crop.join(', ') : farmer.crop} />
                            <InfoItem icon={AreaChart} title="面積" content={`${farmer.area} 公頃`} />
                        </InfoCard>

                        <InfoCard title="永續發展目標">
                            <InfoItem icon={Trees} title="農場目標" content={farmer.farmGoal} />
                            <InfoItem icon={TrendingUp} title="減碳潛力" content={`${farmer.carbonPotential} 噸/年`} />
                            <InfoItem icon={TestTube2} title="總磷污染削減率" content={`${farmer.phosphorusReductionRate}% (檢測日: ${farmer.lastTested || 'N/A'})`} />
                            <InfoItem icon={HelpCircle} title="需求" content={farmer.needs} />
                        </InfoCard>
                    </div>
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

const InfoCard: React.FC<{ title?: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gray-50 rounded-lg p-4">
        {title && <h3 className="text-lg font-bold text-gray-800 mb-3">{title}</h3>}
        <div className="space-y-3">
            {children}
        </div>
    </div>
)

const InfoItem: React.FC<{ icon: React.ElementType, title: string, content: string }> = ({ icon: Icon, title, content }) => (
    <div className="flex items-start">
        <Icon className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0 mt-0.5" />
        <div>
            <h5 className="font-semibold text-sm text-gray-700">{title}</h5>
            <p className="text-sm text-gray-600">{content}</p>
        </div>
    </div>
)

export default FarmerDetailModal;
