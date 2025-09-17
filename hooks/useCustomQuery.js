import { useQuery, useMutation } from '@tanstack/react-query';

// Custom hook for more advanced query management
export const useCustomQuery = (
  queryKey, 
  queryFn, 
  {
    enabled = true,
    staleTime = 1000 * 60 * 5, // 5 minutes
    cacheTime = 1000 * 60 * 30, // 30 minutes
    retry = 3,
    retryDelay = (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onSuccess,
    onError,
  } = {}
) => {
  return useQuery({
    queryKey,
    queryFn,
    enabled,
    staleTime,
    cacheTime,
    retry,
    retryDelay,
    onSuccess: (data) => {
      console.log(`Query ${queryKey} successful:`, data);
      onSuccess && onSuccess(data);
    },
    onError: (error) => {
      console.error(`Query ${queryKey} failed:`, error);
      onError && onError(error);
    },
    // Optional: Add suspense support
    suspense: true,
  });
};

// Mutation hook for more advanced mutations
export const useCustomMutation = (
  mutationFn,
  {
    onSuccess,
    onError,
    onSettled,
  } = {}
) => {
  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      console.log('Mutation successful:', data);
      onSuccess && onSuccess(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('Mutation failed:', error);
      onError && onError(error, variables, context);
    },
    onSettled: (data, error, variables, context) => {
      console.log('Mutation settled');
      onSettled && onSettled(data, error, variables, context);
    },
  });
};
