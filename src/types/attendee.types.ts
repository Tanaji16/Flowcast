export interface ItineraryItem {
  id: string;
  title: string;
  location: string;
  zoneId: string;
  startTime: string;
  endTime: string;
  congestionStatus: 'low' | 'moderate' | 'high';
  isAlternativeSuggested?: boolean;
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  originalZone: string;
  alternativeZone: string;
  incentive?: string;
  estimatedWaitDifferenceMinutes: number;
}
