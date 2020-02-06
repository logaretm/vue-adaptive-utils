import { ref, onMounted, readonly } from 'vue';
import { isServer } from './utils';

export function useHardwareConcurrency() {
  const concurrency = ref(0);
  const isSupported = ref(false);

  function resolveConcurrency() {
    if (isServer) {
      onMounted(resolveConcurrency);
      return;
    }

    const supported =
      window.navigator &&
      'hardwareConcurrency' in window.navigator &&
      typeof window.navigator.hardwareConcurrency !== 'undefined';
    if (!supported) {
      return;
    }

    concurrency.value = window.navigator.hardwareConcurrency;
    isSupported.value = supported;
  }

  resolveConcurrency();

  return {
    concurrency: readonly(concurrency),
    isSupported: readonly(isSupported)
  };
}
