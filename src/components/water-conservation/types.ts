export interface Corporation {
    id: string;
    userId: string;
    name: string;
    taxId: string;
    website: string;
    city: string;
    district: string;
    industry: string;
    logoUrl: string;
    esgFocus: string[];
    contactEmail: string;
    contactPhone: string;
    status: 'pending' | 'approved' | 'rejected';
    manualRecords?: { year: number; detail: string }[];
}

export interface Farmer {
    id: string;
    userId: string;
    name: string;
    personInCharge: string;
    email: string;
    telephone: string;
    location: string;
    city: string;
    district: string;
    crop: string[];
    googleMapEmbedUrl: string;
    imageUrls: string[];
    farmGoal: string;
    carbonPotential: number;
    needs: string;
    area: number;
    phosphorusReductionRate: number;
    lastTested: string;
    status: 'pending' | 'approved' | 'rejected' | 'unlisted';
    participatesInAdoption: boolean;
    history?: { year: number; detail: string; areaChange?: number }[];
}

export interface Partnership {
    id: string;
    corporationId: string;
    farmerId: string;
    adoptionYear: number;
    adoptedArea: number;
    status: 'pending' | 'confirmed';
}

export interface HomePageContent {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    partnersTitle: string;
    partnersSubtitle: string;
    reservoirTitle: string;
    reservoirSubtitle: string;
    reservoirDescription: string;
    joinUsTitle: string;
    joinUsSubtitle: string;
}

export interface FooterContent {
    aboutUs: string;
    contactEmail: string;
    contactPhone: string;
    copyright: string;
}

export interface ImpactContent {
    totalArea: number;
    phosphorus: number;
    carbon: number;
    reservoirArea: number;
    population: string;
    communityAssociations: number;
    communityColleges: number;
}

export interface SiteContent {
    homePage: HomePageContent;
    footer: FooterContent;
    impact: ImpactContent;
}
