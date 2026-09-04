import React, { useState, useEffect } from 'react';
import type { Corporation, Farmer, Partnership, SiteContent } from './types';
import { Building2, Droplets, MapPin, Mountain, Mail, BarChart3, FlaskConical, Globe, Trees, ExternalLink, ArrowRight, Target, ChevronRight, Menu, X } from 'lucide-react';
import FarmerDetailModal from './FarmerDetailModal';
import CorporationDetailModal from './CorporationDetailModal';
import { fetchCSV, mapSheetToCorps, mapSheetToFarmers, mapSheetToSettings } from '../../utils/googleSheets';

// ============================
// Google Sheets CSV URLs
// ============================
const SHEET_URLS = {
    corporations: 'https://docs.google.com/spreadsheets/d/1wdB4XIfiqclj0spILEeIudVLSD7vMn9HiUfKW4b-Lpg/export?format=csv&gid=1720908014',
    farmers: 'https://docs.google.com/spreadsheets/d/1wdB4XIfiqclj0spILEeIudVLSD7vMn9HiUfKW4b-Lpg/export?format=csv&gid=2022674934',
    partnerships: 'https://docs.google.com/spreadsheets/d/1wdB4XIfiqclj0spILEeIudVLSD7vMn9HiUfKW4b-Lpg/export?format=csv&gid=2059297580',
    settings: 'https://docs.google.com/spreadsheets/d/1wdB4XIfiqclj0spILEeIudVLSD7vMn9HiUfKW4b-Lpg/export?format=csv&gid=234898130'
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
    
    // Default fallback content
    const [content, setContent] = useState<SiteContent>({
        homePage: {
            heroTitle: '石門水庫水源地永續計畫',
            heroSubtitle: '跨界合作守護北台灣生命之源',
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
            copyright: '© 2024 Shimen Project'
        },
        impact: {
            totalArea: 9.9, phosphorus: 25.3, carbon: 152, reservoirArea: 763, population: '300+', communityAssociations: 2, communityColleges: 1
        }
    });

    const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
    const [selectedCorp, setSelectedCorp] = useState<Corporation | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');

    const navLinks = [
        { id: 'hero', label: '首頁' },
        { id: 'story', label: '認識計畫' },
        { id: 'impact', label: '影響力數據' },
        { id: 'farmers', label: '合作農場' },
        { id: 'corps', label: '支持企業' }
    ];

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [rawCorps, rawFarmers, rawPartnerships, rawSettings] = await Promise.all([
                    fetchCSV(SHEET_URLS.corporations), fetchCSV(SHEET_URLS.farmers), fetchCSV(SHEET_URLS.partnerships), fetchCSV(SHEET_URLS.settings)
                ]);
                if (rawCorps.length > 0) setCorpData(mapSheetToCorps(rawCorps));
                if (rawFarmers.length > 0) setFarmerData(mapSheetToFarmers(rawFarmers));
                if (rawPartnerships.length > 0) setPartnershipData(rawPartnerships as any);
                if (rawSettings.length > 0) setContent(mapSheetToSettings(rawSettings));
            } catch (err) {
                console.error('Failed to load Google Sheets data.', err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, { threshold: 0.3 });

        navLinks.forEach(link => {
            const el = document.getElementById(link.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [loading]);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
        setMobileMenuOpen(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium tracking-wider">載入資料中...</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen text-slate-800 font-sans">
            {/* Header */}
            <header className="wc-header fixed top-0 w-full z-[100] transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('hero')}>
                            <div className="bg-sky-600 text-white p-2 rounded-lg">
                                <Droplets size={24} />
                            </div>
                            <span className="font-bold text-xl text-slate-800 tracking-tight hidden sm:block">跨域共好 水源守護</span>
                            <span className="font-bold text-xl text-slate-800 tracking-tight sm:hidden">水源永續計畫</span>
                        </div>
                        
                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map(link => (
                                <button 
                                    key={link.id} 
                                    onClick={() => scrollTo(link.id)}
                                    className={`wc-nav-link text-[15px] ${activeSection === link.id ? 'active' : ''}`}
                                >
                                    {link.label}
                                </button>
                            ))}
                            <a href={`mailto:${content.footer.contactEmail}`} className="px-5 py-2.5 bg-sky-600 text-white font-medium rounded-md hover:bg-sky-700 transition-colors shadow-sm">
                                聯絡我們
                            </a>
                        </nav>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center md:hidden">
                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600 p-2">
                                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Mobile Nav */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-b border-slate-200 shadow-lg absolute w-full">
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            {navLinks.map(link => (
                                <button 
                                    key={link.id}
                                    onClick={() => scrollTo(link.id)}
                                    className="block w-full text-left px-4 py-3 text-base font-medium text-slate-700 hover:text-sky-600 hover:bg-sky-50 rounded-md"
                                >
                                    {link.label}
                                </button>
                            ))}
                            <a href={`mailto:${content.footer.contactEmail}`} className="block w-full text-center mt-4 px-4 py-3 bg-sky-600 text-white font-medium rounded-md">
                                聯絡我們
                            </a>
                        </div>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section id="hero" className="wc-hero wc-section-alt pt-20">
                <div className="wc-hero-bg"></div>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="wc-hero-content wc-fade-in">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-sm font-bold mb-6">
                            <Mountain size={16} /> 北台灣生命之源
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-6" dangerouslySetInnerHTML={{ __html: content.homePage.heroTitle.replace('水源地永續計畫', '跨域共好 水源守護') }}></h1>
                        <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: `${content.homePage.heroSubtitle}<br/>${content.homePage.heroDescription}` }} />
                        <div className="flex flex-wrap gap-4">
                            <button onClick={() => scrollTo('impact')} className="px-8 py-3.5 bg-sky-600 text-white font-medium rounded-md shadow-md hover:bg-sky-700 hover:shadow-lg transition-all flex items-center gap-2">
                                觀看計畫成果 <ArrowRight size={18} />
                            </button>
                            <button onClick={() => scrollTo('story')} className="px-8 py-3.5 bg-white text-slate-700 border border-slate-300 font-medium rounded-md hover:bg-slate-50 transition-all">
                                了解更多
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section id="story" className="wc-section wc-section-light">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                        <div>
                            <h2 className="wc-section-title">{content.homePage.reservoirTitle}</h2>
                            <h3 className="text-2xl font-bold text-slate-800 mb-6">{content.homePage.reservoirSubtitle}</h3>
                            <p className="text-slate-600 text-lg leading-loose mb-8">
                                {content.homePage.reservoirDescription}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="wc-card p-8 border-l-4 border-l-sky-500">
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">集水區面積 (km²)</p>
                                <p className="text-5xl font-black text-sky-600">{content.impact.reservoirArea}</p>
                            </div>
                            <div className="wc-card p-8 border-l-4 border-l-teal-500">
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">供水人口 (萬)</p>
                                <p className="text-5xl font-black text-teal-600">{content.impact.population}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Dashboard */}
            <section id="impact" className="wc-section wc-section-alt">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">永續影響力成果</h2>
                        <p className="text-lg text-slate-500">數據見證守護水源的真實足跡</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="wc-stat-card border-t-4 border-t-sky-500">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm font-bold text-slate-500">已推動總面積 (公頃)</p>
                                    <p className="wc-stat-value text-sky-600"><CountUpNumber value={content.impact.totalArea} decimals={1} /></p>
                                </div>
                                <div className="wc-stat-icon bg-sky-50 text-sky-600"><BarChart3 size={24} /></div>
                            </div>
                        </div>
                        <div className="wc-stat-card border-t-4 border-t-teal-500">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm font-bold text-slate-500">總磷削減率推估 (%)</p>
                                    <p className="wc-stat-value text-teal-600"><CountUpNumber value={content.impact.phosphorus} decimals={1} /></p>
                                </div>
                                <div className="wc-stat-icon bg-teal-50 text-teal-600"><FlaskConical size={24} /></div>
                            </div>
                        </div>
                        <div className="wc-stat-card border-t-4 border-t-emerald-500">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm font-bold text-slate-500">年減碳潛力貢獻 (kgCO2e/公頃)</p>
                                    <p className="wc-stat-value text-emerald-600"><CountUpNumber value={content.impact.carbon} /></p>
                                </div>
                                <div className="wc-stat-icon bg-emerald-50 text-emerald-600"><Trees size={24} /></div>
                            </div>
                        </div>
                        
                        <div className="wc-stat-card border-t-4 border-t-amber-500">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm font-bold text-slate-500">合作社區發展協會 (個)</p>
                                    <p className="wc-stat-value text-amber-500"><CountUpNumber value={content.impact.communityAssociations} /></p>
                                </div>
                                <div className="wc-stat-icon bg-amber-50 text-amber-500"><Target size={24} /></div>
                            </div>
                        </div>
                        <div className="wc-stat-card border-t-4 border-t-purple-500">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm font-bold text-slate-500">合作社區大學 (所)</p>
                                    <p className="wc-stat-value text-purple-600"><CountUpNumber value={content.impact.communityColleges} /></p>
                                </div>
                                <div className="wc-stat-icon bg-purple-50 text-purple-600"><Globe size={24} /></div>
                            </div>
                        </div>
                        <div className="wc-stat-card border-t-4 border-t-blue-500">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm font-bold text-slate-500">支持企業數 (家)</p>
                                    <p className="wc-stat-value text-blue-600"><CountUpNumber value={corpData.length} /></p>
                                </div>
                                <div className="wc-stat-icon bg-blue-50 text-blue-600"><Building2 size={24} /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Farmers Section */}
            <section id="farmers" className="wc-section wc-section-light">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                        <div>
                            <h2 className="wc-section-title">合作農場</h2>
                            <p className="text-slate-600">從耕作到保育，他們在第一線守護北台灣的水源。</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {farmerData.map((farmer) => (
                            <div
                                key={farmer.id}
                                onClick={() => setSelectedFarmer(farmer)}
                                className="wc-card cursor-pointer group"
                            >
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img 
                                        src={farmer.imageUrls?.[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop'} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                        alt={farmer.name}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop';
                                        }}
                                    />
                                </div>
                                <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-slate-800">{farmer.name}</h3>
                                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MapPin size={12} /> {farmer.district}</p>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-300 group-hover:text-sky-500 transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Corporations Section */}
            <section id="corps" className="wc-section wc-section-alt border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">響應企業</h2>
                        <p className="text-slate-500">攜手投入石門水庫水源保育行動</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {corpData.map(corp => (
                            <div 
                                key={corp.id} 
                                onClick={() => setSelectedCorp(corp)} 
                                className="cursor-pointer group relative"
                            >
                                <div className="wc-logo-container relative overflow-hidden flex flex-col justify-center items-center">
                                    <div className="w-full h-full flex items-center justify-center transform transition-transform duration-300 group-hover:-translate-y-3">
                                        {corp.logoUrl ? (
                                            <img src={corp.logoUrl} alt={corp.name} />
                                        ) : (
                                            <span className="font-bold text-sm text-slate-400 text-center">{corp.name}</span>
                                        )}
                                    </div>
                                    {/* Hover Name Slide-Up */}
                                    <div className="absolute bottom-0 left-0 right-0 p-2 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <div className="bg-white/95 backdrop-blur-md border border-slate-100 shadow-sm rounded-md py-1.5 px-2 flex justify-center">
                                            <span className="text-slate-800 font-bold text-xs md:text-sm text-center truncate">{corp.name}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="join" className="bg-slate-900 text-slate-300 py-16 border-t-4 border-sky-600">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <div className="flex items-center gap-2 text-white mb-6">
                                <Droplets size={24} className="text-sky-400" />
                                <span className="font-bold text-xl">跨域共好 水源守護</span>
                            </div>
                            <p className="text-slate-400 leading-relaxed mb-8 max-w-md">
                                {content.footer.aboutUs}
                            </p>
                            <a href={`mailto:${content.footer.contactEmail}`} className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white font-medium rounded-md hover:bg-sky-500 transition-colors">
                                <Mail size={18} /> 聯絡合作專員
                            </a>
                        </div>
                        <div className="flex flex-col md:items-end justify-between">
                            <div className="space-y-2 text-sm text-slate-400 md:text-right">
                                <p>聯絡信箱：{content.footer.contactEmail}</p>
                            </div>
                            <div className="mt-12 text-xs text-slate-600" dangerouslySetInnerHTML={{ __html: content.footer.copyright }}></div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Modals */}
            {selectedFarmer && <FarmerDetailModal farmer={selectedFarmer} onClose={() => setSelectedFarmer(null)} />}
            {selectedCorp && <CorporationDetailModal corporation={selectedCorp} partnerships={partnershipData.filter(p => p.corporationId === selectedCorp.id)} getFarmerName={fId => farmerData.find(f => f.id === fId)?.name || ''} onClose={() => setSelectedCorp(null)} />}
        </div>
    );
};

export default WaterConservation;
