import { NoteRepository } from './src/features/notes/data/repositories/NoteRepository';
import { SaveNoteUseCase } from './src/features/notes/domain/useCases/SaveNoteUseCase';
import { GetNotesUseCase } from './src/features/notes/domain/useCases/GetNotesUseCase';
import { UpdateNoteStateUseCase } from './src/features/notes/domain/useCases/UpdateNoteStateUseCase';
import { SQLiteService } from './src/core/database/sqlite';

async function testNotes() {
    console.log('--- STARTING NOTES SYSTEM TEST ---');
    
    await SQLiteService.init();
    const repo = new NoteRepository();
    const saveUC = new SaveNoteUseCase(repo);
    const getUC = new GetNotesUseCase(repo);
    const updateUC = new UpdateNoteStateUseCase(repo);

    // 1. Create a draft note
    console.log('1. Creating draft note...');
    const note = await saveUC.execute({
        content: 'Test idea about AI Agents',
        tags: ['ai', 'tech'],
        pillarId: 'pillar-1'
    });
    console.log('Created:', note.content, 'State:', note.state);

    // 2. Fetch it
    console.log('2. Fetching notes...');
    const allNotes = await getUC.execute();
    const found = allNotes.find(n => n.id === note.id);
    console.log('Found in list:', found ? 'YES' : 'NO');

    // 3. Mark Ready
    console.log('3. Marking as Ready...');
    await updateUC.execute(note.id, 'ready');
    const updated = await repo.findById(note.id);
    console.log('Updated State:', updated?.state);

    // 4. Search by tag
    console.log('4. Searching by tag "tech"...');
    const searchResults = await getUC.execute({ search: 'tech' });
    console.log('Search matches:', searchResults.length);

    // 5. Filter by state
    console.log('5. Filtering by state "ready"...');
    const readyNotes = await getUC.execute({ state: 'ready' });
    console.log('Ready notes count:', readyNotes.length);

    if (updated?.state === 'ready' && searchResults.find(n => n.id === note.id)) {
        console.log('✅ TEST PASSED: Note lifecycle and search functional.');
    } else {
        console.log('❌ TEST FAILED: Note state or search failed.');
    }
}

testNotes().catch(console.error);
