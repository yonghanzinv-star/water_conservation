import React, { useState } from 'react';
import type { Corporation, Farmer, Partnership, SiteContent } from './types';
import { Building2, Leaf, Droplets, MapPin, Waves, Mountain, ShieldCheck, Mail, Phone, ChevronDown, BarChart3, FlaskConical, Globe, Trees, ExternalLink } from 'lucide-react';
import FarmerDetailModal from './FarmerDetailModal';
import CorporationDetailModal from './CorporationDetailModal';

// ============================
// Static Data (from ESG project)
// ============================
const corporations: Corporation[] = [
    { id: 'corp-1', userId: 'user-corp-1', name: '芯智科技', taxId: '87654321', website: 'https://www.coretech.tw', city: '新竹縣', district: '竹北市', industry: '科技業', logoUrl: 'https://picsum.photos/seed/corp1/100', esgFocus: ['減碳碳匯潛力', '水源保育'], contactEmail: 'manager.wang@coretech.tw', contactPhone: '03-555-1234', status: 'approved' },
    { id: 'corp-2', userId: 'user-corp-2', name: '悅氏食品', taxId: '12345678', website: 'https://www.goodfood.tw', city: '臺北市', district: '信義區', industry: '食品飲料業', logoUrl: 'https://picsum.photos/seed/corp2/100', esgFocus: ['永續農業/環境', '長期伙食', '社會公益'], contactEmail: 'director.li@goodfood.tw', contactPhone: '02-2720-8888', status: 'approved' },
    { id: 'corp-3', userId: 'user-corp-3', name: '森泉飲品', taxId: '11223344', website: 'https://www.waterworks.tw', city: '宜蘭縣', district: '羅東鎮', industry: '食品飲料業', logoUrl: 'https://picsum.photos/seed/corp3/100', esgFocus: ['水源保育', '生物多樣性'], contactEmail: 'service@waterworks.tw', contactPhone: '03-950-7788', status: 'approved' }
];

const farmers: Farmer[] = [
    {
        id: 'farm-rihua', userId: 'user-farm-rihua', name: '日華農場', personInCharge: '葉日華',
        email: 'rihua.yeh@example.com', telephone: '0931394091', location: '石門水庫集水區',
        city: '桃園市', district: '大溪區', crop: ['綠竹筍'],
        googleMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3623.161817478052!2d121.2985170154881!3d24.75569485609459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34681b0b39564177%3A0x1b02862d22a57868!2z5aSn5rqi6ICB6Iy25bug!5e0!3m2!1szh-TW!2stw!4v1678886400000!5m2!1szh-TW!2stw',
        imageUrls: ['https://picsum.photos/seed/farm-rihua/400/300'],
        farmGoal: '已取得有機認證，持續友善耕作', carbonPotential: 5, needs: '尋求穩定通路與企業合作',
        area: 7, phosphorusReductionRate: 46, lastTested: '2024-05', status: 'approved', participatesInAdoption: true,
    },
    {
        id: 'farm-1', userId: 'user-farm-1', name: '翠峰茶園', personInCharge: '林小姐',
        email: 'service@teagarden.tw', telephone: '0912-345-678', location: '德基水庫集水區',
        city: '臺中市', district: '和平區', crop: ['高山茶', '蜜蘋果'],
        googleMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.01799275923!2d121.28588881500001!3d24.72620098411601!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34683da6e2794f53%3A0x6b84175382ff2439!2z55-z6ZaA5rC05bKp!5e0!3m2!1szh-TW!2stw!4v1622536854123!5m2!1szh-TW!2stw',
        imageUrls: ['https://picsum.photos/seed/farm1/400/300'],
        farmGoal: '轉型為有機茶葉種植，並發展生態旅遊', carbonPotential: 8.5,
        needs: '需要資金進行有機認證與改善灌溉系統', area: 5, phosphorusReductionRate: 15.5,
        lastTested: '2023-11', status: 'approved', participatesInAdoption: true
    },
    {
        id: 'farm-2', userId: 'user-farm-2', name: '陽光果園', personInCharge: '黃太太',
        email: 'sunfruit@email.com', telephone: '0988-765-432', location: '曾文水庫集水區',
        city: '臺南市', district: '楠西區', crop: ['芒果', '龍眼'],
        googleMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.917642145465!2d120.48916731542456!3d23.026730921946857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e7e0f8c8c8c8d%3A0x8c8c8c8c8c8c8c8d!2z5Z-v5paH5rC05bKp!5e0!3m2!1szh-TW!2stw!4v1678886400000!5m2!1szh-TW!2stw',
        imageUrls: ['https://picsum.photos/seed/farm2/400/300'],
        farmGoal: '實施草生栽培，減少除草劑使用', carbonPotential: 6,
        needs: '希望導入智慧農業監測設備', area: 10, phosphorusReductionRate: 12.0,
        lastTested: '2024-02', status: 'approved', participatesInAdoption: true
    },
];

