import { Note } from '../entities/Note';
import { NoteRepository } from '../../data/repositories/NoteRepository';

export interface SaveNoteParams {
  id?: string;
  content: string;
  tags?: string[];
  state?: 'draft' | 'ready' | 'generated' | 'posted' | 'archived';
  pillarId?: string;
}

export class SaveNoteUseCase {
  constructor(private noteRepo: NoteRepository) {}

  async execute(params: SaveNoteParams): Promise<Note> {
    let note: Note;

    if (params.id) {
       const existing = await this.noteRepo.findById(params.id);
       if (existing) {
         note = new Note({
           ...existing,
           content: params.content,
           tags: params.tags || existing.tags,
           state: params.state || existing.state,
           pillarId: params.pillarId || existing.pillarId,
           updatedAt: new Date()
         });
       } else {
         note = new Note({ ...params, tags: params.tags || [], state: params.state || 'draft' });
       }
    } else {
      note = new Note({
        content: params.content,
        tags: params.tags || [],
        state: params.state || 'draft',
        pillarId: params.pillarId
      });
    }

    await this.noteRepo.save(note);
    return note;
  }
}
