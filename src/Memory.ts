import { ref, Ref } from 'vue';
import { runWithoutSSR } from './utils';

interface UseMemoryStatusOptions {
  deviceMemory?: number;
  totalJSHeapSize?: number;
  usedJSHeapSize?: number;
  jsHeapSizeLimit?: number;
}

export function useMemoryStatus(opts?: UseMemoryStatusOptions) {
  const deviceMemory = ref(opts?.deviceMemory ?? undefined);
  const totalJSHeapSize: Ref<undefined | number> = ref(opts?.totalJSHeapSize);
  const usedJSHeapSize: Ref<undefined | number> = ref(opts?.usedJSHeapSize);
  const jsHeapSizeLimit: Ref<undefined | number> = ref(opts?.jsHeapSizeLimit);
  const isSupported = ref(false);

  runWithoutSSR(function resolveMemory() {
    if (!('deviceMemory' in window.navigator)) {
      return;
    }

    isSupported.value = true;
    deviceMemory.value = (window.navigator as any).deviceMemory;

    if ('memory' in window.performance) {
      const memory = (window.performance as any).memory;
      totalJSHeapSize.value = memory.totalJSHeapSize;
      usedJSHeapSize.value = memory?.usedJSHeapSize;
      jsHeapSizeLimit.value = memory?.jsHeapSizeLimit;
    }
  });

  return {
    deviceMemory: deviceMemory,
    totalJSHeapSize: totalJSHeapSize,
    usedJSHeapSize: usedJSHeapSize,
    jsHeapSizeLimit: jsHeapSizeLimit,
    isSupported: isSupported
  };
}
