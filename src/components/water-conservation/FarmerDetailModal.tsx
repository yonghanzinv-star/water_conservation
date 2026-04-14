import React, { useState } from 'react';
import type { Farmer } from './types';
import { X, MapPin, Trees, Sprout, ChevronLeft, ChevronRight, AreaChart, User, Calendar, History, Leaf } from 'lucide-react';

interface FarmerDetailModalProps {
    farmer: Farmer | null;
    onClose: () => void;
}

const FarmerDetailModal: React.FC<FarmerDetailModalProps> = ({ farmer, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!farmer) return null;

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % farmer.imageUrls.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + farmer.imageUrls.length) % farmer.imageUrls.length);
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex justify-center items-center z-[100] p-4 md:p-8" onClick={onClose}>
            <div 
                className="bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col transform animate-fade-in-up overflow-hidden" 
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-8 md:p-10 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-2">{farmer.name}</h2>
                        <p className="text-slate-400 font-bold flex items-center gap-2">
                             <MapPin size={18} className="text-sky-500" /> {farmer.city}{farmer.district}
                        </p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-4 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-all"
                    >
                        <X className="w-8 h-8" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto wc-no-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Left: Image Carousel & Map */}
                        <div className="p-8 md:p-10 space-y-10 bg-slate-50">
                            {/* Carousel */}
                            <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl aspect-[4/3] bg-slate-200">
                                {farmer.imageUrls && farmer.imageUrls.length > 0 ? (
                                    <>
                                        <img 
                                            src={farmer.imageUrls[currentImageIndex]} 
                                            alt={`${farmer.name} ${currentImageIndex}`} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop';
                                            }}
                                        />
                                        
                                        {farmer.imageUrls.length > 1 && (
                                            <>
                                                <button 
                                                    onClick={prevImage}
                                                    className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full wc-glass text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30"
                                                >
                                                    <ChevronLeft size={32} />
                                                </button>
                                                <button 
                                                    onClick={nextImage}
                                                    className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full wc-glass text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30"
                                                >
                                                    <ChevronRight size={32} />
                                                </button>
                                                
                                                {/* Dots */}
                                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                                                    {farmer.imageUrls.map((_, idx) => (
                                                        <button 
                                                            key={idx}
                                                            onClick={() => setCurrentImageIndex(idx)}
                                                            className={`w-3 h-3 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-8' : 'bg-white/40'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center p-6 text-center">
                                        <Trees className="text-white/20 absolute inset-0 w-full h-full p-20" />
                                        <span className="relative z-10 text-white font-black text-3xl">{farmer.name}</span>
                                    </div>
                                )}
                            </div>

                            {/* Google Map */}
                            {farmer.googleMapEmbedUrl ? (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                        <MapPin className="text-sky-500" /> 農場地理位置
                                    </h3>
                                    <div className="rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl h-64">
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
                                <div className="p-8 bg-sky-50 rounded-[2.5rem] border-2 border-dashed border-sky-100 flex flex-col items-center text-center">
                                    <MapPin className="text-sky-200 mb-2" size={32} />
                                    <p className="text-sky-400 font-bold text-sm">此農場尚未提供地圖定位資訊</p>
                                </div>
                            )}
                        </div>

                        {/* Right: Info & History */}
                        <div className="p-8 md:p-12 space-y-12">
                            {/* Basic Info */}
                            <section>
                                <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3 border-b-2 border-slate-100 pb-4">
                                    <Leaf className="text-emerald-500" /> 基本資料
                                </h3>
                                <div className="grid grid-cols-1 gap-6">
                                    <DetailItem icon={User} title="負責人" content={farmer.personInCharge} />
                                    <DetailItem icon={Sprout} title="農作物" content={Array.isArray(farmer.crop) ? farmer.crop.join(', ') : farmer.crop} />
                                    <DetailItem icon={AreaChart} title="合理化施肥農地總面積" content={`${farmer.area} 公頃`} />
                                </div>
                            </section>

                            {/* History Records */}
                            {farmer.history && (
                                <section>
                                    <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3 border-b-2 border-slate-100 pb-4">
                                        <History className="text-sky-500" /> 合理化施肥執行紀錄
                                    </h3>
                                    <div className="space-y-6">
                                        {farmer.history.map((record, idx) => (
                                            <div key={idx} className="relative pl-10">
                                                <div className="absolute left-1.5 top-0 bottom-0 w-1 bg-slate-100 rounded-full"></div>
                                                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-sky-500 border-4 border-white"></div>
                                                <h4 className="text-lg font-black text-slate-900 mb-2">民國 {record.year} 年</h4>
                                                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                                    <p className="text-slate-600 font-bold leading-relaxed">{record.detail}</p>
                                                    {record.areaChange && (
                                                        <span className="inline-block mt-3 px-4 py-1.5 bg-sky-500 text-white text-xs font-black rounded-full">
                                                            + {record.areaChange} 公頃
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
                <div className="p-8 md:p-10 bg-slate-50 border-t border-slate-100 flex justify-center sticky bottom-0 z-10">
                    <button
                        onClick={onClose}
                        className="px-16 py-6 bg-slate-950 text-white font-black rounded-[2rem] shadow-2xl hover:bg-slate-800 active:scale-95 transition-all text-xl"
                    >
                        關閉詳情
                    </button>
                </div>
            </div>
        </div>
    );
};

const DetailItem: React.FC<{ icon: any, title: string, content: string }> = ({ icon: Icon, title, content }) => (
    <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-200/50">
        <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-400">
            <Icon size={24} />
        </div>
        <div>
            <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">{title}</p>
            <p className="text-xl font-black text-slate-800">{content}</p>
        </div>
    </div>
);

export default FarmerDetailModal;
