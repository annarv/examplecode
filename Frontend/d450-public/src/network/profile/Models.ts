export interface ProfileInfo {
  id: string;
  name: string;
  competenceIds: string[];
}

export interface ProfileChangeRequest {
  name: string;
}

export interface ProfileSetCompetence {
  competenceId: string;
}