const partnerships: Partnership[] = [
    { id: 'p-1', corporationId: 'corp-1', farmerId: 'farm-rihua', adoptionYear: 2024, adoptedArea: 3, status: 'confirmed' },
    { id: 'p-2', corporationId: 'corp-2', farmerId: 'farm-1', adoptionYear: 2024, adoptedArea: 2.5, status: 'confirmed' },
    { id: 'p-3', corporationId: 'corp-3', farmerId: 'farm-2', adoptionYear: 2023, adoptedArea: 5, status: 'confirmed' },
    { id: 'p-4', corporationId: 'corp-1', farmerId: 'farm-1', adoptionYear: 2023, adoptedArea: 1.5, status: 'confirmed' },
    { id: 'p-5', corporationId: 'corp-2', farmerId: 'farm-rihua', adoptionYear: 2024, adoptedArea: 2, status: 'confirmed' },
];

const siteContent: SiteContent = {
    homePage: {
        heroTitle: '石門水庫：<br/><span class="text-sky-400">水源地永續計畫</span>',
        heroSubtitle: '跨界合作守護北台灣生命之源<br/>推動集水區友善農業與水質保育',
        heroDescription: '石門水庫提供超過 300 萬人的民生用水，是台灣北部經濟與社會的核心。',
        partnersTitle: '守護家園的夥伴',
        partnersSubtitle: '企業與農民已共同投入環境優化工程',
        reservoirTitle: '認識石門水庫',
        reservoirSubtitle: '守護半世紀的生命之源',
        reservoirDescription: '石門水庫位於桃園市大漢溪中游，集水區廣達 763 平方公里。自 1964 年完工以來，承擔著灌溉、發電、防洪及供應數百萬人口用水的多重任務。隨著極端氣候挑戰，水質保育與泥沙防治成為關鍵。我們推動友善耕作，減少化肥與農藥流失，延續水庫生命力。',
        joinUsTitle: '攜手守護水源',
        joinUsSubtitle: '如果您是關注 ESG 的企業或農民，歡迎參與這場永續行動。'
    },
    footer: {
        aboutUs: '本計畫專注於透過友善耕作保護集水區環境，連結企業與農民，創造環境、社會與產業三贏。',
        contactEmail: 'yhansum@hetengtech.com',
        contactPhone: '(02) 8521-9296 ext. 17 岑先生',
    }
};

