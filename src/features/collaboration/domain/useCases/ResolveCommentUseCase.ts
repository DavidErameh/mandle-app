import { CommentRepository } from '../../data/repositories/CommentRepository';

export class ResolveCommentUseCase {
  constructor(private commentRepo: CommentRepository) {}

  async execute(commentId: string, resolved: boolean): Promise<void> {
    await this.commentRepo.updateResolved(commentId, resolved);
  }
}
