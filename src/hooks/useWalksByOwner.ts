import { useEffect, useState } from 'react';
import walksOwnerApi, { WalkOwnerResponse } from '@/core/infrastructure/api/walksOwner.api';
import { ApiError } from '@/core/types/api.types';

export const useWalksByOwner = (ownerId: number) => {
  const [walks, setWalks] = useState<WalkOwnerResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

    const fetchWalks = async () => {
    if (!ownerId) return;
    try {
        setLoading(true);
        console.log('Fetching walks for owner', ownerId);
        const data = await walksOwnerApi.getWalksByOwner(ownerId);
        console.log('Walks received:', data);
        setWalks(data);
    } catch (err) {
      const customError = err as ApiError;
      setError(customError.error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalks();
  }, [ownerId]);

  return { walks, loading, error, refetchWalks: fetchWalks };
};