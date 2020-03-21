import { ref, onUnmounted, readonly } from 'vue';
import { runWithoutSSR } from './utils';

interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}

type NavigatorWithBattery = Navigator & {
  getBattery: () => Promise<BatteryManager>;
};

const events = ['chargingchange', 'chargingtimechange', 'dischargingtimechange', 'levelchange'];

interface UseBatteryOptions {
  isCharging?: boolean;
  chargingTime?: number;
  dischargingTime?: number;
  level?: number;
}

export function useBattery(opts?: UseBatteryOptions) {
  const isCharging = ref(opts?.isCharging ?? false);
  const chargingTime = ref(opts?.chargingTime ?? 0);
  const dischargingTime = ref(opts?.dischargingTime ?? 0);
  const level = ref(opts?.level ?? 0);
  const isSupported = ref(false);

  function updateBatteryInfo(this: BatteryManager) {
    isCharging.value = this.charging;
    chargingTime.value = this.chargingTime || 0;
    dischargingTime.value = this.dischargingTime || 0;
    level.value = this.level;
  }

  function listen() {
    (navigator as NavigatorWithBattery).getBattery().then(battery => {
      updateBatteryInfo.call(battery);
      events.forEach(evt => {
        battery.addEventListener(evt, updateBatteryInfo);
      });
    });
  }

  function checkSupport() {
    isSupported.value = !!(navigator && 'getBattery' in navigator);
  }

  onUnmounted(() => {
    if (!isSupported.value) {
      return;
    }

    (navigator as NavigatorWithBattery).getBattery().then(battery => {
      events.forEach(evt => {
        battery.removeEventListener(evt, updateBatteryInfo);
      });
    });
  });

  runWithoutSSR(() => {
    checkSupport();
    if (!isSupported.value) {
      return;
    }

    listen();
  });

  return {
    isCharging: readonly(isCharging),
    chargingTime: readonly(chargingTime),
    dischargingTime: readonly(dischargingTime),
    level: readonly(level),
    isSupported: readonly(isSupported)
  };
}
