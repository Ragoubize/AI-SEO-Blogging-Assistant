
export enum Stage {
  MainKeywords = 1,
  SeedKeywords = 2,
  KeywordExpansion = 3,
  BlogCreation = 4,
}

export interface SeedKeyword {
  keyword: string;
  searchVolume: string;
  rankingDifficulty: string;
  cpc: string;
  blogPostTopic: string;
}

export interface ProductRecommendation {
  name: string;
  link: string;
  description: string;
}

export interface KeywordExpansionData {
  faqs: string[];
  coreKeywords: string[];
  secondaryKeywords: string[];
  productRecommendations: ProductRecommendation[];
}

export interface SelectedExpansionDetails {
  faqs: boolean;
  coreKeywords: boolean;
  secondaryKeywords: boolean;
  productRecommendations: boolean;
}

export interface BlogCreationDetails {
    mainKeyword: string;
    country: string;
    expansionData: KeywordExpansionData;
    selection: SelectedExpansionDetails;
}
