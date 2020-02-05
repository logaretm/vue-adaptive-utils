import { ref, onMounted, readonly } from 'vue';
import { isServer } from './utils';

export function useHardwareConcurrency() {
  const concurrency = ref(0);
  const isUnsupported = ref(false);

  function resolveConcurrency() {
    if (isServer) {
      onMounted(resolveConcurrency);
      return;
    }

    if (
      window.navigator &&
      'hardwareConcurrency' in window.navigator &&
      typeof window.navigator.hardwareConcurrency !== 'undefined'
    ) {
      concurrency.value = window.navigator.hardwareConcurrency;
      return;
    }

    isUnsupported.value = true;
  }

  resolveConcurrency();

  return {
    concurrency: readonly(concurrency),
    isUnsupported: readonly(isUnsupported)
  };
}
