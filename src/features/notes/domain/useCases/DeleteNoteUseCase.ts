import { NoteRepository } from '../../data/repositories/NoteRepository';

export class DeleteNoteUseCase {
  constructor(private noteRepo: NoteRepository) {}

  async execute(id: string): Promise<void> {
    await this.noteRepo.delete(id);
  }
}
