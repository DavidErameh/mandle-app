import { useState, useCallback, useEffect } from 'react';
import { BrandProfile } from '@/types/entities';
import { BrandProfileManager } from '@/core/brand/BrandProfileManager';

const brandManager = new BrandProfileManager();

export function useBrandProfile() {
  const [profile, setProfile] = useState<BrandProfile | null>(null);
  const [loading, setLoading] = useState(false);

  // In a real app we'd load this on mount. For the stub, we just load once.
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const data = await brandManager.getActiveProfile();
    setProfile(data);
    setLoading(false);
  };

  const updateProfile = async (updates: Partial<BrandProfile>) => {
    setLoading(true);
    await brandManager.updateProfile(updates);
    await loadProfile();
    setLoading(false);
  };

  return { profile, loading, refresh: loadProfile, updateProfile };
}
