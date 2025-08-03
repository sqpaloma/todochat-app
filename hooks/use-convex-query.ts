import { useQuery } from "convex/react";
import { FunctionReference, FunctionArgs } from "convex/server";
import { useMemo } from "react";

interface ConvexQueryOptions {
  enabled?: boolean;
  refetchInterval?: number;
  onError?: (error: Error) => void;
  onSuccess?: (data: any) => void;
}

interface ConvexQueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

// Wrapper hook para queries Convex com error handling e loading states
export function useConvexQuery<Query extends FunctionReference<"query">>(
  query: Query,
  args: FunctionArgs<Query>,
  options: ConvexQueryOptions = {}
): ConvexQueryResult<Query["_returnType"]> {

  const { enabled = true, onError, onSuccess } = options;

  // Use Convex query apenas se enabled
  const data = useQuery(enabled ? query : undefined, enabled ? args : undefined);

  const result = useMemo(() => {
    const isLoading = data === undefined;
    const isError = false; // Convex doesn't expose error state directly
    
    // Trigger callbacks
    if (data !== undefined && onSuccess) {
      onSuccess(data);
    }

    return {
      data,
      isLoading,
      isError,
      error: null,
      refetch: () => {
        // Convex queries refetch automatically
        // This is a placeholder for consistency with React Query API
      },
    };
  }, [data, onSuccess]);

  return result;
}

// Hook específico para queries que podem retornar null/undefined
export function useConvexQueryWithDefault<Query extends FunctionReference<"query">>(
  query: Query,
  args: FunctionArgs<Query>,
  defaultValue: Query["_returnType"],
  options: ConvexQueryOptions = {}
): ConvexQueryResult<Query["_returnType"]> {
  
  const result = useConvexQuery(query, args, options);

  return useMemo(() => ({
    ...result,
    data: result.data ?? defaultValue,
  }), [result, defaultValue]);
}

// Hook para múltiplas queries relacionadas
export function useConvexQueries<T extends Record<string, any>>(
  queries: T
): { [K in keyof T]: ConvexQueryResult<any> } & { isLoading: boolean; hasError: boolean } {
  
  const results = useMemo(() => {
    const queryResults = {} as any;
    let allLoading = false;
    let hasError = false;

    for (const [key, query] of Object.entries(queries)) {
      const result = useConvexQuery(query.query, query.args, query.options);
      queryResults[key] = result;
      
      if (result.isLoading) allLoading = true;
      if (result.isError) hasError = true;
    }

    return {
      ...queryResults,
      isLoading: allLoading,
      hasError,
    };
  }, [queries]);

  return results;
}

// Exemplo de uso:
/*
// Query única
const { data: tasks, isLoading } = useConvexQuery(
  api.tasks.getTasks, 
  { teamId: "team-1" },
  { 
    enabled: !!teamId,
    onSuccess: (data) => console.log('Tasks loaded:', data.length) 
  }
);

// Query com valor padrão
const { data: members } = useConvexQueryWithDefault(
  api.teams.getMembers,
  { teamId },
  []
);

// Múltiplas queries
const { tasks, members, isLoading } = useConvexQueries({
  tasks: {
    query: api.tasks.getTasks,
    args: { teamId },
  },
  members: {
    query: api.teams.getMembers,
    args: { teamId },
  },
});
*/