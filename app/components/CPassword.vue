<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const model = defineModel<string>();
const isVisible = ref(false);
</script>

<template>
  <UInput
    v-bind="$attrs"
    v-model="model"
    :type="isVisible ? 'text' : 'password'"
  >
    <template #trailing>
      <UButton
        type="button"
        color="neutral"
        variant="link"
        size="sm"
        :icon="isVisible ? 'i-lucide-eye-off' : 'i-lucide-eye'"
        :aria-label="$t(isVisible ? 'hidePassword' : 'showPassword')"
        :aria-pressed="isVisible"
        @click="isVisible = !isVisible"
      />
    </template>
  </UInput>
</template>
