"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isMarketingPath } from "@/lib/routes/marketingPaths";
import { authMeQueryKey, fetchAuthSession } from "@/lib/api/authSessionQuery";
import { logoutAuthLogoutPostMutation } from "@/lib/api/generated/@tanstack/react-query.gen";
import type { UserResponse } from "@/lib/api/generated/types.gen";

export type AuthUser = UserResponse;

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const shouldFetchMe = pathname === "/" || !isMarketingPath(pathname);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: authMeQueryKey(),
    queryFn: ({ signal }) => fetchAuthSession(signal),
    enabled: shouldFetchMe,
    retry: false,
    staleTime: 30_000,
  });

  const user = data?.user ?? null;
  const loading = shouldFetchMe ? isLoading || isFetching : false;

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: authMeQueryKey() });
  }, [queryClient]);

  const logoutMutation = useMutation({
    ...logoutAuthLogoutPostMutation(),
    onSettled: () => {
      queryClient.setQueryData(authMeQueryKey(), null);
      void queryClient.invalidateQueries({ queryKey: authMeQueryKey() });
    },
  });

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync({});
  }, [logoutMutation]);

  const value = useMemo(
    () => ({
      user,
      loading,
      refresh,
      logout,
    }),
    [user, loading, refresh, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
