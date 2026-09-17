<script setup lang="ts">
import type { ButtonProps } from "@nuxt/ui";

const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmColor?: ButtonProps["color"];
    loading?: boolean;
  }>(),
  {
    confirmLabel: undefined,
    cancelLabel: undefined,
    confirmColor: "primary",
    loading: false,
  },
);

const emit = defineEmits<{
  confirm: [];
}>();

const open = defineModel<boolean>("open", { default: false });

function close() {
  if (!props.loading) {
    open.value = false;
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="title"
    :description="description"
    :dismissible="!loading"
    :close="!loading"
  >
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton
          color="neutral"
          variant="outline"
          :disabled="loading"
          @click="close"
        >
          {{ cancelLabel ?? $t("cancel") }}
        </UButton>

        <UButton
          :color="confirmColor"
          :loading="loading"
          :disabled="loading"
          @click="emit('confirm')"
        >
          {{ confirmLabel ?? $t("confirm") }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
