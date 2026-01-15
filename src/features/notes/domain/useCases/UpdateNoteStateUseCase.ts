import { NoteRepository } from '../../data/repositories/NoteRepository';
import { Note } from '../entities/Note';

export class UpdateNoteStateUseCase {
  constructor(private noteRepo: NoteRepository) {}

  async execute(id: string, state: 'draft' | 'ready' | 'generated' | 'posted' | 'archived'): Promise<Note | null> {
    const note = await this.noteRepo.findById(id);
    if (!note) return null;

    const updatedNote = new Note({
      ...note,
      state,
      updatedAt: new Date()
    });

    await this.noteRepo.save(updatedNote);
    return updatedNote;
  }
}
