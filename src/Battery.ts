import { ref, onMounted, onUnmounted, readonly } from 'vue';
import { isServer } from './utils';

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

export function useBattery() {
  const charging = ref(false);
  const chargingTime = ref(0);
  const dischargingTime = ref(0);
  const level = ref(1);
  const unsupported = ref(true);

  function updateBatteryInfo(this: BatteryManager) {
    charging.value = this.charging;
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
    unsupported.value = !(navigator && 'getBattery' in navigator);
  }

  function init() {
    checkSupport();
    if (unsupported.value) {
      return;
    }

    listen();
  }

  onUnmounted(() => {
    if (unsupported.value) {
      return;
    }

    (navigator as NavigatorWithBattery).getBattery().then(battery => {
      events.forEach(evt => {
        battery.removeEventListener(evt, updateBatteryInfo);
      });
    });
  });

  if (!isServer) {
    init();
  } else {
    onMounted(init);
  }

  return {
    charging: readonly(charging),
    chargingTime: readonly(chargingTime),
    dischargingTime: readonly(dischargingTime),
    level: readonly(level),
    unsupported: readonly(unsupported)
  };
}
