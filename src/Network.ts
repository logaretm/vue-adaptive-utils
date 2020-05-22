import { onUnmounted, ref, Ref, readonly, computed } from 'vue';
import { runWithoutSSR } from './utils';

type NetworkType = 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
type NetworkEffectiveType = 'slow-2g' | '2g' | '3g' | '4g';

interface UseNetworkStatusOptions {
  isOnline?: boolean;
  saveData?: boolean;
  downlink?: number;
  downlinkMax?: number;
  effectiveConnectionType?: NetworkEffectiveType;
  networkType?: NetworkType;
}

export function useNetworkStatus(opts?: UseNetworkStatusOptions) {
  const isOnline = ref(opts?.isOnline ?? true);
  const saveData = ref(opts?.saveData ?? false);
  const offlineAt: Ref<number | undefined> = ref(undefined);
  const downlink: Ref<number | undefined> = ref(opts?.downlink ?? undefined);
  const downlinkMax: Ref<number | undefined> = ref(opts?.downlinkMax ?? undefined);
  const effectiveConnectionType: Ref<NetworkEffectiveType | undefined> = ref(
    opts?.effectiveConnectionType ?? undefined
  );
  const networkType: Ref<NetworkType> = ref(opts?.networkType ?? 'unknown');
  const isSupported = ref(false);

  function updateNetworkInformation() {
    isOnline.value = window.navigator.onLine;
    offlineAt.value = isOnline.value ? offlineAt.value : Date.now();
    // skip for non supported browsers.
    const connection =
      (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (!connection) {
      return;
    }

    isSupported.value = true;
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

  runWithoutSSR(() => {
    updateNetworkInformation();
    listen();
  });

  return {
    isOnline: readonly(isOnline),
    saveData: readonly(saveData),
    offlineAt: readonly(offlineAt),
    downlink: readonly(downlink),
    downlinkMax: readonly(downlinkMax),
    effectiveConnectionType: readonly(effectiveConnectionType),
    networkType: readonly(networkType),
    isSupported: readonly(isSupported)
  };
}

type NetworkBudgetOptions = Pick<
  UseNetworkStatusOptions,
  'isOnline' | 'saveData' | 'downlink' | 'effectiveConnectionType'
>;

const effectiveConnTierList: Record<NetworkEffectiveType, number> = {
  'slow-2g': 0,
  '2g': 1,
  '3g': 2,
  '4g': 3
};

function getConnTier(connType: NetworkEffectiveType | undefined): number {
  if (connType === undefined) {
    return 4;
  }

  return effectiveConnTierList[connType] || 4;
}

export function useNetworkStatusBudget(opts: NetworkBudgetOptions) {
  const status = useNetworkStatus(opts);
  const isWithinBudget = computed(() => {
    if (opts.isOnline && !status.isOnline.value) {
      return false;
    }

    if ('saveData' in opts && status.saveData.value !== opts.saveData) {
      return false;
    }

    if (opts.downlink && (status.downlink.value as number) < opts.downlink) {
      return false;
    }

    if (
      opts.effectiveConnectionType &&
      getConnTier(status.effectiveConnectionType.value) < getConnTier(opts.effectiveConnectionType)
    ) {
      return false;
    }

    return true;
  });

  return isWithinBudget;
}
