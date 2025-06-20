import { PlantStage } from '@/types';

export const plantStages: PlantStage[] = [
  {
    id: 0,
    name: 'Seed',
    minPoints: 0,
    description: 'Your journey begins with a small seed',
  },
  {
    id: 1,
    name: 'Sprout',
    minPoints: 35, // +10 points
    description: 'First signs of growth are appearing',
  },
  {
    id: 2,
    name: 'Seedling',
    minPoints: 85, // +10 points
    description: 'Your plant is growing stronger',
  },
  {
    id: 3,
    name: 'Young Plant',
    minPoints: 160, // +10 points
    description: 'Healthy growth and development',
  },
  {
    id: 4,
    name: 'Mature Plant',
    minPoints: 310, // +10 points
    description: 'A thriving, mature plant',
  },
  {
    id: 5,
    name: 'Flowering Plant',
    minPoints: 510, // +10 points
    description: 'Beautiful blooms reward your dedication',
  },
  {
    id: 6,
    name: 'Tree',
    minPoints: 1010, // +10 points
    description: 'A mighty tree that helps clean the air',
  },
];

export function getCurrentPlantStage(totalPoints: number): PlantStage {
  for (let i = plantStages.length - 1; i >= 0; i--) {
    if (totalPoints >= plantStages[i].minPoints) {
      return plantStages[i];
    }
  }
  return plantStages[0];
}

export function getNextPlantStage(totalPoints: number): PlantStage | null {
  const currentStage = getCurrentPlantStage(totalPoints);
  const nextStageIndex = currentStage.id + 1;
  
  if (nextStageIndex < plantStages.length) {
    return plantStages[nextStageIndex];
  }
  
  return null;
}

export function getProgressToNextStage(totalPoints: number): number {
  const currentStage = getCurrentPlantStage(totalPoints);
  const nextStage = getNextPlantStage(totalPoints);
  
  if (!nextStage) return 1; // Already at max stage
  
  const pointsInCurrentRange = totalPoints - currentStage.minPoints;
  const pointsNeededForNext = nextStage.minPoints - currentStage.minPoints;
  
  return Math.min(pointsInCurrentRange / pointsNeededForNext, 1);
}