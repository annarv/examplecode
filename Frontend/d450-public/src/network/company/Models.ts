export interface CompanyPageItem {
  id: string;
  name: string;
}

export interface CompanySummary {
  id: string;
  name: string;
}

export interface CompanyStoreState {
  companyPage: CompanyPage;
  selectedCompany?: CompanySummary;
}

export interface CompanyPage {
  entities: CompanyPageItem[];
  page: number;
  pageSize: number;
  total: number;
}
