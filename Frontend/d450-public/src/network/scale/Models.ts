export interface ScaleOption {
  value: number;
  label: string;
}

export interface ScaleListItem {
  id: string;
  name: string;
}

export interface ScaleDetails {
  id: string;
  name: string;
  hasNonsense: boolean;
  options: ScaleOption[];
}

export interface ScaleChangeRequest {
  name: string;
  hasNonsense: boolean;
  labels: string[];
}
