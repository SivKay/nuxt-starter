<script setup lang="ts">
const props = defineProps<{
  total: number;
  pageSizeOptions?: number[];
}>();

const page = defineModel<number>("page", { required: true });
const limit = defineModel<number>("limit", { required: true });

const pageSizeOptions = ref([5, 10, 20, 50, 100]);

const range = computed(() => {
  if (props.total === 0) return { from: 0, to: 0 };

  const from = (page.value - 1) * limit.value + 1;

  return {
    from,
    to: Math.min(from + limit.value - 1, props.total),
  };
});

watch(limit, () => {
  page.value = 1;
});

watch(
  () => props.total,
  (total) => {
    const lastPage = Math.max(Math.ceil(total / limit.value), 1);

    if (page.value > lastPage) page.value = lastPage;
  },
);
</script>

<template>
  <div
    class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
  >
    <p class="text-sm text-muted">
      {{ $t("showingRecords", [range.from, range.to, total]) }}
    </p>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div class="flex items-center gap-2">
        <span class="whitespace-nowrap text-sm text-muted">
          {{ $t("rowsPerPage") }}
        </span>

        <USelect
          v-model="limit"
          :items="pageSizeOptions"
          class="w-20"
          :aria-label="$t('rowsPerPage')"
        />
      </div>

      <UPagination
        v-model:page="page"
        :total="total"
        :items-per-page="limit"
        size="sm"
        show-edges
      />
    </div>
  </div>
</template>
