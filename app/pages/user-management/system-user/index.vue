<script setup lang="ts">
import { PERMISSION_MODULES } from "~/constants";

definePageMeta({
  middleware: "permission",
  permission: {
    module: PERMISSION_MODULES.user,
  },
});
</script>

<template>
  <h1>System User</h1>
</template>
