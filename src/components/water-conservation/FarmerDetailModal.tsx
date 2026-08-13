import React, { useState } from 'react';
import type { Farmer } from './types';
import { X, MapPin, Trees, Sprout, ChevronLeft, ChevronRight, AreaChart, User, History, Leaf } from 'lucide-react';

interface FarmerDetailModalProps {
    farmer: Farmer | null;
    onClose: () => void;
}

const FarmerDetailModal: React.FC<FarmerDetailModalProps> = ({ farmer, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // ESC key close support
    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!farmer) return null;

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % farmer.imageUrls.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + farmer.imageUrls.length) % farmer.imageUrls.length);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4 sm:p-6" onClick={onClose}>
            <div 
                className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col transform animate-fade-in-up overflow-hidden border border-slate-200" 
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-1">{farmer.name}</h2>
                        <p className="text-sm text-slate-500 flex items-center gap-1.5">
                             <MapPin size={14} className="text-sky-600" /> {farmer.city}{farmer.district}
                        </p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto wc-no-scrollbar bg-slate-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Left: Image Carousel & Map */}
                        <div className="p-6 border-r border-slate-100 space-y-6">
                            {/* Carousel */}
                            <div className="relative group overflow-hidden rounded-lg shadow-sm border border-slate-200 aspect-[4/3] bg-slate-100">
                                {farmer.imageUrls && farmer.imageUrls.length > 0 ? (
                                    <>
                                        <img 
                                            src={farmer.imageUrls[currentImageIndex]} 
                                            alt={`${farmer.name} ${currentImageIndex}`} 
                                            className="w-full h-full object-cover transition-transform duration-500" 
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop';
                                            }}
                                        />
                                        
                                        {farmer.imageUrls.length > 1 && (
                                            <>
                                                <button 
                                                    onClick={prevImage}
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-white/70 text-slate-800 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                                                >
                                                    <ChevronLeft size={20} />
                                                </button>
                                                <button 
                                                    onClick={nextImage}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-white/70 text-slate-800 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                                                >
                                                    <ChevronRight size={20} />
                                                </button>
                                                
                                                {/* Dots */}
                                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                                    {farmer.imageUrls.map((_, idx) => (
                                                        <button 
                                                            key={idx}
                                                            onClick={() => setCurrentImageIndex(idx)}
                                                            className={`h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/60 w-1.5'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                        <Trees size={48} className="mb-2 opacity-50" />
                                        <span className="text-sm font-medium">無提供照片</span>
                                    </div>
                                )}
                            </div>

                            {/* Google Map */}
                            {farmer.googleMapEmbedUrl ? (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <MapPin size={16} className="text-sky-600" /> 地理位置
                                    </h3>
                                    <div className="rounded-lg overflow-hidden border border-slate-200 shadow-sm h-48">
                                        <iframe
                                            src={farmer.googleMapEmbedUrl}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen={false}
                                            loading="lazy"
                                        ></iframe>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 bg-slate-100 rounded-lg border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
                                    <MapPin className="text-slate-400 mb-2" size={24} />
                                    <p className="text-slate-500 text-sm">無地圖資訊</p>
                                </div>
                            )}
                        </div>

                        {/* Right: Info & History */}
                        <div className="p-6 space-y-8">
                            {/* Basic Info */}
                            <section>
                                <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
                                    <Leaf size={16} className="text-emerald-600" /> 基本資料
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3">
                                    <DetailItem icon={User} title="負責人" content={farmer.personInCharge} />
                                    <DetailItem icon={Sprout} title="農作物" content={Array.isArray(farmer.crop) ? farmer.crop.join('、') : farmer.crop} />
                                    <DetailItem icon={AreaChart} title="面積" content={`${farmer.area} 公頃`} />
                                </div>
                            </section>

                            {/* History Records */}
                            {farmer.history && farmer.history.length > 0 && (
                                <section>
                                    <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
                                        <History size={16} className="text-sky-600" /> 執行紀錄
                                    </h3>
                                    <div className="space-y-4">
                                        {farmer.history.map((record, idx) => (
                                            <div key={idx} className="relative pl-6">
                                                <div className="absolute left-1.5 top-1.5 bottom-0 w-0.5 bg-slate-200"></div>
                                                <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-sky-500 border-2 border-white shadow-sm"></div>
                                                <h4 className="text-sm font-bold text-slate-800 mb-1">民國 {record.year} 年</h4>
                                                <div className="bg-white p-3 rounded-md border border-slate-200 shadow-sm">
                                                    <p className="text-slate-600 text-sm leading-relaxed">{record.detail}</p>
                                                    {record.areaChange && (
                                                        <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium rounded">
                                                            增加 {record.areaChange} 公頃
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end sticky bottom-0 z-10">
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

const DetailItem: React.FC<{ icon: any, title: string, content: string }> = ({ icon: Icon, title, content }) => (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-2 bg-slate-50 text-slate-500 rounded-md">
            <Icon size={18} />
        </div>
        <div>
            <p className="text-xs text-slate-500 font-medium mb-0.5">{title}</p>
            <p className="text-sm font-semibold text-slate-800">{content}</p>
        </div>
    </div>
);

export default FarmerDetailModal;
