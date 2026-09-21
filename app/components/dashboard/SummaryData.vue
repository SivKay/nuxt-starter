<script setup lang="ts">
const { t, locale } = useI18n();

const numberFormatter = computed(
  () =>
    new Intl.NumberFormat(locale.value === "km" ? "km-KH" : "en-US", {
      maximumFractionDigits: 2,
    }),
);

const summaryData = {
  availableBalance: 11_888_888.75,
  totalOrders: 888,
  totalDeposit: 888_530.75,
  totalWithdrawal: 8_530.75,
};

const summaryCards = computed(() => [
  {
    label: t("availableBalance"),
    value: numberFormatter.value.format(summaryData.availableBalance),
    suffix: "USD",
    icon: "i-lucide-wallet-cards",
    iconClass: "text-primary",
    iconContainerClass: "bg-primary/10",
  },
  {
    label: t("totalOrders"),
    value: numberFormatter.value.format(summaryData.totalOrders),
    icon: "i-lucide-clipboard-list",
    iconClass: "text-info",
    iconContainerClass: "bg-info/10",
  },
  {
    label: t("totalDeposit"),
    value: numberFormatter.value.format(summaryData.totalDeposit),
    suffix: "USD",
    icon: "i-lucide-circle-arrow-down",
    iconClass: "text-success",
    iconContainerClass: "bg-success/10",
  },
  {
    label: t("totalWithdrawal"),
    value: numberFormatter.value.format(summaryData.totalWithdrawal),
    suffix: "USD",
    icon: "i-lucide-circle-arrow-up",
    iconClass: "text-warning",
    iconContainerClass: "bg-warning/10",
  },
]);
</script>

<template>
  <section
    class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    :aria-label="$t('dashboardSummary')"
  >
    <UCard
      v-for="card in summaryCards"
      :key="card.label"
      :ui="{ body: 'flex items-center justify-between gap-4' }"
    >
      <div class="min-w-0 space-y-2">
        <p class="text-sm font-medium text-muted">
          {{ card.label }}
        </p>
        <p class="truncate text-xl font-semibold text-highlighted">
          {{ card.value }}
          <span v-if="card.suffix" class="text-xs font-medium text-muted">
            {{ card.suffix }}
          </span>
        </p>
      </div>

      <div
        class="flex size-12 shrink-0 items-center justify-center rounded-xl"
        :class="card.iconContainerClass"
      >
        <UIcon :name="card.icon" class="size-6" :class="card.iconClass" />
      </div>
    </UCard>
  </section>
</template>
