<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

definePageMeta({
  layout: false,
});

const { showError, showSuccess } = useCToast();
const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const loginReq = useLoginService();
const { setTokens } = useAuth();
const { clearProfile } = useAuthProfile();

const documentTitle = computed(() => t("login"));
useHead({
  title: documentTitle,
});

function getRedirectPath() {
  const redirect = route.query.redirect;

  return typeof redirect === "string" &&
    redirect.startsWith("/") &&
    !redirect.startsWith("//")
    ? redirect
    : "/";
}

function createSchema() {
  return z.object({
    email: emailString(
      t("fieldIsRequired", [t("email")]),
      t("invalidField", [t("email")]),
    ),
    password: requiredString(t("fieldIsRequired", [t("password")])).min(
      6,
      t("mustBeAtLeastNumCharacter", ["6"]),
    ),
  });
}

const schema = computed(createSchema);

type Schema = z.output<ReturnType<typeof createSchema>>;

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const data = event.data;

  try {
    const tokens = await loginReq.mutateAsync({
      email: data.email,
      password: data.password,
    });
    clearProfile();
    setTokens(tokens);
    showSuccess(t("loginSuccessfully"));
    await router.push(getRedirectPath());
  } catch (error: any) {
    showError(error?.message);
  }
}
</script>

<template>
  <div class="w-full h-dvh flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-semibold text-highlighted">
          {{ $t("login") }}
        </h1>
        <SwitchLanguage />
      </div>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-6"
        @submit="onSubmit"
        :disabled="loginReq.isPending.value"
      >
        <UFormField name="email" size="lg">
          <template #label>
            <span class="required">{{ $t("email") }}</span>
          </template>

          <UInput
            v-model="state.email"
            :placeholder="$t('enterYourEmail')"
            class="w-full"
          />
        </UFormField>

        <UFormField name="password" size="lg">
          <template #label>
            <span class="required">{{ $t("password") }}</span>
          </template>

          <CPassword
            v-model="state.password"
            :placeholder="$t('enterYourPassword')"
            class="w-full"
          />
        </UFormField>

        <UButton
          type="submit"
          size="lg"
          class="w-full justify-center"
          :loading="loginReq.isPending.value"
        >
          {{ $t("submit") }}
        </UButton>
      </UForm>
    </UPageCard>
  </div>
</template>
