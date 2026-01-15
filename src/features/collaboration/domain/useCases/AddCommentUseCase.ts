import { Comment } from '../entities/Comment';
import { CommentRepository } from '../../data/repositories/CommentRepository';

export class AddCommentUseCase {
  constructor(private commentRepo: CommentRepository) {}

  async execute(params: { 
    draftId: string; 
    content: string; 
    author: 'creator' | 'assistant' 
  }): Promise<Comment> {
    const comment = new Comment({
      draftId: params.draftId,
      content: params.content,
      author: params.author
    });

    await this.commentRepo.save(comment);

    // AI Mention Detection
    if (params.content.toLowerCase().includes('@assistant') && params.author === 'creator') {
      console.log('--- @assistant mentioned in comment! ---');
      // In a real implementation, this would trigger the AI agent logic
      // to generate a reply. For now, we'll mark this for integration.
    }

    return comment;
  }
}
