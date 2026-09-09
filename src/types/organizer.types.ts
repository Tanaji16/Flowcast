export interface ZoneTelemetry {
  id: string;
  name: string;
  venueName: string;
  currentOccupancy: number;
  maxCapacity: number;
  occupancyRate: number;
  status: 'green' | 'yellow' | 'red';
  trend: 'rising' | 'steady' | 'declining';
}

export interface SimulationParams {
  scenarioName: string;
  intensityMultiplier: number;
  disruptedZoneId?: string;
  weatherCondition?: 'clear' | 'heavy_rain' | 'extreme_heat';
  transitDisruptionRate?: number;
}

export interface SimulationResult {
  simulatedAt: string;
  affectedZones: {
    zoneId: string;
    zoneName: string;
    projectedOccupancy: number;
    riskLevel: 'safe' | 'warning' | 'critical';
  }[];
  mitigationActions: string[];
}
