import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, Paperclip } from 'lucide-react-native';
import { ChatBubble } from '@/components/ChatBubble';
import { useApp } from '@/contexts/AppContext';

export default function ChatScreen() {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const { state, dispatch } = useApp();

  const messages = state.chatMessages;

  useEffect(() => {
    // Load initial daily tip if no messages
    if (messages.length === 0) {
      loadDailyTip();
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const loadDailyTip = async () => {
    const tipMessage = {
      id: Date.now().toString(),
      text: "Hey there 🌍! I'm Greenie, your carbon-cutting companion! To get started, tell me one thing you did today — even something small like walking instead of driving or skipping plastic. Ready?",
      isUser: false,
      timestamp: new Date(),
    };

    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: tipMessage });
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage });
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText.trim());
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: aiMessage });
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('tip') || input.includes('advice')) {
      return "Here are some quick eco-friendly tips: 🚴‍♀️ Choose biking over driving for short trips, 🥗 Try meatless Monday, 💡 Switch to LED bulbs, and ♻️ always recycle! What area would you like to improve most?";
    } else if (input.includes('carbon') || input.includes('footprint')) {
      return "Your current carbon footprint looks good! To reduce it further, consider: reducing meat consumption, using public transport, and being mindful of energy usage. Small changes add up to make a big impact! 🌍";
    } else if (input.includes('help') || input.includes('how')) {
      return "I'm here to help you on your sustainability journey! I can provide eco-tips, help track your progress, suggest improvements, and answer questions about reducing your carbon footprint. What would you like to know?";
    } else if (input.includes('plant') || input.includes('grow')) {
      return "Your plant is growing beautifully! 🌱 Keep completing your daily habits to help it thrive. Each habit you complete earns points that help your plant grow from a seed to a mighty tree!";
    } else if (input.includes('streak') || input.includes('habit')) {
      return "Great job on maintaining your habits! 🔥 Consistency is key to creating lasting change. Keep up your streak by focusing on one habit at a time, and don't forget to celebrate your progress!";
    } else if (input.includes('errand') || input.includes('trip') || input.includes('efficient')) {
      return "🚗 Why it matters: Short, separate car trips burn more fuel because engines use the most fuel when cold. By grouping tasks (like grocery shopping, pharmacy, and picking someone up), your car runs more efficiently and produces fewer emissions.\n\n🌍 Carbon savings: You can cut 1–2 kg of CO₂ in a single day just by optimizing your driving pattern!\n\nWould you like some more green advice to make your day Greenie-r?";
    } else {
      return "That's interesting! As your eco-coach, I'm here to help you make sustainable choices. Whether it's reducing your carbon footprint, building green habits, or staying motivated, I've got tips and encouragement for you! 🌱 What sustainability goal are you working on?";
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#C0F0C0', '#A6E6A6']} // 20% darker greens
        style={styles.gradient}
      >
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Greenie</Text>
            <Text style={styles.subtitle}>Your carbon coach</Text>
          </View>

          {/* Chat Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                text={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            
            {isTyping && (
              <View style={styles.typingIndicator}>
                <View style={styles.typingBubble}>
                  <Text style={styles.typingText}>Greenie is typing...</Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input Toolbar */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask Greenie..."
                placeholderTextColor="#777777" // 20% darker
                multiline
                maxLength={500}
              />
              <TouchableOpacity style={styles.attachButton}>
                <Paperclip size={20} color="#545454" /> {/* 20% darker gray */}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.sendButton, inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Send size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#B8B8B8', // 20% darker border
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#0F4A1A', // 20% darker green
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#545454', // 20% darker gray
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 100,
  },
  typingIndicator: {
    alignSelf: 'flex-start',
    maxWidth: '80%',
    marginVertical: 8,
  },
  typingBubble: {
    backgroundColor: '#E6E6E6', // 20% darker background
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
  },
  typingText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#545454', // 20% darker gray
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#B8B8B8', // 20% darker border
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#A8A8A8', // 20% darker border
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2A3A2A', // 20% darker gray
    paddingVertical: 8,
    textAlignVertical: 'center',
  },
  attachButton: {
    padding: 8,
    marginLeft: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#1B8B3B', // 20% darker green
  },
  sendButtonInactive: {
    backgroundColor: '#A8A8A8', // 20% darker gray
  },
});