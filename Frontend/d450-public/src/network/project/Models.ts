import { ThreePosState } from '../ThreePosState';

export interface ProjectPage {
  entities: ProjectBrief[];
  page: number;
  pageSize: number;
  total: number;
}

export interface ProjectBrief {
  id: string;
  name: string;
  description: string;
  scaleId: string;
  isCalculated: boolean;
  publicState: ThreePosState;
  closedState: ThreePosState;
}

export interface ProjectDetails extends ProjectBrief {
  content: ProjectContent;
  calculation: ProjectCalculation;
}

export interface ProjectContent {
  scale: ProjectScale;
  profiles: ProjectProfile[];
  competences: ProjectCompetence[];
  roles: ProjectRole[];
}
export interface ProjectScale {
  original: string;
  options: ProjectScaleOption[];
  hasNonsense: boolean;
}
export interface ProjectProfile {
  original: string;
  name: string;
  competenceOriginales: string[];
}
export interface ProjectCompetence {
  original: string;
  name: string;
  indicators: ProjectIndicator[];
}
export interface ProjectRole {
  original: string;
  kind: string;
  name: string;
}
export interface ProjectScaleOption {
  value: number;
  label: string;
}
export interface ProjectCalculation {
  competenceCalculations: ProjectCompetenceCalculation[];
}
export interface ProjectCompetenceCalculation {
  competenceId: string;
  valueSeries: number[];
  roleCalculations: ProjectRoleCalculation[];
}
export interface ProjectRoleCalculation {
  roleId: string;
  valueSeries: number[];
}

export interface ProjectChangeRequest {
  name: string;
  description: string;
}

export interface ProjectIndicator {
  original: string;
  name: string;
}

export interface ProjectSetScaleRequest {
  scaleId: string;
}

export interface ProjectStats {
  progressPercentage: number;
  assignmentsCount: number;
  assessmentsCount: number;
  finishedAssignmentsCount: number;
  assessmentsClosedCount: number;
  assessmentsOpenedCount: number;
  assignmentsWithOpenSelfRoleCount: number;
}
