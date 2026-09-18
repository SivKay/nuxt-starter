<script lang="ts" setup>
import type { NavigationMenuItem } from "@nuxt/ui";
import type { IPermissionGroup } from "~/types/userProfile";

type PermissionMenuItem = NavigationMenuItem & {
  module?: string;
  children?: PermissionMenuItem[];
};

const props = defineProps<{
  permissions: IPermissionGroup[];
}>();

const { t } = useI18n();
const route = useRoute();

const open = ref(true);
const openGroups = ref<string[]>([]);

const menuItems = computed<PermissionMenuItem[]>(() => [
  {
    label: t("dashboard"),
    icon: "i-lucide-layout-dashboard",
    to: "/",
  },
  {
    label: t("orderManagement"),
    icon: "i-lucide-clipboard-list",
    value: "order-management", // use this to persist collapse state when reload
    children: [
      {
        label: t("deposit"),
        to: "/order-management/deposit",
        module: "DEPOSIT",
      },
      {
        label: t("withdrawal"),
        to: "/order-management/withdrawal",
        module: "WITHDRAWAL",
      },
    ],
  },
  {
    label: t("userManagement"),
    icon: "i-lucide-user-round-cog",
    value: "user-management",
    children: [
      {
        label: t("roleManagement"),
        to: "/user-management/role-management",
        module: "ROLE",
      },
      {
        label: t("systemUser"),
        to: "/user-management/system-user",
        module: "USER",
      },
    ],
  },
]);

const allowedModules = computed(
  () => new Set(props.permissions.map(({ module }) => module) ?? []),
);

function isMenuItemActive(item: PermissionMenuItem): boolean {
  if (item.active) {
    return true;
  }

  return item.children?.some(isMenuItemActive) ?? false;
}

function getRouteActive(to: PermissionMenuItem["to"]) {
  if (typeof to !== "string") {
    return false;
  }

  return to === "/"
    ? route.path === to
    : route.path === to || route.path.startsWith(`${to}/`);
}

function filterMenuItemsByPermission(
  items: PermissionMenuItem[],
): PermissionMenuItem[] {
  return items.flatMap((item) => {
    if (item.module && !allowedModules.value.has(item.module)) {
      return [];
    }

    if (!item.children) {
      return [{ ...item, active: getRouteActive(item.to) }];
    }

    const children = filterMenuItemsByPermission(item.children);

    if (children.length === 0) {
      return [];
    }

    return [
      {
        ...item,
        active: getRouteActive(item.to),
        children,
      },
    ];
  });
}

const filterMenuItems = computed(() =>
  filterMenuItemsByPermission(menuItems.value),
);

function getActiveGroupValues(items: PermissionMenuItem[]): string[] {
  return items.flatMap((item) => {
    if (!item.children) {
      return [];
    }

    const nestedGroups = getActiveGroupValues(item.children);
    const value =
      typeof item.value === "string" && item.children.some(isMenuItemActive)
        ? [item.value]
        : [];

    return [...value, ...nestedGroups];
  });
}

function getGroupValues(items: PermissionMenuItem[]): string[] {
  return items.flatMap((item) => {
    if (!item.children) {
      return [];
    }

    const value = typeof item.value === "string" ? [item.value] : [];

    return [...value, ...getGroupValues(item.children)];
  });
}

watch(
  filterMenuItems,
  (items) => {
    const availableGroups = new Set(getGroupValues(items));
    const retainedGroups = openGroups.value.filter((value) =>
      availableGroups.has(value),
    );

    openGroups.value = [
      ...new Set([...retainedGroups, ...getActiveGroupValues(items)]),
    ];
  },
  { immediate: true },
);
</script>

<template>
  <div class="flex flex-1">
    <USidebar
      v-model:open="open"
      collapsible="icon"
      :ui="{
        container: 'h-full',
        inner: 'bg-elevated/25 divide-transparent',
        body: 'py-0',
      }"
    >
      <template #header>
        <UIcon name="i-logos-nuxt-icon" class="size-8" />
      </template>
      <template #default="{ state }">
        <UNavigationMenu
          v-model="openGroups"
          :key="state"
          :items="filterMenuItems"
          orientation="vertical"
          :collapsed="state === 'collapsed'"
          type="multiple"
          tooltip
          :ui="{ link: 'p-1.5 overflow-hidden' }"
        />
      </template>
    </USidebar>

    <div class="flex-1 flex flex-col">
      <AppHeader @toggle-sidebar="open = !open" />

      <!-- Main content -->
      <main class="flex-1 p-4">
        <slot />
      </main>
    </div>
  </div>
</template>
