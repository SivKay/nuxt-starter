<script setup lang="ts">
const {
  data: profileData,
  isPending: isProfilePending,
  isError: isProfileError,
  refetch: refetchProfile,
} = useProfileService();
</script>

<template>
  <div
    v-if="isProfilePending"
    class="flex min-h-dvh items-center justify-center gap-3"
  >
    <UIcon name="i-lucide-loader-circle" class="size-6 animate-spin" />
    <span>{{ $t("loadingProfile") }}</span>
  </div>

  <div
    v-else-if="isProfileError"
    class="flex min-h-dvh flex-col items-center justify-center gap-4 p-4 text-center"
  >
    <UIcon name="i-lucide-circle-alert" class="size-8 text-error" />
    <p>{{ $t("unableToLoadProfile") }}</p>
    <UButton icon="i-lucide-refresh-cw" @click="refetchProfile()">
      {{ $t("retry") }}
    </UButton>
  </div>

  <AppSidebar
    v-show="!isProfilePending && !isProfileError"
    :permissions="profileData?.permissions || []"
  >
    <slot />
  </AppSidebar>
</template>
