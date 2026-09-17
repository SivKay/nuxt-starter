<script setup lang="ts">
import type { BreadcrumbItem } from "@nuxt/ui";
import { PERMISSION_ACTIONS, PERMISSION_MODULES } from "~/constants";

definePageMeta({
  middleware: "permission",
  permission: {
    module: PERMISSION_MODULES.role,
    action: PERMISSION_ACTIONS.update,
  },
});

const { t } = useI18n();
const route = useRoute();

const roleId = computed(() => {
  const id = route.params.id;

  return Array.isArray(id) ? id[0] : id;
});

const { data: item, isPending } = useRoleDetailService(roleId);

const items = computed<BreadcrumbItem[]>(() => [
  {
    icon: "i-lucide-user-round-cog",
  },
  {
    label: t("userManagement"),
    to: "/user-management/role-management",
  },
  {
    label: t("updateRole"),
  },
]);
</script>

<template>
  <div class="space-y-4">
    <UBreadcrumb :items="items" />

    <CLoadingOverlay :show="isPending" />

    <RoleManagementCreateForm v-if="item" :item="item" />
  </div>
</template>
