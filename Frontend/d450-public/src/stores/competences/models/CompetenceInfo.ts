export interface CompetenceInfo {
  id: string;
  code: string;
  name: string;
  description: string;
  indicators: CompetenceIndicator[];
}

export interface CompetenceIndicator {
  id: string;
  name: string;
}
