<script setup lang="ts">
import type { ToasterProps } from "@nuxt/ui";

const toaster: ToasterProps = {
  position: "top-right",
  max: 1,
  progress: false,
};
</script>

<template>
  <UApp :toaster="toaster">
    <NuxtPage />
  </UApp>
</template>
