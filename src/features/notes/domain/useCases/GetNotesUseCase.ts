import { Note } from '../entities/Note';
import { NoteRepository } from '../../data/repositories/NoteRepository';

export class GetNotesUseCase {
  constructor(private noteRepo: NoteRepository) {}

  async execute(filters?: { state?: string, search?: string }): Promise<Note[]> {
    let notes = await this.noteRepo.getAll();

    if (filters?.state) {
      notes = notes.filter(n => n.state === filters.state);
    }

    if (filters?.search) {
      const query = filters.search.toLowerCase();
      notes = notes.filter(n => 
        n.content.toLowerCase().includes(query) || 
        n.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    return notes;
  }
}
