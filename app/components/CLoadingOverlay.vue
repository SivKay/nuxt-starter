<script setup lang="ts">
const props = defineProps<{
  show: boolean;
  label?: string;
}>();

const BODY_LOCK_COUNT_KEY = "loadingOverlayCount";
const BODY_OVERFLOW_KEY = "loadingOverlayOverflow";
let isScrollLocked = false;

function lockScroll() {
  if (!import.meta.client || isScrollLocked) {
    return;
  }

  const body = document.body;
  const lockCount = Number(body.dataset[BODY_LOCK_COUNT_KEY] ?? 0);

  if (lockCount === 0) {
    body.dataset[BODY_OVERFLOW_KEY] = body.style.overflow;
    body.style.overflow = "hidden";
  }

  body.dataset[BODY_LOCK_COUNT_KEY] = String(lockCount + 1);
  isScrollLocked = true;
}

function unlockScroll() {
  if (!import.meta.client || !isScrollLocked) {
    return;
  }

  const body = document.body;
  const lockCount = Math.max(
    Number(body.dataset[BODY_LOCK_COUNT_KEY] ?? 1) - 1,
    0,
  );

  if (lockCount === 0) {
    body.style.overflow = body.dataset[BODY_OVERFLOW_KEY] ?? "";
    delete body.dataset[BODY_LOCK_COUNT_KEY];
    delete body.dataset[BODY_OVERFLOW_KEY];
  } else {
    body.dataset[BODY_LOCK_COUNT_KEY] = String(lockCount);
  }

  isScrollLocked = false;
}

watch(
  () => props.show,
  (show) => {
    if (show) {
      lockScroll();
    } else {
      unlockScroll();
    }
  },
  { immediate: true },
);

onBeforeUnmount(unlockScroll);
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-200"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-100 flex items-center justify-center bg-default/80 backdrop-blur-sm"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div class="flex flex-col items-center gap-3 text-center">
          <UIcon
            name="i-lucide-loader-circle"
            class="size-8 animate-spin text-primary"
          />

          <slot>
            <p v-if="label" class="text-sm font-medium text-muted">
              {{ label }}
            </p>
          </slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
