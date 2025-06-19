import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, Paperclip } from 'lucide-react-native';
import { ChatBubble } from '@/components/ChatBubble';
import { useApp } from '@/contexts/AppContext';

const { width, height } = Dimensions.get('window');

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
        colors={['#C0F0C0', '#A6E6A6']}
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
                placeholderTextColor="#777777"
                multiline
                maxLength={500}
              />
              <TouchableOpacity style={styles.attachButton}>
                <Paperclip size={width * 0.05} color="#545454" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.sendButton, inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Send size={width * 0.05} color="#FFFFFF" />
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
    paddingVertical: width * 0.04,
    paddingHorizontal: width * 0.05,
    borderBottomWidth: 1,
    borderBottomColor: '#B8B8B8',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  title: {
    fontSize: width * 0.05,
    fontFamily: 'Inter-Bold',
    color: '#0F4A1A',
    marginBottom: width * 0.005,
  },
  subtitle: {
    fontSize: width * 0.035,
    fontFamily: 'Inter-Medium',
    color: '#545454',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: width * 0.05,
    paddingBottom: height * 0.12,
  },
  typingIndicator: {
    alignSelf: 'flex-start',
    maxWidth: '80%',
    marginVertical: width * 0.02,
  },
  typingBubble: {
    backgroundColor: '#E6E6E6',
    paddingHorizontal: width * 0.04,
    paddingVertical: width * 0.03,
    borderRadius: width * 0.05,
    borderBottomLeftRadius: width * 0.01,
  },
  typingText: {
    fontSize: width * 0.035,
    fontFamily: 'Inter-Medium',
    color: '#545454',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: width * 0.05,
    paddingVertical: width * 0.04,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#B8B8B8',
    gap: width * 0.03,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderRadius: width * 0.06,
    borderWidth: 1,
    borderColor: '#A8A8A8',
    paddingHorizontal: width * 0.04,
    paddingVertical: width * 0.02,
    maxHeight: height * 0.12,
  },
  textInput: {
    flex: 1,
    fontSize: width * 0.04,
    fontFamily: 'Inter-Regular',
    color: '#2A3A2A',
    paddingVertical: width * 0.02,
    textAlignVertical: 'center',
  },
  attachButton: {
    padding: width * 0.02,
    marginLeft: width * 0.02,
  },
  sendButton: {
    width: width * 0.11,
    height: width * 0.11,
    borderRadius: width * 0.055,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#1B8B3B',
  },
  sendButtonInactive: {
    backgroundColor: '#A8A8A8',
  },
});