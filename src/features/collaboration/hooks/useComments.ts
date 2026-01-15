import { useState, useCallback } from 'react';
import { useCollaboration } from '@/core/di/CollaborationContext';
import { Comment } from '../domain/entities/Comment';

export const useComments = (draftId: string) => {
  const { getComments, addComment, resolveComment } = useCollaboration();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!draftId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getComments(draftId);
      setComments(data);
    } catch (err) {
      setError('Failed to load comments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [draftId, getComments]);

  const postComment = async (content: string) => {
    try {
      const newComment = await addComment({ draftId, content, author: 'creator' });
      setComments(prev => [...prev, newComment as Comment]);
    } catch (err) {
      setError('Failed to post comment');
      console.error(err);
    }
  };

  const toggleResolve = async (commentId: string, currentResolved: boolean) => {
    try {
      await resolveComment(commentId, !currentResolved);
      setComments(prev => prev.map(c => {
        if (c.id === commentId) {
          // Create a new Comment instance with updated resolved status
          return new Comment({
            ...c,
            resolved: !currentResolved
          });
        }
        return c;
      }));
    } catch (err) {
      setError('Failed to update comment');
      console.error(err);
    }
  };

  return {
    comments,
    loading,
    error,
    fetchComments,
    postComment,
    toggleResolve
  };
};
