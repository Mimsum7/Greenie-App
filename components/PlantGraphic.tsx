import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Sprout, TreePine, Flower, Trees } from 'lucide-react-native';
import { PlantStage } from '@/types';

const { width } = Dimensions.get('window');

interface PlantGraphicProps {
  stage: PlantStage;
  size?: number;
}

export function PlantGraphic({ stage, size = width * 0.3 }: PlantGraphicProps) {
  const getPlantIcon = () => {
    const iconProps = {
      size: size,
      color: '#22C55E',
      strokeWidth: 2,
    };

    switch (stage.id) {
      case 0:
        // Use the new seed.png image for stage 0
        return (
          <Image
            source={require('@/assets/images/seed.png')}
            style={{ width: size, height: size }}
            resizeMode="contain"
          />
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
          <Image
            source={require('@/assets/images/seed.png')}
            style={{ width: size, height: size }}
            resizeMode="contain"
          />
        );
    }
  };

  return (
    <View style={[styles.container, { width: size + width * 0.1, height: size + width * 0.1 }]}>
      <View style={[styles.plantContainer, { width: size + width * 0.05, height: size + width * 0.05 }]}>
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
});