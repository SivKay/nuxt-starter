<script setup lang="ts">
const { profile } = useAuthProfile();
</script>

<template>
  <AppSidebar :permissions="profile?.permissions || []">
    <slot />
  </AppSidebar>
</template>
