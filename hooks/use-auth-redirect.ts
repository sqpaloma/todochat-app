import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuthRedirect(targetPath: string = "/tasks") {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Small delay to ensure the session is fully established
      const timer = setTimeout(() => {
        router.push(targetPath);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isSignedIn, isLoaded, router, targetPath]);

  return { isSignedIn, isLoaded };
}
