import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Sprout, TreePine, Flower, Trees, Seed } from 'lucide-react-native';
import { PlantStage } from '@/types';

interface PlantGraphicProps {
  stage: PlantStage;
  size?: number;
}

export function PlantGraphic({ stage, size = 120 }: PlantGraphicProps) {
  const getPlantIcon = () => {
    const iconProps = {
      size: size,
      color: '#22C55E',
      strokeWidth: 2,
    };

    switch (stage.id) {
      case 0:
        // Use a simple circle icon for seed stage as fallback
        return (
          <View style={[styles.seedIcon, { width: size * 0.6, height: size * 0.6 }]}>
            <View style={[styles.seedDot, { width: size * 0.3, height: size * 0.3 }]} />
          </View>
        );
      case 1:
        return <Sprout {...iconProps} color="#65A30D" />;
      case 2:
        return <Sprout {...iconProps} color="#22C55E" />;
      case 3:
        return <TreePine {...iconProps} color="#16A34A" />;
      case 4:
        return <TreePine {...iconProps} color="#15803D" />;
      case 5:
        return <Flower {...iconProps} color="#EC4899" />;
      case 6:
        return <Trees {...iconProps} color="#166534" />;
      default:
        return (
          <View style={[styles.seedIcon, { width: size * 0.6, height: size * 0.6 }]}>
            <View style={[styles.seedDot, { width: size * 0.3, height: size * 0.3 }]} />
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, { width: size + 40, height: size + 40 }]}>
      <View style={[styles.plantContainer, { width: size + 20, height: size + 20 }]}>
        {getPlantIcon()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  plantContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#BBF7D0',
  },
  seedIcon: {
    backgroundColor: '#8B5A2B',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  seedDot: {
    backgroundColor: '#A0522D',
    borderRadius: 100,
  },
});