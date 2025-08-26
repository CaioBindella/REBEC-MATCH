import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Context
import { useAuth } from '@/context/AuthContext';

// Components
import ResearcherDashboard from '@/components/researcherComponents/ResearcherDashboard';
import Header from "@/components/reusable/Header";
import VolunteerDashboard from '@/components/volunteerComponents/VolunteerDashboard';

export default function HomePage() {
  const { user, isReady } = useAuth();
  console.log('User data:', user);
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        {user?.userType === 'VOLUNTARIO' && <VolunteerDashboard />}
        {user?.userType === undefined && <ResearcherDashboard />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
});
