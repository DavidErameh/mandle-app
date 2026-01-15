import { Comment } from '../entities/Comment';
import { CommentRepository } from '../../data/repositories/CommentRepository';

export class GetCommentsUseCase {
  constructor(private commentRepo: CommentRepository) {}

  async execute(draftId: string): Promise<Comment[]> {
    return await this.commentRepo.getByDraftId(draftId);
  }
}
