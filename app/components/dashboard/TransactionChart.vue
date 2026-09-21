<script setup lang="ts">
import type { BulletLegendItemInterface } from "nuxt-charts/types";
import { CurveType, LegendPosition } from "nuxt-charts/enums";

type TransactionItem = {
  date: string;
  deposit: number;
  withdrawal: number;
};

const { t } = useI18n();

const transactionData: TransactionItem[] = [
  { date: "07-25", deposit: 8_200, withdrawal: 5_400 },
  { date: "07-26", deposit: 11_500, withdrawal: 7_200 },
  { date: "07-27", deposit: 9_800, withdrawal: 6_800 },
  { date: "07-28", deposit: 15_200, withdrawal: 9_300 },
  { date: "07-29", deposit: 13_600, withdrawal: 8_100 },
  { date: "07-30", deposit: 18_400, withdrawal: 12_500 },
  { date: "07-31", deposit: 16_900, withdrawal: 10_200 },
];

const categories = computed<Record<string, BulletLegendItemInterface>>(() => ({
  deposit: {
    name: t("deposit"),
    color: "var(--ui-success)",
  },
  withdrawal: {
    name: t("withdrawal"),
    color: "var(--ui-warning)",
  },
}));

function formatCompactAmount(value: number) {
  if (value >= 1_000_000) {
    return `${Number((value / 1_000_000).toFixed(1))}M`;
  }

  if (value >= 1_000) {
    return `${Number((value / 1_000).toFixed(1))}K`;
  }

  return String(value);
}
</script>

<template>
  <UCard>
    <template #header>
      <div>
        <h2 class="font-semibold text-highlighted">
          {{ $t("transactionOverview") }}
        </h2>
        <p class="text-sm text-muted">{{ $t("lastSevenDays") }}</p>
      </div>
    </template>

    <div class="transaction-chart px-3">
      <AreaChart
        :data="transactionData"
        :categories="categories"
        :height="320"
        x-axis="date"
        :y-domain="[0, undefined]"
        :y-formatter="formatCompactAmount"
        :y-num-ticks="5"
        :x-num-ticks="7"
        :curve-type="CurveType.MonotoneX"
        variant="gradient"
        :dot-size="3"
        :line-width="2"
        legend-variant="circle"
        tooltip-variant="frosted-glass"
        y-grid-line
        :x-grid-line="false"
        :aria-label="$t('transactionOverview')"
        :aria-description="$t('lastSevenDays')"
      />
    </div>
  </UCard>
</template>
<style scoped>
.transaction-chart :deep(.vcharts-surface) {
  overflow: visible;
}
</style>
