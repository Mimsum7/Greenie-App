interface ActivityEmission {
  type: string;
  factor: number; // kg CO2 per unit
  unit: string;
}

const emissionFactors: ActivityEmission[] = [
  { type: 'car', factor: 0.21, unit: 'km' },
  { type: 'transit', factor: 0.089, unit: 'km' },
  { type: 'shower', factor: 0.5, unit: 'minutes' },
  { type: 'cooking', factor: 0.3, unit: 'hours' },
  { type: 'waste', factor: 1.2, unit: 'kg' },
];

export function calculateCarbonFootprint(
  activityType: string,
  quantity: number
): number {
  const factor = emissionFactors.find(f => f.type === activityType);
  if (!factor) return 0;
  
  return Math.round((quantity * factor.factor) * 100) / 100;
}

export function getActivityUnit(activityType: string): string {
  const factor = emissionFactors.find(f => f.type === activityType);
  return factor?.unit || 'units';
}

export function getActivityTypes() {
  return [
    { id: 'car', name: 'Car Commute', icon: 'Car', unit: 'km' },
    { id: 'transit', name: 'Public Transit', icon: 'Train', unit: 'km' },
    { id: 'shower', name: 'Hot Shower', icon: 'ShowerHead', unit: 'minutes' },
    { id: 'cooking', name: 'Gas Cooking', icon: 'ChefHat', unit: 'hours' },
    { id: 'waste', name: 'Waste', icon: 'Trash2', unit: 'kg' },
  ];
}