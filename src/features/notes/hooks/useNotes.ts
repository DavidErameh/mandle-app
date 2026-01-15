import { useState, useEffect, useCallback } from 'react';
import { Note } from '../domain/entities/Note';
import { useNotesContext } from '@/core/di/NotesContext';

export function useNotes() {
  const { getNotesUseCase, saveNoteUseCase, deleteNoteUseCase, updateNoteStateUseCase } = useNotesContext();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'draft' | 'ready' | 'posted' | 'archived'>('draft');

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getNotesUseCase.execute({ 
        state: activeTab,
        search 
      });
      setNotes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [getNotesUseCase, activeTab, search]);

  const saveNote = useCallback(async (content: string, tags: string[] = [], pillarId?: string, id?: string) => {
    try {
      await saveNoteUseCase.execute({ id, content, tags, pillarId });
      await refresh();
    } catch (e) {
      console.error(e);
    }
  }, [saveNoteUseCase, refresh]);

  const deleteNote = useCallback(async (id: string) => {
    try {
      await deleteNoteUseCase.execute(id);
      await refresh();
    } catch (e) {
      console.error(e);
    }
  }, [deleteNoteUseCase, refresh]);

  const markReady = useCallback(async (id: string) => {
    try {
      await updateNoteStateUseCase.execute(id, 'ready');
      await refresh();
    } catch (e) {
      console.error(e);
    }
  }, [updateNoteStateUseCase, refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { 
    notes, 
    saveNote, 
    deleteNote, 
    markReady, 
    refresh, 
    loading,
    search,
    setSearch,
    activeTab,
    setActiveTab
  };
}
