<script setup lang="ts">
defineEmits<{
  toggleSidebar: [];
}>();

const openLogoutModal = ref(false);

const router = useRouter();
const { showError } = useCToast();
const { logout } = useAuth();
const logoutReq = useLogoutService();

const onLogout = async () => {
  try {
    await logoutReq.mutateAsync();
    logout();
    await router.push("/login");
  } catch (error: any) {
    showError(error?.message);
  }
};
</script>

<template>
  <header
    class="h-(--ui-header-height) shrink-0 flex items-center justify-between px-4 border-b border-default"
  >
    <UButton
      icon="i-lucide-panel-left"
      color="neutral"
      variant="ghost"
      :aria-label="$t('toggleSidebar')"
      @click="$emit('toggleSidebar')"
    />

    <div class="flex items-center gap-3">
      <SwitchLanguage />

      <UButton
        icon="i-lucide-log-out"
        size="md"
        color="neutral"
        variant="solid"
        :aria-label="$t('logout')"
        @click="openLogoutModal = true"
      />
    </div>

    <CConfirmModal
      v-model:open="openLogoutModal"
      :title="$t('logout')"
      :description="$t('logoutConfirmation')"
      :confirm-label="$t('logout')"
      confirm-color="error"
      :loading="logoutReq.isPending.value"
      @confirm="onLogout"
    />
  </header>
</template>
