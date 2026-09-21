<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { PERMISSION_ACTIONS, PERMISSION_MODULES } from "~/constants";
import type { IRole, IRoleFilter } from "~/types/role";

definePageMeta({
  middleware: "permission",
  permission: {
    module: PERMISSION_MODULES.role,
  },
});

const { t } = useI18n();
const { canPerform } = usePermission();
const { showError, showSuccess } = useCToast();
const deleteRoleReq = useDeleteRoleService();

const deleteModalOpen = ref(false);
const selectedRole = ref<IRole>();
const search = ref("");
const debouncedSearch = useDebouncedValue(search);

const filter = ref<IRoleFilter>({
  limit: 10,
  page: 1,
  search: "",
});
const { data, isFetching } = useRoleListService(filter);

watch(debouncedSearch, (value) => {
  filter.value.search = value.trim();
  filter.value.page = 1;
});

function openDeleteModal(role: IRole) {
  selectedRole.value = role;
  deleteModalOpen.value = true;
}

async function confirmDelete() {
  if (!selectedRole.value) {
    return;
  }

  try {
    await deleteRoleReq.mutateAsync(selectedRole.value.uuid);
    showSuccess(t("roleDeletedSuccessfully"));
    deleteModalOpen.value = false;
    selectedRole.value = undefined;
  } catch (error: any) {
    showError(error?.message);
  }
}

const columns = computed<TableColumn<IRole>[]>(() => [
  {
    id: "number",
    header: t("id"),
    cell: ({ row }) =>
      getPaginationRowNumber(row.index, filter.value.page, filter.value.limit),
  },
  {
    accessorKey: "name",
    header: t("roleName"),
  },
  {
    accessorKey: "description",
    header: t("description"),
  },
  {
    accessorKey: "status",
    header: t("status"),
    meta: {
      class: {
        th: "text-center",
        td: "text-center",
      },
    },
  },
  {
    accessorKey: "created_at",
    header: t("createdAt"),
  },
  {
    accessorKey: "updated_at",
    header: t("updatedAt"),
  },
  {
    id: "actions",
    header: t("action"),
  },
]);
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="w-full flex items-center justify-between gap-4">
      <h1 class="text-xl font-semibold">{{ $t("roleManagement") }}</h1>

      <UButton
        v-if="canPerform(PERMISSION_MODULES.role, PERMISSION_ACTIONS.create)"
        to="/user-management/role-management/create"
        icon="i-lucide-plus"
      >
        {{ $t("createRole") }}
      </UButton>
    </div>

    <!-- Filter -->
    <div>
      <UInput
        v-model="search"
        :placeholder="$t('searchField', [$t('roleName')])"
      />
    </div>

    <UTable
      ref="table"
      :data="data?.data"
      :columns="columns"
      :loading="isFetching"
      :empty="$t('noData')"
      :ui="{
        base: 'border-separate border-spacing-0',
        thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
        tbody: '[&>tr]:last:[&>td]:border-b-0',
        th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
        td: 'border-b border-default',
        separator: 'h-0',
      }"
      sticky
    >
      <template #status-cell="{ row }">
        <UBadge
          :color="row.original.status === 'ACTIVE' ? 'success' : 'error'"
          variant="subtle"
        >
          {{ row.original.status === "ACTIVE" ? $t("active") : $t("inactive") }}
        </UBadge>
      </template>

      <template #created_at-cell="{ row }">
        {{ formatDateTime(row.original.created_at) }}
      </template>

      <template #updated_at-cell="{ row }">
        {{ formatDateTime(row.original.updated_at) }}
      </template>

      <template #actions-cell="{ row }">
        <div class="flex items-center gap-1">
          <UButton
            v-if="
              canPerform(PERMISSION_MODULES.role, PERMISSION_ACTIONS.update)
            "
            :to="`/user-management/role-management/${row.original.uuid}/edit`"
            icon="i-lucide-square-pen"
            color="warning"
            variant="ghost"
            :aria-label="$t('updateRole')"
          />

          <UButton
            v-if="
              canPerform(PERMISSION_MODULES.role, PERMISSION_ACTIONS.delete)
            "
            icon="i-lucide-trash-2"
            color="error"
            variant="ghost"
            :aria-label="$t('delete')"
            @click="openDeleteModal(row.original)"
          />
        </div>
      </template>
    </UTable>

    <CPagination
      v-model:page="filter.page"
      v-model:limit="filter.limit"
      :total="data?.metadata.total_count ?? 0"
    />

    <CConfirmModal
      v-model:open="deleteModalOpen"
      :title="$t('deleteRole')"
      :description="$t('deleteRoleConfirmation', [selectedRole?.name ?? ''])"
      :confirm-label="$t('delete')"
      confirm-color="error"
      :loading="deleteRoleReq.isPending.value"
      @confirm="confirmDelete"
    />
  </div>
</template>
