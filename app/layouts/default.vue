<script setup lang="ts">
const { t } = useI18n();
const { profile } = useAuthProfile();

const documentTitle = computed(() => t("adminPanel"));
useHead({
  title: documentTitle,
});
</script>

<template>
  <AppSidebar :permissions="profile?.permissions || []">
    <slot />
  </AppSidebar>
</template>
