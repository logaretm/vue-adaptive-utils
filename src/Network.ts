import { onMounted, onUnmounted, ref, Ref, readonly } from 'vue';
import { isServer } from './utils';

type NetworkType = 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
type NetworkEffectiveType = 'slow-2g' | '2g' | '3g' | '4g' | undefined;

export function useNetworkStatus() {
  const isOnline = ref(true);
  const saveData = ref(false);
  const offlineAt: Ref<number | undefined> = ref(undefined);
  const downlink: Ref<number | undefined> = ref(undefined);
  const downlinkMax: Ref<number | undefined> = ref(undefined);
  const effectiveConnectionType: Ref<NetworkEffectiveType> = ref(undefined);
  const networkType: Ref<NetworkType> = ref('unknown');
  const isUnsupported = ref(false);

  function updateNetworkInformation() {
    isOnline.value = window.navigator.onLine;
    offlineAt.value = isOnline.value ? undefined : Date.now();
    // skip for non supported browsers.
    const connection =
      (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (!connection) {
      isUnsupported.value = true;
      return;
    }

    downlink.value = (window.navigator as any).connection.downlink;
    downlinkMax.value = (window.navigator as any).connection.downlinkMax;
    effectiveConnectionType.value = (window.navigator as any).connection.effectiveType;
    saveData.value = (window.navigator as any).connection.saveData;
    networkType.value = (window.navigator as any).connection.type;
  }

  function onOffline(e: Event) {
    isOnline.value = false;
    offlineAt.value = e.timeStamp;
  }

  function onOnline() {
    isOnline.value = true;
  }

  function listen() {
    window.addEventListener('offline', onOffline);
    window.addEventListener('online', onOnline);
    if ('connection' in window.navigator) {
      (window.navigator as any).connection.addEventListener('change', updateNetworkInformation, false);
    }
  }

  onUnmounted(() => {
    window.removeEventListener('offline', onOffline);
    window.removeEventListener('online', onOnline);
    if ('connection' in window.navigator) {
      (window.navigator as any).connection.removeEventListener('change', updateNetworkInformation, false);
    }
  });

  if (!isServer) {
    updateNetworkInformation();
    listen();
  } else {
    onMounted(() => {
      updateNetworkInformation();
      listen();
    });
  }

  return {
    isOnline: readonly(isOnline),
    saveData: readonly(saveData),
    offlineAt: readonly(offlineAt),
    downlink: readonly(downlink),
    downlinkMax: readonly(downlinkMax),
    effectiveConnectionType: readonly(effectiveConnectionType),
    networkType: readonly(networkType),
    isUnsupported: readonly(isUnsupported)
  };
}
