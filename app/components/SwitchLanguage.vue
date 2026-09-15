<template>
  <div
    class="inline-flex h-9 items-center gap-1 rounded-lg bg-elevated p-1 ring ring-default"
    :aria-label="$t('language')"
  >
    <button
      v-for="item in locales"
      :key="item.code"
      type="button"
      :class="[
        'flex h-7 cursor-pointer items-center justify-center rounded-md px-2.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        locale === item.code
          ? 'bg-primary text-inverted shadow-sm'
          : 'text-muted hover:bg-accented hover:text-highlighted',
      ]"
      :aria-pressed="locale === item.code"
      @click="setLocale(item.code)"
    >
      {{ item.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n();
</script>
