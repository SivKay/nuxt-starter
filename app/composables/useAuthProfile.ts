import type { IUserProfile } from "~/types/userProfile";
import AuthService from "~/services/authService";

export function useAuthProfile() {
  const profile = useState<IUserProfile | null>("auth-profile", () => null);
  const isLoading = useState("auth-profile-loading", () => false);
  const error = useState<string | null>("auth-profile-error", () => null);

  async function fetchProfile(force = false) {
    if (profile.value && !force) {
      return profile.value;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const data = await AuthService().getProfile();
      profile.value = data;
      return data;
    } catch (cause: unknown) {
      error.value =
        cause instanceof Error ? cause.message : "Unable to load profile";
      throw cause;
    } finally {
      isLoading.value = false;
    }
  }

  function clearProfile() {
    profile.value = null;
    error.value = null;
    isLoading.value = false;
  }

  return {
    profile: profile,
    isLoading: isLoading,
    error: error,
    fetchProfile,
    clearProfile,
  };
}
