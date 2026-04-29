import React, { useState, useEffect } from 'react';
import type { Corporation, Farmer, Partnership, SiteContent } from './types';
import { Building2, Leaf, Droplets, MapPin, Waves, Mountain, ShieldCheck, Mail, ChevronDown, BarChart3, FlaskConical, Globe, Trees, ExternalLink, ArrowRight, ShoppingBag, Sprout, Target } from 'lucide-react';
import FarmerDetailModal from './FarmerDetailModal';
import CorporationDetailModal from './CorporationDetailModal';
import { fetchCSV, mapSheetToCorps, mapSheetToFarmers, mapSheetToSettings } from '../../utils/googleSheets';

// ============================
// Google Sheets CSV URLs (User needs to replace these)
// ============================
const SHEET_URLS = {
    corporations: 'https://docs.google.com/spreadsheets/d/1wdB4XIfiqclj0spILEeIudVLSD7vMn9HiUfKW4b-Lpg/export?format=csv&gid=1720908014',
    farmers: 'https://docs.google.com/spreadsheets/d/1wdB4XIfiqclj0spILEeIudVLSD7vMn9HiUfKW4b-Lpg/export?format=csv&gid=2022674934',
    partnerships: 'https://docs.google.com/spreadsheets/d/1wdB4XIfiqclj0spILEeIudVLSD7vMn9HiUfKW4b-Lpg/export?format=csv&gid=2059297580',
    settings: 'https://docs.google.com/spreadsheets/d/1wdB4XIfiqclj0spILEeIudVLSD7vMn9HiUfKW4b-Lpg/export?format=csv&gid=234898130'
};
const corporations: Corporation[] = [
    { 
        id: 'corp-coke', userId: 'user-coke', name: '太古可口可樂', taxId: '04375848', website: 'https://www.coca-cola.com.tw', 
        city: '桃園市', district: '桃園區', industry: '食品飲料業', logoUrl: '/logos/coke.jpg', 
        esgFocus: ['水源保育', '永續包裝'], contactEmail: 'service@coke.tw', contactPhone: '', status: 'approved',
        manualRecords: [{ year: 112, detail: '認購 125 盒水蜜桃' }]
    },
    { 
        id: 'corp-kenci', userId: 'user-kenci', name: '根基營造 (冠德根基)', taxId: '22099131', website: 'https://www.kedge.com.tw', 
        city: '新北市', district: '中和區', industry: '營造業', logoUrl: '/logos/根基營造.svg', 
        esgFocus: ['環境友善', '社會公益'], contactEmail: 'csr@kenci.com.tw', contactPhone: '', status: 'approved',
        manualRecords: [
            { year: 112, detail: '認購 2882 斤綠竹筍' },
            { year: 113, detail: '認購 3256 斤綠竹筍' }
        ]
    },
    { 
        id: 'corp-grape', userId: 'user-grape', name: '葡萄王生技', taxId: '43050202', website: 'https://www.grapeking.com.tw', 
        city: '桃園市', district: '平鎮區', industry: '生技醫療業', logoUrl: '/logos/grapeking.png', 
        esgFocus: ['健康永續', '資源循環'], contactEmail: 'service@grapeking.com.tw', contactPhone: '', status: 'approved',
        manualRecords: [
            { year: 112, detail: '認購 274 斤綠竹筍、10 盒水蜜桃' },
            { year: 113, detail: '認購 354 斤綠竹筍' },
            { year: 114, detail: '認購 347 斤綠竹筍' }
        ]
    },
    { 
        id: 'corp-lilai', userId: 'user-lilai', name: '力萊工程', taxId: '28682181', website: 'https://www.lilai.com.tw', 
        city: '桃園市', district: '蘆竹區', industry: '工程業', logoUrl: '', 
        esgFocus: ['綠色工程', '水源地守護'], contactEmail: 'service@lilai.tw', contactPhone: '', status: 'approved',
        manualRecords: [{ year: 112, detail: '認購 7 盒水蜜桃' }]
    },
    { 
        id: 'corp-xiangdi', userId: 'user-xiangdi', name: '翔第', taxId: '54067822', website: '#', 
        city: '桃園市', district: '桃園區', industry: '貿易業', logoUrl: '', 
        esgFocus: ['在地採購', '社會責任'], contactEmail: 'contact@xiangdi.tw', contactPhone: '', status: 'approved',
        manualRecords: [{ year: 113, detail: '認購 122 斤綠竹筍' }]
    },
    { 
        id: 'corp-kym', userId: 'user-kym', name: '金元福包裝', taxId: '23528221', website: 'https://www.kyf.com.tw', 
        city: '新北市', district: '鶯歌區', industry: '包裝工業', logoUrl: '/logos/kyf.png', 
        esgFocus: ['循環經濟', '環境保育'], contactEmail: 'service@kym.com.tw', contactPhone: '', status: 'approved',
        manualRecords: [
            { year: 113, detail: '認購 200 斤綠竹筍' },
            { year: 114, detail: '認購 200 斤綠竹筍' }
        ]
    },
    { 
        id: 'corp-kanchun', userId: 'user-kanchun', name: '康淳科技', taxId: '89364521', website: 'https://www.concordtech.com.tw', 
        city: '臺中市', district: '西屯區', industry: '環保科技業', logoUrl: '/logos/康淳科技.jpg', 
        esgFocus: ['水處理技術', '永續發展'], contactEmail: 'service@kanchun.tw', contactPhone: '', status: 'approved',
        manualRecords: [{ year: 114, detail: '認購 137 斤綠竹筍' }]
    },
    { 
        id: 'corp-tron', userId: 'user-tron', name: '創控科技', taxId: '24567123', website: 'https://www.tron.com.tw', 
        city: '新竹市', district: '香山區', industry: '電子科技業', logoUrl: '/logos/創控科技.png', 
        esgFocus: ['智慧監測', '環境守護'], contactEmail: 'info@tron.com.tw', contactPhone: '', status: 'approved',
        manualRecords: [{ year: 114, detail: '認購 272 斤綠竹筍' }]
    }
];

