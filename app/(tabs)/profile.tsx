import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Bell, CircleHelp as HelpCircle, FileText, Shield, LogOut, CreditCard as Edit2 } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { state, dispatch } = useApp();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(state.user?.name || '');
  const [editedEmail, setEditedEmail] = useState(state.user?.email || '');

  const user = state.user;

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const handleSaveProfile = () => {
    if (!editedName.trim() || !editedEmail.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    dispatch({
      type: 'UPDATE_USER_PROFILE',
      payload: {
        name: editedName.trim(),
        email: editedEmail.trim(),
      },
    });

    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handlePreferenceUpdate = (key: string, value: any) => {
    dispatch({
      type: 'UPDATE_USER_PROFILE',
      payload: { [key]: value },
    });
  };

  const handleNotificationToggle = (key: string, value: boolean) => {
    const updatedSettings = {
      ...user.notificationSettings,
      [key]: value,
    };
    
    dispatch({
      type: 'UPDATE_USER_PROFILE',
      payload: { notificationSettings: updatedSettings },
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch({ type: 'LOGOUT' });
            router.replace('/auth');
          },
        },
      ]
    );
  };

  const dietOptions = [
    { value: 'omnivore', label: 'Omnivore' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'pescatarian', label: 'Pescatarian' },
  ];

  const commuteOptions = [
    { value: 'car', label: 'Car' },
    { value: 'transit', label: 'Public Transit' },
    { value: 'bike', label: 'Bike/Walk' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F0FDF4', '#DCFCE7']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>Manage your account and preferences</Text>
          </View>

          {/* Personal Info */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <User size={20} color="#22C55E" />
              <Text style={styles.sectionTitle}>Personal Information</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(!isEditing)}
              >
                <Edit2 size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.profileCard}>
              <View style={styles.avatar}>
                <User size={32} color="#22C55E" />
              </View>
              
              {isEditing ? (
                <View style={styles.editForm}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Name</Text>
                    <TextInput
                      style={styles.input}
                      value={editedName}
                      onChangeText={setEditedName}
                      placeholder="Enter your name"
                    />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput
                      style={styles.input}
                      value={editedEmail}
                      onChangeText={setEditedEmail}
                      placeholder="Enter your email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  
                  <View style={styles.editActions}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => {
                        setIsEditing(false);
                        setEditedName(user.name);
                        setEditedEmail(user.email);
                      }}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleSaveProfile}
                    >
                      <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{user.name}</Text>
                  <Text style={styles.profileEmail}>{user.email}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Preferences */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Preferences</Text>
            </View>

            <View style={styles.preferenceCard}>
              <Text style={styles.preferenceLabel}>Diet Preference</Text>
              <View style={styles.optionsContainer}>
                {dietOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      user.dietPreference === option.value && styles.selectedOption
                    ]}
                    onPress={() => handlePreferenceUpdate('dietPreference', option.value)}
                  >
                    <Text style={[
                      styles.optionText,
                      user.dietPreference === option.value && styles.selectedOptionText
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.preferenceCard}>
              <Text style={styles.preferenceLabel}>Commute Preference</Text>
              <View style={styles.optionsContainer}>
                {commuteOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      user.commutePreference === option.value && styles.selectedOption
                    ]}
                    onPress={() => handlePreferenceUpdate('commutePreference', option.value)}
                  >
                    <Text style={[
                      styles.optionText,
                      user.commutePreference === option.value && styles.selectedOptionText
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.preferenceCard}>
              <Text style={styles.preferenceLabel}>Daily Carbon Goal</Text>
              <View style={styles.goalInputContainer}>
                <TextInput
                  style={styles.goalInput}
                  value={user.dailyCarbonGoal.toString()}
                  onChangeText={(text) => {
                    const value = parseFloat(text);
                    if (!isNaN(value) && value > 0) {
                      handlePreferenceUpdate('dailyCarbonGoal', value);
                    }
                  }}
                  keyboardType="numeric"
                />
                <Text style={styles.goalUnit}>kg CO₂/day</Text>
              </View>
            </View>
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Bell size={20} color="#22C55E" />
              <Text style={styles.sectionTitle}>Notifications</Text>
            </View>

            <View style={styles.notificationCard}>
              <View style={styles.notificationItem}>
                <Text style={styles.notificationLabel}>Daily Tip</Text>
                <Switch
                  value={user.notificationSettings.dailyTip}
                  onValueChange={(value) => handleNotificationToggle('dailyTip', value)}
                  trackColor={{ false: '#E5E7EB', true: '#BBF7D0' }}
                  thumbColor={user.notificationSettings.dailyTip ? '#22C55E' : '#F3F4F6'}
                />
              </View>
              
              <View style={styles.notificationItem}>
                <Text style={styles.notificationLabel}>Goal Achievement</Text>
                <Switch
                  value={user.notificationSettings.goalMet}
                  onValueChange={(value) => handleNotificationToggle('goalMet', value)}
                  trackColor={{ false: '#E5E7EB', true: '#BBF7D0' }}
                  thumbColor={user.notificationSettings.goalMet ? '#22C55E' : '#F3F4F6'}
                />
              </View>
              
              <View style={styles.notificationItem}>
                <Text style={styles.notificationLabel}>Streak Milestones</Text>
                <Switch
                  value={user.notificationSettings.streakMilestone}
                  onValueChange={(value) => handleNotificationToggle('streakMilestone', value)}
                  trackColor={{ false: '#E5E7EB', true: '#BBF7D0' }}
                  thumbColor={user.notificationSettings.streakMilestone ? '#22C55E' : '#F3F4F6'}
                />
              </View>
            </View>
          </View>

          {/* Support & About */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Support & About</Text>
            </View>

            <View style={styles.menuCard}>
              <TouchableOpacity style={styles.menuItem}>
                <HelpCircle size={20} color="#6B7280" />
                <Text style={styles.menuItemText}>Help Center</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem}>
                <FileText size={20} color="#6B7280" />
                <Text style={styles.menuItemText}>Terms of Service</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem}>
                <Shield size={20} color="#6B7280" />
                <Text style={styles.menuItemText}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
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
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#166534',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    flex: 1,
  },
  editButton: {
    padding: 8,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  editForm: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#FFFFFF',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#22C55E',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  preferenceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  preferenceLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  selectedOption: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  goalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  goalInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#FFFFFF',
  },
  goalUnit: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  notificationLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
});