import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface ChatBubbleProps {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatBubble({ text, isUser, timestamp }: ChatBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.botContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.botText]}>
          {text}
        </Text>
      </View>
      <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.botTimestamp]}>
        {formatTime(timestamp)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: width * 0.02,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  botContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    paddingHorizontal: width * 0.04,
    paddingVertical: width * 0.03,
    borderRadius: width * 0.05,
    marginBottom: width * 0.01,
  },
  userBubble: {
    backgroundColor: '#22C55E',
    borderBottomRightRadius: width * 0.01,
  },
  botBubble: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: width * 0.01,
  },
  text: {
    fontSize: width * 0.04,
    lineHeight: width * 0.055,
  },
  userText: {
    color: '#FFFFFF',
  },
  botText: {
    color: '#374151',
  },
  timestamp: {
    fontSize: width * 0.03,
    color: '#9CA3AF',
  },
  userTimestamp: {
    textAlign: 'right',
  },
  botTimestamp: {
    textAlign: 'left',
  },
});