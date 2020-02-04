import { ref, onMounted, readonly } from 'vue';
import { isServer } from './utils';

export function useHardwareConcurrency() {
  const logicalProcessors = ref(0);
  const unsupported = ref(false);

  function resolveConcurrency() {
    if (isServer) {
      onMounted(resolveConcurrency);
      return;
    }

    if ('hardwareConcurrency' in window.navigator) {
      logicalProcessors.value = window.navigator.hardwareConcurrency;
    }

    unsupported.value = true;
  }

  resolveConcurrency();

  return {
    logicalProcessors: readonly(logicalProcessors),
    unsupported: readonly(unsupported)
  };
}
