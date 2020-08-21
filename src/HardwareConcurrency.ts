import { ref } from 'vue';
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
    concurrency: concurrency,
    isSupported: isSupported
  };
}
