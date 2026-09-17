import type { MaybeRefOrGetter, Ref } from "vue";

export function useDebouncedValue<T>(
  source: MaybeRefOrGetter<T>,
  delay = 400,
) {
  const debouncedValue = ref(toValue(source)) as Ref<T>;

  watch(
    () => toValue(source),
    (value, _previousValue, onCleanup) => {
      const timeoutId = setTimeout(() => {
        debouncedValue.value = value;
      }, delay);

      onCleanup(() => clearTimeout(timeoutId));
    },
  );

  return readonly(debouncedValue);
}