const farmers: Farmer[] = [
    {
        id: 'farm-rihua', userId: 'user-farm-rihua', name: '日華農場', personInCharge: '葉日華',
        email: 'rihua@example.com', telephone: '', location: '石門水庫集水區',
        city: '桃園市', district: '大溪區', crop: ['綠竹筍'],
        googleMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3623!2d121.29!3d24.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34681b0b39564177%3A0x1b02862d22a57868!2z5aSn5rqi6ICB6Iy25bug!5e0!3m2!1szh-TW!2stw!4v1678886400000',
        imageUrls: ['https://picsum.photos/seed/rihua/800/600', 'https://picsum.photos/seed/rihua2/800/600'],
        farmGoal: '有機認證，友善耕作', carbonPotential: 5, needs: '尋求銷售通路',
        area: 6.8, phosphorusReductionRate: 46, lastTested: '2024-05', status: 'approved', participatesInAdoption: true,
        history: [
            { year: 112, detail: '加入計畫', areaChange: 1 },
            { year: 113, detail: '擴展耕地', areaChange: 4 },
            { year: 114, detail: '規模化經營', areaChange: 6.8 }
        ]
    },
    {
        id: 'farm-gujia', userId: 'user-farm-gujia', name: '古家農場', personInCharge: '古先生',
        email: 'gujia@example.com', telephone: '', location: '優質水質區',
        city: '桃園市', district: '復興區', crop: ['水蜜桃'],
        googleMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1!2d121.2!3d24.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1s0x3468!2z55-z6ZaA5rC05bKp!5e0!3m2!1szh-TW!2stw!4v1',
        imageUrls: ['https://picsum.photos/seed/gujia/800/600'],
        farmGoal: '友善農法', area: 1.6, phosphorusReductionRate: 12, lastTested: '2024-10', status: 'approved', participatesInAdoption: true,
        history: [{ year: 114, detail: '加入計畫', areaChange: 1.6 }]
    },
    {
        id: 'farm-happy', userId: 'user-farm-happy', name: '幸福農場', personInCharge: '小農',
        email: 'happy@example.com', telephone: '', location: '大溪涵養區',
        city: '桃園市', district: '大溪區', crop: ['綠竹筍'],
        googleMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1!2d121.2!3d24.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1s0x3468!2z55-z6ZaA5rC05bKp!5e0!3m2!1szh-TW!2stw!4v1',
        imageUrls: ['https://picsum.photos/seed/happy/800/600'],
        farmGoal: '水源守護', area: 1, phosphorusReductionRate: 10, lastTested: '2024-11', status: 'approved', participatesInAdoption: true,
        history: [{ year: 114, detail: '加入計畫', areaChange: 1 }]
    },
    {
        id: 'farm-coop', userId: 'user-farm-coop', name: '合作農社', personInCharge: '代表',
        email: 'coop@example.com', telephone: '', location: '復興涵養區',
        city: '桃園市', district: '復興區', crop: ['友善蔬果'],
        googleMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1!2d121.2!3d24.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1s0x3468!2z55-z6ZaA5rC05bKp!5e0!3m2!1szh-TW!2stw!4v1',
        imageUrls: ['https://picsum.photos/seed/coop/800/600'],
        farmGoal: '集體保育', area: 0.5, phosphorusReductionRate: 8, lastTested: '2024-12', status: 'approved', participatesInAdoption: true,
        history: [{ year: 114, detail: '加入計畫', areaChange: 0.5 }]
    }

];

