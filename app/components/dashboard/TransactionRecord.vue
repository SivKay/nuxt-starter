<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";

type TransactionType = "DEPOSIT" | "WITHDRAWAL";
type TransactionStatus = "SUCCESS" | "PENDING" | "FAILED";

type TransactionRecord = {
  transaction_id: string;
  amount: number;
  card_number: string;
  transaction_type: TransactionType;
  status: TransactionStatus;
  created_at: string;
  updated_at: string;
};

const { t, locale } = useI18n();
const search = ref("");
const page = ref(1);
const limit = ref(5);

const records: TransactionRecord[] = [
  { transaction_id: "TXN-20250731-001", amount: 2_450, card_number: "**** **** **** 4821", transaction_type: "DEPOSIT", status: "SUCCESS", created_at: "2025-07-31T09:20:00", updated_at: "2025-07-31T09:21:12" },
  { transaction_id: "TXN-20250731-002", amount: 780.5, card_number: "**** **** **** 1139", transaction_type: "WITHDRAWAL", status: "PENDING", created_at: "2025-07-31T08:45:00", updated_at: "2025-07-31T08:45:00" },
  { transaction_id: "TXN-20250730-003", amount: 5_100, card_number: "**** **** **** 7740", transaction_type: "DEPOSIT", status: "SUCCESS", created_at: "2025-07-30T16:10:00", updated_at: "2025-07-30T16:11:08" },
  { transaction_id: "TXN-20250730-004", amount: 1_250, card_number: "**** **** **** 9024", transaction_type: "WITHDRAWAL", status: "FAILED", created_at: "2025-07-30T14:32:00", updated_at: "2025-07-30T14:33:17" },
  { transaction_id: "TXN-20250729-005", amount: 940.25, card_number: "**** **** **** 3368", transaction_type: "DEPOSIT", status: "SUCCESS", created_at: "2025-07-29T11:18:00", updated_at: "2025-07-29T11:19:03" },
  { transaction_id: "TXN-20250729-006", amount: 3_600, card_number: "**** **** **** 6502", transaction_type: "WITHDRAWAL", status: "SUCCESS", created_at: "2025-07-29T10:05:00", updated_at: "2025-07-29T10:06:22" },
  { transaction_id: "TXN-20250728-007", amount: 12_000, card_number: "**** **** **** 2477", transaction_type: "DEPOSIT", status: "PENDING", created_at: "2025-07-28T17:40:00", updated_at: "2025-07-28T17:40:00" },
  { transaction_id: "TXN-20250728-008", amount: 525, card_number: "**** **** **** 8914", transaction_type: "WITHDRAWAL", status: "SUCCESS", created_at: "2025-07-28T13:12:00", updated_at: "2025-07-28T13:13:31" },
  { transaction_id: "TXN-20250727-009", amount: 7_840.75, card_number: "**** **** **** 5683", transaction_type: "DEPOSIT", status: "SUCCESS", created_at: "2025-07-27T15:27:00", updated_at: "2025-07-27T15:28:46" },
  { transaction_id: "TXN-20250727-010", amount: 2_100, card_number: "**** **** **** 4206", transaction_type: "WITHDRAWAL", status: "FAILED", created_at: "2025-07-27T09:54:00", updated_at: "2025-07-27T09:55:09" },
  { transaction_id: "TXN-20250726-011", amount: 4_300, card_number: "**** **** **** 7315", transaction_type: "DEPOSIT", status: "SUCCESS", created_at: "2025-07-26T18:06:00", updated_at: "2025-07-26T18:07:14" },
  { transaction_id: "TXN-20250726-012", amount: 675.5, card_number: "**** **** **** 1842", transaction_type: "WITHDRAWAL", status: "SUCCESS", created_at: "2025-07-26T12:38:00", updated_at: "2025-07-26T12:39:28" },
];

const filteredRecords = computed(() => {
  const keyword = search.value.trim().toLowerCase();

  if (!keyword) return records;

  return records.filter((record) =>
    [
      record.transaction_id,
      record.card_number,
      record.transaction_type,
      record.status,
      String(record.amount),
    ].some((value) => value.toLowerCase().includes(keyword)),
  );
});

const paginatedRecords = computed(() => {
  const start = (page.value - 1) * limit.value;
  return filteredRecords.value.slice(start, start + limit.value);
});

const currencyFormatter = computed(
  () =>
    new Intl.NumberFormat(locale.value === "km" ? "km-KH" : "en-US", {
      style: "currency",
      currency: "USD",
    }),
);

const columns = computed<TableColumn<TransactionRecord>[]>(() => [
  {
    id: "number",
    header: t("id"),
    cell: ({ row }) =>
      getPaginationRowNumber(row.index, page.value, limit.value),
  },
  { accessorKey: "transaction_id", header: t("transactionId") },
  { accessorKey: "amount", header: t("amount") },
  { accessorKey: "card_number", header: t("cardNumber") },
  {
    accessorKey: "transaction_type",
    header: t("transactionType"),
    meta: { class: { th: "text-center", td: "text-center" } },
  },
  {
    accessorKey: "status",
    header: t("status"),
    meta: { class: { th: "text-center", td: "text-center" } },
  },
  { accessorKey: "created_at", header: t("createdAt") },
  { accessorKey: "updated_at", header: t("updatedAt") },
]);

function getStatusColor(status: TransactionStatus) {
  if (status === "SUCCESS") return "success";
  if (status === "PENDING") return "warning";
  return "error";
}

watch(search, () => {
  page.value = 1;
});

</script>

<template>
  <UCard :ui="{ body: 'p-0 sm:p-0' }">
    <template #header>
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="font-semibold text-highlighted">
            {{ $t("transactionRecords") }}
          </h2>
          <p class="text-sm text-muted">{{ $t("transactionRecordsDescription") }}</p>
        </div>

        <UInput
          v-model="search"
          icon="i-lucide-search"
          :placeholder="$t('searchTransactions')"
          class="w-full sm:max-w-xs"
        />
      </div>
    </template>

    <UTable
      :data="paginatedRecords"
      :columns="columns"
      :empty="$t('noData')"
      :ui="{
        base: 'border-separate border-spacing-0',
        thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
        tbody: '[&>tr]:last:[&>td]:border-b-0',
        th: 'py-2 border-y border-default first:border-l last:border-r',
        td: 'border-b border-default',
        separator: 'h-0',
      }"
    >
      <template #amount-cell="{ row }">
        <span class="font-medium text-highlighted">
          {{ currencyFormatter.format(row.original.amount) }}
        </span>
      </template>

      <template #transaction_type-cell="{ row }">
        <UBadge
          :color="row.original.transaction_type === 'DEPOSIT' ? 'success' : 'warning'"
          variant="subtle"
        >
          {{ $t(row.original.transaction_type === "DEPOSIT" ? "deposit" : "withdrawal") }}
        </UBadge>
      </template>

      <template #status-cell="{ row }">
        <UBadge :color="getStatusColor(row.original.status)" variant="subtle">
          {{ $t(row.original.status.toLowerCase()) }}
        </UBadge>
      </template>

      <template #created_at-cell="{ row }">
        {{ formatDateTime(row.original.created_at) }}
      </template>

      <template #updated_at-cell="{ row }">
        {{ formatDateTime(row.original.updated_at) }}
      </template>
    </UTable>

    <template #footer>
      <CPagination
        v-model:page="page"
        v-model:limit="limit"
        :total="filteredRecords.length"
      />
    </template>
  </UCard>
</template>
