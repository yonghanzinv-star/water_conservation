export const fetchCSV = async (url: string) => {
    try {
        const response = await fetch(url);
        const text = await response.text();
        return parseCSV(text);
    } catch (error) {
        console.error('Error fetching CSV:', error);
        return [];
    }
};

const parseCSV = (csv: string) => {
    const lines = csv.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length === 0) return [];

    const headers = parseCSVLine(lines[0]);
    return lines.slice(1).map(line => {
        const values = parseCSVLine(line);
        const obj: any = {};
        headers.forEach((header, index) => {
            if (header) obj[header] = values[index];
        });
        return obj;
    });
};

// Handle quotes and escaped quotes in CSV
const parseCSVLine = (line: string) => {
    const result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                cur += '"'; // Doubled quote -> single quote
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(cur.trim());
            cur = '';
        } else {
            cur += char;
        }
    }
    result.push(cur.trim());
    return result;
};

const safeJsonParse = (str: string, fallback: any = []) => {
    if (!str || typeof str !== 'string') return fallback;
    
    // Advanced Cleanup: Replace smart quotes and handle non-standard chars
    const cleanStr = str
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'")
        .replace(/[，]/g, ",")
        .replace(/[：]/g, ":")
        .replace(/\uFEFF/g, "") // Remove BOM
        .replace(/\n/g, "\\n")
        // Remove non-printable characters except standard Chinese and ASCII range
        .replace(/[^\x20-\x7E\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef\\nt:,\[\]{}]/g, '')
        .trim();
    
    try {
        return JSON.parse(cleanStr);
    } catch (e) {
        // Last ditch effort: if it's trapped in extra quotes
        if (cleanStr.startsWith('"') && cleanStr.endsWith('"')) {
            const stripped = cleanStr.substring(1, cleanStr.length - 1).replace(/""/g, '"');
            return safeJsonParse(stripped, fallback);
        }
        console.warn('JSON Parse Error. Original:', str, 'Cleaned:', cleanStr);
        return fallback;
    }
};

export const mapSheetToCorps = (data: any[]): any[] => {
    return data.map(item => ({
        ...item,
        esgFocus: item.esgFocus ? item.esgFocus.split('|').map((s: string) => s.trim()) : [],
        manualRecords: safeJsonParse(item.manualRecords)
    }));
};

export const mapSheetToFarmers = (data: any[]): any[] => {
    return data.map(item => ({
        ...item,
        crop: item.crop ? item.crop.split('|').map((s: string) => s.trim()) : [],
        imageUrls: item.imageUrls ? item.imageUrls.split('|').map((s: string) => s.trim()) : [],
        history: safeJsonParse(item.history),
        area: parseFloat(item.area) || 0,
        carbonPotential: parseFloat(item.carbonPotential) || 0,
        phosphorusReductionRate: parseFloat(item.phosphorusReductionRate) || 0,
        participatesInAdoption: item.participatesInAdoption === 'TRUE' || item.participatesInAdoption === 'true'
    }));
};

export const mapSheetToSettings = (data: any[]): SiteContent => {
    const settings: any = { 
        homePage: {
            heroTitle: '石門水庫：<br/><span class="wc-text-gradient">水源地永續計畫</span>',
            heroSubtitle: '跨界合作守護北台灣生命之源<br/>推動集水區友善農業與水質保育',
            heroDescription: '石門水庫提供超過 300 萬人的民生用水，是台灣北部經濟與社會的核心。',
            partnersTitle: '守護家園的夥伴',
            partnersSubtitle: '企業與農民已共同投入環境優化工程',
            reservoirTitle: '認識石門水庫',
            reservoirSubtitle: '守護半世紀的生命之源',
            reservoirDescription: '石門水庫位於桃園市大漢溪中游，集水區廣達 763 平方公里。自 1964 年完工以來，承擔著灌溉、發電、防洪及供應數百萬人口用水的多重任務。',
            joinUsTitle: '攜手守護水源',
            joinUsSubtitle: '如果您是關注 ESG 的企業或農民，歡迎參與這場永續行動。'
        }, 
        footer: {
            aboutUs: '本計畫專注於透過友善耕作保護集水區環境，連結企業與農民。',
            contactEmail: 'yhansum@hetengtech.com',
            contactPhone: '',
            copyright: '&copy; 2024 Shimen Project. Water Sustainability Action.'
        }, 
        impact: {
            totalArea: 9.9,
            phosphorus: 25.3,
            carbon: 152,
            reservoirArea: 763,
            population: '300+'
        } 
    };

    data.forEach(item => {
        // Try to find Key/Value regardless of case or header existence
        const itemKeys = Object.keys(item);
        const rawKey = item.Key || item.key || (itemKeys[0]?.includes('.') ? itemKeys[0] : null);
        const rawValue = item.Value || item.value || (rawKey ? item[rawKey] : null);

        if (!rawKey) return;

        const [section, key] = rawKey.split('.');
        if (section && key && settings[section]) {
            if (section === 'impact' && key !== 'population') {
                const num = parseFloat(rawValue);
                if (!isNaN(num)) settings[section][key] = num;
            } else {
                settings[section][key] = rawValue;
            }
        }
    });
    
    return settings as SiteContent;
};
