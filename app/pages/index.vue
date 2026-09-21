<script setup lang="ts">
const { profile } = useAuthProfile();
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-1">
      <h1 class="text-2xl font-semibold text-highlighted">
        {{ $t("dashboard") }}
      </h1>
      <p class="text-sm text-muted">
        {{ $t("dashboardOverview") }}
      </p>
    </div>

    <UCard
      class="overflow-hidden bg-linear-to-br from-primary/10 via-default to-default"
      :ui="{
        body: 'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
      }"
    >
      <div class="flex min-w-0 items-center gap-4">
        <UAvatar
          :alt="profile?.user.name"
          icon="i-lucide-user"
          size="xl"
          class="shrink-0"
          color="primary"
        />

        <div class="min-w-0">
          <p class="truncate text-lg font-semibold text-highlighted">
            {{ $t("welcomeBack", [profile?.user.name || $t("dashboard")]) }}
          </p>
          <p class="truncate text-sm text-muted">
            {{ profile?.user.email }}
          </p>
        </div>
      </div>
    </UCard>

    <DashboardSummaryData />

    <DashboardTransactionChart />

    <DashboardTransactionRecord />
  </div>
</template>
