import { Note } from '../entities/Note';
import { NoteRepository } from '../../data/repositories/NoteRepository';

export class CreateNoteUseCase {
  constructor(private noteRepo: NoteRepository) {}

  async execute(content: string, tags: string[] = []): Promise<Note> {
    const note = new Note({
      content,
      tags,
      state: 'draft'
    });
    
    await this.noteRepo.save(note);
    return note;
  }
}
