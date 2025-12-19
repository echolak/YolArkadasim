
export type IncidentType = 
  | 'police' 
  | 'radar' 
  | 'accident' 
  | 'traffic' 
  | 'roadwork' 
  | 'weather' 
  | 'hazard' 
  | 'stopped_car' 
  | 'gas_price';

export interface Report {
  id: string;
  type: IncidentType;
  lat: number;
  lng: number;
  description: string;
  imageUrl?: string;
  timestamp: number;
  userId: string;
  userName: string;
  votes: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
}

export interface UserLocation {
  lat: number;
  lng: number;
  address?: string;
}

export enum AppTab {
  MAP = 'map',
  REPORTS = 'reports',
  CHAT = 'chat',
  AI = 'ai'
}

export interface NavigationState {
  isNavigating: boolean;
  destination: string | null;
  waypoints?: string[];
  eta: string | null;
  distance: string | null;
}

export interface UserProfile {
  nickname: string;
}
