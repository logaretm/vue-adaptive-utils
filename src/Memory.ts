import { ref, onMounted, readonly } from 'vue';
import { isServer } from './utils';

export function useMemoryStatus() {
  const deviceMemory = ref(0);
  const unsupported = ref(false);
  const totalJSHeapSize = ref(undefined);
  const usedJSHeapSize = ref(undefined);
  const jsHeapSizeLimit = ref(undefined);

  function resolveMemory() {
    if (isServer) {
      onMounted(resolveMemory);
      return;
    }

    if (!('deviceMemory' in window.navigator)) {
      unsupported.value = true;
      return;
    }

    deviceMemory.value = (window.navigator as any).deviceMemory;

    if ('memory' in window.performance) {
      const memory = (window.performance as any).memory;
      totalJSHeapSize.value = memory.totalJSHeapSize;
      usedJSHeapSize.value = memory?.usedJSHeapSize;
      jsHeapSizeLimit.value = memory?.jsHeapSizeLimit;
    }
  }

  resolveMemory();

  return {
    deviceMemory: readonly(deviceMemory),
    totalJSHeapSize: readonly(totalJSHeapSize),
    usedJSHeapSize: readonly(usedJSHeapSize),
    jsHeapSizeLimit: readonly(jsHeapSizeLimit),
    unsupported: readonly(unsupported)
  };
}