const siteContent: SiteContent = {
    homePage: {
        heroTitle: '石門水庫：<br/><span class="wc-text-gradient">水源地永續計畫</span>',
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
        contactPhone: '',
    },
    impact: {
        totalArea: 9.9,
        phosphorus: 25.3,
        carbon: 152,
        reservoirArea: 763,
        population: '300+'
    }
};

const CountUpNumber: React.FC<{ value: number; decimals?: number; duration?: number }> = ({ value, decimals = 0, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(progress * value);
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }, [value, duration]);
    return <span>{count.toFixed(decimals)}</span>;
};

const WaterConservation: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [corpData, setCorpData] = useState<Corporation[]>([]);
    const [farmerData, setFarmerData] = useState<Farmer[]>([]);
    const [partnershipData, setPartnershipData] = useState<Partnership[]>([]);
    const [content, setContent] = useState<SiteContent>(siteContent);
    const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
    const [selectedCorp, setSelectedCorp] = useState<Corporation | null>(null);
    const [activeSection, setActiveSection] = useState(0);

    const sections = [
        { id: 'hero', label: '首頁' },
        { id: 'story', label: '認識水庫' },
        { id: 'impact', label: '成果' },
        { id: 'farmers', label: '合作農場' },
        { id: 'corps', label: '支持企業' },
        { id: 'join', label: '參與' }
    ];

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [rawCorps, rawFarmers, rawPartnerships, rawSettings] = await Promise.all([
                    fetchCSV(SHEET_URLS.corporations),
                    fetchCSV(SHEET_URLS.farmers),
                    fetchCSV(SHEET_URLS.partnerships),
                    fetchCSV(SHEET_URLS.settings)
                ]);

                if (rawCorps.length > 0) setCorpData(mapSheetToCorps(rawCorps));
                if (rawFarmers.length > 0) setFarmerData(mapSheetToFarmers(rawFarmers));
                if (rawPartnerships.length > 0) setPartnershipData(rawPartnerships as any);
                if (rawSettings.length > 0) setContent(mapSheetToSettings(rawSettings));
            } catch (err) {
                console.error('Failed to load Google Sheets data, using static fallback.', err);
                setCorpData(corporations);
                setFarmerData(farmers);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = sections.findIndex(s => s.id === entry.target.id);
                    if (index !== -1) setActiveSection(index);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sections.forEach(s => {
            const el = document.getElementById(s.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [loading]);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const getFarmerName = (id: string) => [...farmerData, ...farmers].find(f => f.id === id)?.name || '未知農場';

    if (loading && corpData.length === 0) {
        return (
            <div className="h-screen bg-slate-950 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                <p className="text-sky-500 font-black animate-pulse">正在同步水源地即時數據...</p>
            </div>
        );
    }

    return (
        <div className="wc-snap-container wc-no-scrollbar bg-slate-950 text-slate-200">
            {/* Navigation Dots */}
            <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] hidden md:flex flex-col gap-4">
                {sections.map((s, idx) => (
                    <button
                        key={s.id}
                        onClick={() => scrollToSection(s.id)}
                        className="group flex items-center justify-end"
                        title={s.label}
                    >
                        <span className={`mr-4 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeSection === idx ? 'opacity-100 text-sky-400' : 'opacity-0 group-hover:opacity-100 text-slate-500'}`}>
                            {s.label}
                        </span>
                        <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${activeSection === idx ? 'bg-sky-400 scale-125 ring-4 ring-sky-400/20' : 'bg-slate-700 hover:bg-slate-500'}`}></div>
                    </button>
                ))}
            </div>

            {/* 1. Cinematic Hero */}
            <section id="hero" className="wc-snap-section bg-slate-950">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[3s] scale-110" style={{ backgroundImage: 'url("/shimen_hero.png")' }}>
                    <div className="absolute inset-0 wc-hero-overlay"></div>
                </div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
                    <div className="max-w-5xl wc-animate-fade-up">
                        <div className="mb-10 inline-flex p-3 rounded-2xl bg-sky-500/10 border border-sky-400/20 backdrop-blur-md">
                            <Droplets className="text-sky-400 h-8 w-8" />
                        </div>
                        <h1 className="text-white text-4xl md:text-[8rem] font-black leading-[0.9] tracking-tighter mb-10 wc-text-glow break-words" dangerouslySetInnerHTML={{ __html: content.homePage.heroTitle }}></h1>
                        <p className="text-sky-100/60 text-xl md:text-3xl font-light leading-relaxed max-w-3xl mx-auto mb-20" dangerouslySetInnerHTML={{ __html: content.homePage.heroSubtitle }}></p>
                        <a href={`mailto:${content.footer.contactEmail}`} className="inline-flex items-center gap-6 px-12 py-8 bg-sky-500 text-white rounded-full font-bold text-2xl shadow-2xl hover:bg-sky-400 hover:scale-105 transition-all">
                            立即參與計畫 <ArrowRight size={28} />
                        </a>
                    </div>
                </div>
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-30">
                    <ChevronDown className="animate-bounce h-8 w-8" />
                </div>
            </section>

            {/* 2. Story & Facts Section */}
            <section id="story" className="wc-snap-section bg-slate-50 text-slate-900 px-6 py-16 md:p-20 justify-center">
                <div className="max-w-xl mx-auto relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-1.5 w-16 bg-sky-500 rounded-full"></div>
                        <span className="text-sky-600 font-black text-xs tracking-[0.3em] uppercase">認識水庫</span>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 mb-8 leading-tight">{content.homePage.reservoirTitle}</h2>

                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200 border border-slate-100 mb-10 flex gap-6 items-center">
                        <div className="p-4 bg-sky-100 rounded-3xl text-sky-600 shrink-0">
                            <Mountain size={40} />
                        </div>
                        <p className="text-sky-900 font-bold leading-relaxed italic text-lg">
                            "{content.homePage.reservoirSubtitle}"
                        </p>
                    </div>

                    <p className="text-slate-600 text-lg leading-[2] mb-12">
                        {content.homePage.reservoirDescription}
                    </p>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-md border border-slate-50">
                            <p className="text-4xl font-black text-sky-500 mb-1 tracking-tighter">{content.impact.reservoirArea}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">集水區面積 (km²)</p>
                        </div>
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-md border border-slate-50">
                            <p className="text-4xl font-black text-sky-500 mb-1 tracking-tighter">{content.impact.population}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">供水人口 (萬)</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Impact Section (Bento Grid) */}
            <section id="impact" className="wc-snap-section bg-slate-950 px-6 pt-16 pb-24">
                <div className="max-w-7xl mx-auto w-full relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-7xl font-black text-white mb-4">永續影響力成果</h2>
                        <p className="text-slate-500 text-xl font-medium">數據見證守護水源的真實足跡</p>
                    </div>

                    <div className="wc-bento-grid">
                        <div className="col-span-12 md:col-span-8 wc-glass wc-glass-premium p-12 rounded-[3.5rem] flex flex-col justify-between wc-bento-card">
                            <div className="flex justify-between items-start mb-12">
                                <div className="p-4 bg-sky-500/20 text-sky-400 rounded-3xl"><BarChart3 size={32} /></div>
                                <span className="text-xs font-black text-sky-500/50 uppercase tracking-[0.3em]">Cumulative Area</span>
                            </div>
                            <div>
                                <p className="text-5xl md:text-7xl font-black text-white leading-none mb-4">
                                    <CountUpNumber value={content.impact.totalArea} decimals={1} />
                                </p>
                                <p className="text-base md:text-lg font-bold text-slate-400 uppercase tracking-widest">已認養總面積 (公頃)</p>
                            </div>
                        </div>

                        <div className="col-span-12 md:col-span-4 wc-glass wc-glass-premium p-12 rounded-[3.5rem] flex flex-col justify-between wc-bento-card bg-sky-500/10">
                            <div className="flex justify-between items-start mb-12">
                                <div className="p-4 bg-sky-500 text-white rounded-3xl"><Building2 size={32} /></div>
                            </div>
                            <div>
                                <p className="text-5xl md:text-7xl font-black text-white mb-2"><CountUpNumber value={corpData.length} /></p>
                                <p className="text-base md:text-lg font-bold text-slate-400 uppercase tracking-widest">支持企業數 (家)</p>
                            </div>
                        </div>

                        <div className="col-span-12 md:col-span-5 wc-glass wc-glass-premium p-12 rounded-[3.5rem] flex flex-col justify-between wc-bento-card">
                            <div className="flex justify-between items-start mb-8">
                                <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-3xl"><FlaskConical size={32} /></div>
                                <span className="text-emerald-400/50 text-[10px] font-black tracking-widest uppercase">Water Quality</span>
                            </div>
                            <div>
                                <p className="text-5xl md:text-7xl font-black text-emerald-400 mb-2"><CountUpNumber value={content.impact.phosphorus} decimals={1} />%</p>
                                <p className="text-base md:text-lg font-bold text-slate-400 uppercase tracking-widest">總磷削減率推估</p>
                            </div>
                        </div>

                        <div className="col-span-12 md:col-span-7 wc-glass wc-glass-premium p-12 rounded-[3.5rem] flex flex-col justify-between wc-bento-card">
                            <div className="flex justify-between items-start mb-8">
                                <div className="p-4 bg-indigo-500/20 text-indigo-400 rounded-3xl"><Trees size={32} /></div>
                                <span className="text-indigo-400/50 text-[10px] font-black tracking-widest uppercase">Climate Potential</span>
                            </div>
                            <div>
                                <p className="text-5xl md:text-7xl font-black text-indigo-400 mb-2"><CountUpNumber value={content.impact.carbon} /> <span className="text-xl">tons</span></p>
                                <p className="text-base md:text-lg font-bold text-slate-400 uppercase tracking-widest">年減碳潛力貢獻</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Partner Farms Section */}
            <section id="farmers" className="wc-snap-section bg-slate-50 flex items-center justify-center px-6 pt-32 pb-24">
                <div className="max-w-7xl mx-auto w-full relative z-10">
                    <div className="mb-20 text-center">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="h-1.5 w-12 bg-sky-500 rounded-full"></div>
                            <span className="text-sky-600 font-black text-xs tracking-[0.3em] uppercase">Practice Side</span>
                            <div className="h-1.5 w-12 bg-sky-500 rounded-full"></div>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-950 mb-6">合作農場</h2>
                        <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">從耕作到保育，他們在第一線守護北台灣的水源。</p>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
                        {farmerData.map((farmer) => (
                            <div
                                key={farmer.id}
                                onClick={() => setSelectedFarmer(farmer)}
                                className="cursor-pointer group relative overflow-hidden rounded-2xl aspect-square shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-xl bg-slate-200"
                            >
                                <img 
                                    src={farmer.imageUrls?.[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop'} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                    alt={farmer.name}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-4 flex flex-col justify-end">
                                    <h3 className="text-white font-black text-sm md:text-lg leading-tight">{farmer.name}</h3>
                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1 flex items-center gap-1"><MapPin size={10} /> {farmer.district}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Supporting Corporations Section */}
            <section id="corps" className="wc-snap-section bg-white flex items-center justify-center px-6 pt-32 pb-24 overflow-y-auto">
                <div className="max-w-7xl mx-auto w-full text-center relative z-10">
                    <div className="mb-16">
                        <span className="text-slate-400 font-black text-xs tracking-[0.3em] uppercase mb-4 block">Success Story</span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-950 mb-6">支持企業</h2>
                        <div className="h-1.5 w-20 bg-sky-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
                        {corpData.map(corp => (
                            <div 
                                key={corp.id} 
                                onClick={() => setSelectedCorp(corp)} 
                                className="group cursor-pointer flex flex-col items-center"
                            >
                                <div className="wc-logo-item aspect-square w-full flex items-center justify-center p-6 bg-slate-50 rounded-2xl group-hover:bg-sky-50 transition-all border border-slate-100">
                                    {corp.logoUrl ? (
                                        <img 
                                            src={corp.logoUrl} 
                                            className="max-w-[90%] max-h-[90%] object-contain mix-blend-multiply" 
                                            alt={corp.name} 
                                        />
                                    ) : (
                                        <div className="text-center p-2">
                                            <span className="text-xs font-black text-slate-400 group-hover:text-sky-600 transition-colors uppercase leading-tight">
                                                {corp.name}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Footer & CTA Section - Restored to Previous Detailed Style */}
            <section id="join" className="wc-snap-section bg-slate-950 text-white p-12 justify-center">
                <div className="max-w-xl mx-auto text-center relative z-10">
                    <div className="inline-block p-5 bg-sky-500/10 rounded-[2rem] border border-sky-500/20 mb-10">
                        <Droplets className="h-12 w-12 text-sky-400" />
                    </div>
                    <h2 className="text-4xl font-black mb-8 leading-tight tracking-tighter text-white">為下一代守護<br />每一滴純淨水源</h2>
                    <p className="text-slate-400 text-lg leading-relaxed mb-16 font-medium">
                        {content.footer.aboutUs}
                    </p>

                    <div className="flex flex-col gap-4 max-w-sm mx-auto">
                        <a href={`mailto:${content.footer.contactEmail}`} className="flex items-center justify-center gap-4 py-6 bg-sky-500 text-white rounded-[2rem] font-black text-xl shadow-[0_30px_60px_rgba(14,165,233,0.3)] active:scale-95 transition-all no-underline">
                            <Mail size={24} /> 聯繫合作專員
                        </a>
                    </div>

                    <div className="mt-24 pt-12 border-t border-white/5 text-[10px] font-black text-white/20 tracking-[0.8em] uppercase" dangerouslySetInnerHTML={{ __html: content.footer.copyright }}>
                    </div>
                </div>
            </section>



            {/* Modals Stacking */}
            <div className="fixed z-[999]">
                {selectedFarmer && <FarmerDetailModal farmer={selectedFarmer} onClose={() => setSelectedFarmer(null)} />}
                {selectedCorp && <CorporationDetailModal corporation={selectedCorp} partnerships={partnershipData.filter(p => p.corporationId === selectedCorp.id)} getFarmerName={getFarmerName} onClose={() => setSelectedCorp(null)} />}
            </div>
        </div>
    );
};

export default WaterConservation;
