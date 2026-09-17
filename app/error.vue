<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{
  error: NuxtError;
}>();

const { t } = useI18n();

const statusCode = computed(() => Number(props.error.statusCode || 500));

const errorContent = computed(() => {
  if (statusCode.value === 403) {
    return {
      title: t("accessDenied"),
      description: t("accessDeniedDescription"),
      icon: "i-lucide-shield-x",
    };
  }

  if (statusCode.value === 404) {
    return {
      title: t("pageNotFound"),
      description: t("pageNotFoundDescription"),
      icon: "i-lucide-file-question-mark",
    };
  }

  return {
    title: t("somethingWentWrong"),
    description: t("unexpectedErrorDescription"),
    icon: "i-lucide-circle-alert",
  };
});

const displayError = computed(() => ({
  statusCode: statusCode.value,
  statusMessage: errorContent.value.title,
  message: errorContent.value.description,
}));

const redirect = computed(() => (statusCode.value === 401 ? "/login" : "/"));

const clearButton = computed(() => ({
  label: statusCode.value === 401 ? t("backToLogin") : t("backToDashboard"),
  icon: statusCode.value === 401 ? "i-lucide-log-in" : "i-lucide-house",
}));
</script>

<template>
  <UApp>
    <div class="relative min-h-dvh">
      <div class="absolute end-4 top-4 z-10">
        <SwitchLanguage />
      </div>

      <UError
        :error="displayError"
        :icon="errorContent.icon"
        :redirect="redirect"
        :clear="clearButton"
        class="min-h-dvh"
      />
    </div>
  </UApp>
</template>
