<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";
import type { IPermission, IPermissionModule, IRole } from "~/types/role";

const props = defineProps<{
  item?: IRole;
}>();

const { t, te } = useI18n();
const router = useRouter();
const { showError, showSuccess } = useCToast();
const createRoleReq = useCreateRoleService();
const updateRoleReq = useUpdateRoleService();
const { data: permissionModules, isFetching: isFetchingPermissions } =
  useGetRolePermissionsService();

const schema = computed(() =>
  z.object({
    name: requiredString(t("fieldIsRequired", [t("roleName")])),
    description: z.string().trim(),
    status: z.enum(["ACTIVE", "INACTIVE"]),
    permission_ids: z.array(z.number()),
  }),
);

type Schema = z.output<(typeof schema)["value"]>;

const state = reactive<Schema>({
  name: "",
  description: "",
  status: "ACTIVE",
  permission_ids: [],
});

const statusOptions = computed(() => [
  { label: t("active"), value: "ACTIVE" as const },
  { label: t("inactive"), value: "INACTIVE" as const },
]);

const permissionCheckboxUi = {
  root: "min-w-0",
  wrapper: "min-w-0",
  label: "whitespace-normal break-words leading-5",
} as const;

const isSubmitting = computed(
  () => createRoleReq.isPending.value || updateRoleReq.isPending.value,
);

const isLoading = computed(
  () => isFetchingPermissions.value || isSubmitting.value,
);

const isUpdate = computed(() => !!props.item);

watch(
  () => props.item,
  (item) => {
    if (!item) {
      return;
    }

    state.name = item.name;
    state.description = item.description;
    state.status = item.status;
    state.permission_ids = item.permissions.flatMap((module) =>
      module.permissions.map((permission) => permission.id),
    );
  },
  { immediate: true },
);

function getPermissionModuleLabel(module: string) {
  const translationKey = `permission.${module}`;

  return te(translationKey) ? t(translationKey) : module;
}

function isPermissionSelected(permissionId: number) {
  return state.permission_ids.includes(permissionId);
}

function setPermission(permissionId: number, selected: boolean) {
  if (selected) {
    if (!isPermissionSelected(permissionId)) {
      state.permission_ids.push(permissionId);
    }
    return;
  }

  state.permission_ids = state.permission_ids.filter(
    (id) => id !== permissionId,
  );
}

function getModuleSelectionState(module: IPermissionModule) {
  const selectedCount = module.permissions.filter((permission) =>
    isPermissionSelected(permission.id),
  ).length;

  if (selectedCount === 0) {
    return false;
  }

  return selectedCount === module.permissions.length ? true : "indeterminate";
}

function setModulePermissions(module: IPermissionModule, selected: boolean) {
  const modulePermissionIds = new Set(
    module.permissions.map((permission) => permission.id),
  );

  if (selected) {
    state.permission_ids = [
      ...new Set([...state.permission_ids, ...modulePermissionIds]),
    ];
    return;
  }

  state.permission_ids = state.permission_ids.filter(
    (id) => !modulePermissionIds.has(id),
  );
}

function getPermissionLabel(permission: IPermission) {
  const translationKey = enumToCamelCase(permission.action);

  return te(translationKey) ? t(translationKey) : permission.name;
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    if (isUpdate.value && props.item) {
      await updateRoleReq.mutateAsync({
        uuid: props.item.uuid,
        data: event.data,
      });
      showSuccess(t("roleUpdatedSuccessfully"));
    } else {
      await createRoleReq.mutateAsync(event.data);
      showSuccess(t("roleCreatedSuccessfully"));
    }
    await router.push("/user-management/role-management");
  } catch (error: any) {
    showError(error?.message);
  }
}
</script>

<template>
  <UCard class="w-full">
    <UForm
      :schema="schema"
      :state="state"
      class="mx-auto max-w-5xl flex w-full flex-col gap-4"
      @submit="onSubmit"
      :disabled="isLoading"
    >
      <h1 class="text-center text-base font-semibold text-highlighted">
        {{ $t("roleInformation") }}
      </h1>

      <div class="space-y-4">
        <UFormField
          name="name"
          size="lg"
          :label="$t('roleName')"
          required
          class="grid gap-2 md:gap-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:items-start"
          :ui="{
            wrapper: 'sm:pt-2 sm:text-right',
            labelWrapper: 'sm:justify-end',
            container: 'mt-0 min-w-0',
          }"
        >
          <UInput
            v-model="state.name"
            :placeholder="$t('enterRoleName')"
            class="w-full"
          />
        </UFormField>

        <UFormField
          name="description"
          size="lg"
          :label="$t('description')"
          class="grid gap-2 md:gap-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:items-start"
          :ui="{
            wrapper: 'sm:pt-2 sm:text-right',
            labelWrapper: 'sm:justify-end',
            container: 'mt-0 min-w-0',
          }"
        >
          <UTextarea
            v-model="state.description"
            :placeholder="$t('enterRoleDescription')"
            :rows="2"
            class="w-full"
          />
        </UFormField>

        <UFormField
          name="status"
          size="lg"
          :label="$t('status')"
          required
          class="grid gap-2 md:gap-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:items-start"
          :ui="{
            wrapper: 'sm:pt-2 sm:text-right',
            labelWrapper: 'sm:justify-end',
            container: 'mt-0 min-w-0',
          }"
        >
          <USelect
            v-model="state.status"
            :items="statusOptions"
            class="w-full"
          />
        </UFormField>
      </div>

      <h2 class="pt-2 text-center text-base font-semibold text-highlighted">
        {{ $t("permissions") }}
      </h2>

      <div class="space-y-3">
        <div
          v-for="permissionModule in permissionModules"
          :key="permissionModule.module"
          class="grid gap-2 md:gap-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:items-start"
        >
          <p
            class="pt-3 text-sm font-medium text-muted sm:text-right capitalize"
          >
            {{ getPermissionModuleLabel(permissionModule.module) }}
          </p>

          <div
            class="grid min-h-14 grid-cols-1 gap-3 rounded-lg border border-default p-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            <UCheckbox
              :model-value="getModuleSelectionState(permissionModule)"
              :label="$t('selectAll')"
              :ui="permissionCheckboxUi"
              @update:model-value="
                setModulePermissions(permissionModule, $event === true)
              "
            />

            <UCheckbox
              v-for="permission in permissionModule.permissions"
              :key="permission.id"
              :model-value="isPermissionSelected(permission.id)"
              :label="getPermissionLabel(permission)"
              :ui="permissionCheckboxUi"
              @update:model-value="
                setPermission(permission.id, $event === true)
              "
            />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 sm:pl-34">
        <UButton
          type="button"
          color="neutral"
          variant="soft"
          size="lg"
          class="w-full justify-center"
          :disabled="isLoading"
          @click="router.back()"
        >
          {{ $t("cancel") }}
        </UButton>

        <UButton
          type="submit"
          size="lg"
          class="w-full justify-center"
          :loading="isSubmitting"
          :disabled="isLoading"
        >
          {{ $t(isUpdate ? "updateRole" : "createRole") }}
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>
