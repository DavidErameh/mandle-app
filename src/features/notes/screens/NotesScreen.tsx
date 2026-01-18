import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StatusBar, 
  TouchableOpacity, 
  TextInput,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotes } from '../hooks/useNotes';
import { NoteCard } from '../components/NoteCard';
import { AddNoteModal } from '../components/AddNoteModal';
import { MagnifyingGlassIcon, PlusIcon } from 'react-native-heroicons/outline';
import Animated, { FadeIn, FadeInUp, Layout } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export default function NotesScreen() {
  const { 
    notes, 
    loading, 
    refresh, 
    saveNote, 
    deleteNote, 
    markReady, 
    search, 
    setSearch, 
    activeTab, 
    setActiveTab 
  } = useNotes();

  const [modalVisible, setModalVisible] = useState(false);

  const handleCreateNote = async (content: string, tags: string[], pillarId?: string) => {
    await saveNote(content, tags, pillarId);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const tabs: ('draft' | 'ready' | 'posted' | 'archived')[] = ['draft', 'ready', 'posted', 'archived'];

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <StatusBar barStyle="light-content" />
      
      <View className="flex-1 px-md pt-lg">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-3xl font-display text-text-primary">Library</Text>
        </View>

        {/* Search */}
        <Animated.View entering={FadeInUp.delay(100)} className="mb-6">
          <View className="flex-row items-center bg-primary-secondary rounded-2xl px-4 py-3 border border-frosted/10 h-14">
            <MagnifyingGlassIcon size={20} color="rgba(255,255,255,0.4)" />
            <TextInput
              placeholder="Search your ideas or tags..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={search}
              onChangeText={setSearch}
              className="flex-1 ml-3 text-text-primary text-body"
            />
          </View>
        </Animated.View>

        {/* Tabs */}
        <View className="flex-row mb-6 bg-primary-dark/40 p-1.5 rounded-2xl border border-frosted/5">
          {tabs.map(tab => (
            <TouchableOpacity 
              key={tab}
              onPress={() => {
                setActiveTab(tab);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className={`flex-1 py-3 rounded-xl items-center ${
                activeTab === tab ? 'bg-secondary/20 border border-secondary/30' : ''
              }`}
            >
              <Text className={`text-[11px] font-bold uppercase tracking-wider ${
                activeTab === tab ? 'text-secondary' : 'text-text-tertiary'
              }`}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* List */}
        <FlatList
          data={notes}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInUp.delay(index * 50)} layout={Layout.springify()}>
              <NoteCard 
                note={item} 
                onMarkReady={(id) => {
                  markReady(id);
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }}
                onDelete={(id) => {
                  deleteNote(id);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
              />
            </Animated.View>
          )}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} tintColor="#1D9BF0" />
          }
          ListEmptyComponent={
            <Animated.View entering={FadeIn.delay(300)} className="mt-20 items-center">
              <Text className="text-center text-text-tertiary font-body mb-2">
                No ideas found in {activeTab}
              </Text>
              {activeTab === 'draft' && (
                <Text className="text-caption text-text-disabled">Capture your first raw thought!</Text>
              )}
            </Animated.View>
          }
        />
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity 
        onPress={() => {
          setModalVisible(true);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
        className="absolute bottom-10 right-8 w-16 h-16 bg-secondary rounded-full items-center justify-center shadow-2xl elevation-8 border border-white/20"
      >
        <PlusIcon size={32} color="#FFFFFF" strokeWidth={3} />
      </TouchableOpacity>

      <AddNoteModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleCreateNote}
      />
    </SafeAreaView>
  );
}
