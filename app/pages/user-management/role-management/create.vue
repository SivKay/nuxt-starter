<script setup lang="ts">
import type { BreadcrumbItem } from "@nuxt/ui";
import { PERMISSION_ACTIONS, PERMISSION_MODULES } from "~/constants";

definePageMeta({
  middleware: "permission",
  permission: {
    module: PERMISSION_MODULES.role,
    action: PERMISSION_ACTIONS.create,
  },
});

const { t } = useI18n();

const items = computed<BreadcrumbItem[]>(() => [
  {
    icon: "i-lucide-user-round-cog",
  },
  {
    label: t("userManagement"),
    to: "/user-management/role-management",
  },
  {
    label: t("createRole"),
  },
]);
</script>

<template>
  <div class="space-y-4">
    <UBreadcrumb :items="items" />

    <RoleManagementCreateForm />
  </div>
</template>