// ============================
// Component
// ============================
const WaterConservation: React.FC = () => {
    const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
    const [selectedCorp, setSelectedCorp] = useState<Corporation | null>(null);
    const [showPhoneAlert, setShowPhoneAlert] = useState(false);

    const getFarmerName = (id: string) => farmers.find(f => f.id === id)?.name || '未知農場';
    const homePageContent = siteContent.homePage;

    const totalAdoptedArea = partnerships.reduce((sum, p) => p.status === 'confirmed' ? sum + p.adoptedArea : sum, 0);

    return (
        <div className="wc-snap-container wc-no-scrollbar bg-slate-900">
            {/* 1. Cinematic Hero Section */}
            <section className="wc-snap-section bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
                <div className="relative z-10 flex flex-col items-center h-full px-10 text-center">
                    <div className="flex-1 flex flex-col items-center justify-center pb-24 wc-animate-fade-up">
                        <div className="mb-8 p-3 bg-sky-500/20 backdrop-blur-xl rounded-full border border-sky-400/30">
                            <Droplets className="text-sky-400 h-8 w-8" />
                        </div>
                        <h1
                            className="text-white text-5xl md:text-8xl font-black leading-[1.1] tracking-tighter mb-8 wc-text-glow"
                            dangerouslySetInnerHTML={{ __html: homePageContent.heroTitle }}
                        ></h1>
                        <p
                            className="text-sky-100/90 text-lg md:text-2xl font-medium leading-relaxed max-w-lg mx-auto mb-12"
                            dangerouslySetInnerHTML={{ __html: homePageContent.heroSubtitle }}
                        ></p>

                        <a href={`mailto:${siteContent.footer.contactEmail}`} className="flex items-center gap-3 px-8 py-5 bg-sky-500 text-white rounded-2xl font-black text-xl shadow-[0_20px_40px_rgba(14,165,233,0.3)] hover:bg-sky-400 active:scale-95 transition-all no-underline">
                            <Mail size={24} /> 立即參與計畫
                        </a>
                    </div>

                    <div className="pb-8 flex flex-col items-center opacity-50">
                        <p className="text-[10px] tracking-[0.5em] uppercase font-black mb-2 text-white">下滑探索故事</p>
                        <ChevronDown className="animate-bounce h-5 w-5 text-sky-400" />
                    </div>
                </div>
            </section>

            {/* 2. Story & Facts Section */}
            <section className="wc-snap-section bg-slate-50 text-slate-900 p-10 md:p-20 justify-center">
                <div className="max-w-xl mx-auto">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-1.5 w-16 bg-sky-500 rounded-full"></div>
                        <span className="text-sky-600 font-black text-xs tracking-[0.3em] uppercase">水源地故事</span>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 mb-8 leading-tight">{homePageContent.reservoirTitle}</h2>

                    <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200 border border-slate-100 mb-10 flex gap-4 items-center">
                        <div className="p-4 bg-sky-100 rounded-3xl text-sky-600">
                            <Mountain size={32} />
                        </div>
                        <p className="text-sky-900 font-bold leading-relaxed">
                            "{homePageContent.reservoirSubtitle}"
                        </p>
                    </div>

                    <p className="text-slate-600 text-lg leading-[2] mb-12">
                        {homePageContent.reservoirDescription}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-[2.5rem] shadow-md border border-slate-50">
                            <p className="text-3xl font-black text-sky-500 mb-1 tracking-tighter">763</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">集水面積 km²</p>
                        </div>
                        <div className="bg-white p-6 rounded-[2.5rem] shadow-md border border-slate-50">
                            <p className="text-3xl font-black text-sky-500 mb-1 tracking-tighter">300+</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">供水人口(萬)</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Impact Funnel Section */}
            <section className="wc-snap-section bg-slate-900 text-white p-10 md:p-20 justify-center overflow-hidden">
                <div className="max-w-xl mx-auto relative z-10 py-8">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-black mb-4 tracking-tighter text-white">永續影響力成果</h2>
                        <div className="h-1.5 w-20 bg-emerald-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="space-y-4 relative">
                        <div className="absolute left-6 top-8 bottom-8 w-1 bg-gradient-to-b from-sky-500 via-emerald-500 to-indigo-500 rounded-full opacity-30"></div>

                        <ImpactItem
                            icon={Building2}
                            label="企業認養"
                            value={corporations.length}
                            unit="家"
                            desc="跨界合作共創 ESG 效益"
                            color="bg-sky-500"
                        />
                        <ImpactItem
                            icon={BarChart3}
                            label="認養總面積"
                            value={totalAdoptedArea.toFixed(1)}
                            unit="公頃"
                            desc="集水區友善農業轉型"
                            color="bg-blue-500"
                        />
                        <ImpactItem
                            icon={FlaskConical}
                            label="總磷削減"
                            value="25.3"
                            unit="%"
                            desc="從源頭優化石門水質"
                            color="bg-emerald-500"
                        />
                        <ImpactItem
                            icon={Trees}
                            label="年減碳潛力"
                            value={(totalAdoptedArea * 5).toFixed(0)}
                            unit="噸"
                            desc="森林與土地固碳貢獻"
                            color="bg-indigo-500"
                        />
                    </div>

                    <div className="mt-8 flex justify-center items-center gap-6 py-6 border-t border-white/10">
                        <Globe className="text-emerald-400 h-10 w-10 animate-spin-slow" />
                        <div className="text-left">
                            <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">符合國際永續標竿</p>
                            <div className="flex gap-2 mt-2">
                                <span className="px-2 py-0.5 bg-sky-500/20 text-sky-400 text-[8px] font-bold rounded border border-sky-500/30">SDG 6 潔淨水</span>
                                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[8px] font-bold rounded border border-emerald-500/30">SDG 13 氣候行動</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Horizontal Scroller - Farmers */}
            <section className="wc-snap-section bg-slate-50 py-16">
                <div className="px-10 mb-8 max-w-xl mx-auto">
                    <h2 className="text-3xl font-black text-slate-900 mb-2">合作農場</h2>
                    <p className="text-slate-400 text-sm font-medium">集水區內第一線的守護者們</p>
                </div>

                <div className="wc-h-snap wc-no-scrollbar gap-5 px-10 pb-12">
                    {farmers.map(farmer => (
                        <div
                            key={farmer.id}
                            onClick={() => setSelectedFarmer(farmer)}
                            className="wc-h-snap-item w-[85vw] md:w-80 bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-white overflow-hidden active:scale-95 transition-all cursor-pointer"
                        >
                            <div className="relative h-56">
                                <img src={farmer.imageUrls?.[0]} className="w-full h-full object-cover" />
                                <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-slate-800 flex items-center shadow-lg">
                                    <MapPin size={12} className="mr-1.5 text-emerald-500" /> {farmer.district}
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-black text-slate-800">{farmer.name}</h3>
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                        <Leaf size={16} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-widest">
                                    <SproutIcon size={14} className="text-emerald-500" />
                                    <span>主要作物: {Array.isArray(farmer.crop) ? farmer.crop[0] : farmer.crop}</span>
                                </div>
                                <button className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2">
                                    查看詳情 <ExternalLink size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="wc-h-snap-item w-20 flex items-center justify-center opacity-20">
                        <ChevronRightIcon size={48} />
                    </div>
                </div>
            </section>

            {/* 5. Horizontal Scroller - Corps */}
            <section className="wc-snap-section bg-white py-16">
                <div className="px-10 mb-8 max-w-xl mx-auto">
                    <h2 className="text-3xl font-black text-slate-900 mb-2">支持企業</h2>
                    <p className="text-slate-400 text-sm font-medium">投入 ESG 資源實踐企業公民責任</p>
                </div>

                <div className="wc-h-snap wc-no-scrollbar gap-5 px-10 pb-12">
                    {corporations.map(corp => (
                        <div
                            key={corp.id}
                            onClick={() => setSelectedCorp(corp)}
                            className="wc-h-snap-item w-[65vw] md:w-64 bg-slate-50 rounded-[3rem] p-10 flex flex-col items-center text-center border-2 border-transparent hover:border-sky-100 transition-all active:scale-95 shadow-sm cursor-pointer"
                        >
                            <div className="relative mb-6">
                                <img src={corp.logoUrl} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl" />
                                <div className="absolute -bottom-1 -right-1 bg-sky-500 text-white p-2 rounded-full border-4 border-white">
                                    <ShieldCheck size={14} />
                                </div>
                            </div>
                            <h3 className="font-black text-slate-800 text-lg line-clamp-1">{corp.name}</h3>
                            <p className="mt-2 text-[10px] font-black text-sky-600 uppercase tracking-[0.2em]">{corp.industry}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 6. Footer & CTA Section */}
            <section className="wc-snap-section bg-slate-950 text-white p-12 justify-center">
                <div className="max-w-xl mx-auto text-center">
                    <div className="inline-block p-5 bg-sky-500/10 rounded-[2rem] border border-sky-500/20 mb-10">
                        <Droplets className="h-12 w-12 text-sky-400" />
                    </div>
                    <h2 className="text-4xl font-black mb-8 leading-tight tracking-tighter text-white">為下一代守護<br />每一滴純淨水源</h2>
                    <p className="text-slate-400 text-lg leading-relaxed mb-16 font-medium">
                        {siteContent.footer.aboutUs}
                    </p>

                    <div className="flex flex-col gap-4 max-w-sm mx-auto">
                        <a href={`mailto:${siteContent.footer.contactEmail}`} className="flex items-center justify-center gap-4 py-6 bg-sky-500 text-white rounded-[2rem] font-black text-xl shadow-[0_30px_60px_rgba(14,165,233,0.3)] active:scale-95 transition-all no-underline">
                            <Mail size={24} /> 聯繫合作專員
                        </a>
                        <button
                            onClick={() => setShowPhoneAlert(true)}
                            className="flex items-center justify-center gap-4 py-6 border-2 border-white/10 text-white/70 rounded-[2rem] font-bold text-lg active:scale-95 transition-all w-full"
                        >
                            <Phone size={20} /> 專線電話諮詢
                        </button>
                    </div>

                    {showPhoneAlert && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
                            <div className="bg-slate-900 border border-white/10 p-10 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl">
                                <div className="mx-auto w-16 h-16 bg-sky-500/20 text-sky-400 rounded-full flex items-center justify-center mb-6">
                                    <Phone size={32} />
                                </div>
                                <h3 className="text-xl font-black text-white mb-4">電話諮詢資訊</h3>
                                <p className="text-slate-300 mb-8 leading-relaxed">請撥打 <br /><span className="text-white font-black text-xl">{siteContent.footer.contactPhone}</span></p>
                                <button
                                    onClick={() => setShowPhoneAlert(false)}
                                    className="w-full py-4 bg-sky-500 text-white rounded-2xl font-black"
                                >
                                    確定
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="mt-24 pt-12 border-t border-white/5 text-[10px] font-black text-white/20 tracking-[0.8em] uppercase">
                        &copy; 2026 禾騰技術股份有限公司
                    </div>
                </div>
            </section>

            {/* Modals */}
            {selectedFarmer && (
                <FarmerDetailModal farmer={selectedFarmer} onClose={() => setSelectedFarmer(null)} />
            )}
            {selectedCorp && (
                <CorporationDetailModal
                    corporation={selectedCorp}
                    partnerships={partnerships.filter(p => p.corporationId === selectedCorp.id)}
                    getFarmerName={getFarmerName}
                    onClose={() => setSelectedCorp(null)}
                />
            )}
        </div>
    );
}

// ============================
// Sub-components (from ESG project)
// ============================
const ImpactItem: React.FC<{ icon: any, label: string, value: any, unit: string, desc: string, color: string }> = ({ icon: Icon, label, value, unit, desc, color }) => {
    return (
        <div className="relative pl-16 py-3 group">
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-4 rounded-2xl shadow-xl text-white ${color} transition-all group-hover:scale-110`}>
                <Icon size={24} />
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-[2.5rem] border border-white/5 shadow-inner">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{label}</p>
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-black text-white">{value}</span>
                    <span className="text-xs font-bold text-slate-500">{unit}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">{desc}</p>
            </div>
        </div>
    );
};

const SproutIcon: React.FC<any> = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M7 20h10" />
        <path d="M10 20c0-3.5 0-7-3-10" />
        <path d="M14 20c0-3.5 0-7 3-10" />
        <path d="M12 20v-16" />
        <path d="M12 4c2.5 0 5 2.5 5 5c0 1.5-1.5 3-5 3s-5-1.5-5-3c0-2.5 2.5-5 5-5z" />
    </svg>
);

const ChevronRightIcon: React.FC<any> = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m9 18 6-6-6-6" />
    </svg>
);

export default WaterConservation;
