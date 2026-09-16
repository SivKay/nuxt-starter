<script setup lang="ts">
const { locale, locales, setLocale } = useI18n();
</script>

<template>
  <div>
    <div class="flex items-center gap-2" :aria-label="$t('language')">
      <UButton
        v-for="item in locales"
        :key="item.code"
        :variant="locale === item.code ? 'solid' : 'outline'"
        size="sm"
        @click="setLocale(item.code)"
      >
        {{ item.name }}
      </UButton>
    </div>

    <div class="space-y-3">
      <h1 class="text-3xl font-bold">{{ $t("helloWorld") }}</h1>
      <UButton>{{ $t("continue") }}</UButton>
    </div>
  </div>
</template>
