import { ref, readonly, computed } from 'vue';
import { runWithoutSSR } from './utils';

export function useHardwareConcurrency(initialConcurrency?: number) {
  const concurrency = ref(initialConcurrency ?? undefined);
  const isSupported = ref(false);

  runWithoutSSR(function resolveConcurrency() {
    const supported =
      window.navigator &&
      'hardwareConcurrency' in window.navigator &&
      typeof window.navigator.hardwareConcurrency !== 'undefined';
    if (!supported) {
      return;
    }

    concurrency.value = window.navigator.hardwareConcurrency;
    isSupported.value = supported;
  });

  return {
    concurrency: readonly(concurrency),
    isSupported: readonly(isSupported)
  };
}

export function useHardwareConcurrencyBudget(expectedConcurrency: number) {
  const hw = useHardwareConcurrency(expectedConcurrency);
  const isWithinBudget = computed(() => {
    return (hw.concurrency.value as number) >= expectedConcurrency;
  });

  return isWithinBudget;
}
