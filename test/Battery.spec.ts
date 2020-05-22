import { mountHook } from './helpers';
import { useBatteryStatus, useBatteryStatusBudget } from '../src';
import flushP from 'flush-promises';

const navigator = window.navigator;

const map: Record<string, Function> = {};
const fakeEventTarget = {
  addEventListener: jest.fn(function(this: any, event: string, callback: Function) {
    map[event] = callback.bind(this);
  }),
  removeEventListener: jest.fn()
};

afterEach(() => {
  // @ts-ignore
  if (!window.navigator) window.navigator = navigator;
  Object.values(fakeEventTarget).forEach(listener => listener.mockClear());
});

function mockBatteryManager({
  charging,
  chargingTime,
  dischargingTime,
  level
}: {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}) {
  return {
    ...fakeEventTarget,
    charging,
    chargingTime,
    dischargingTime,
    level
  };
}

describe('use Battery', () => {
  test(`should return "false" for unsupported case`, async () => {
    Object.defineProperty(window, 'navigator', {
      value: undefined,
      configurable: true,
      writable: true
    });
    const vm = mountHook(() => useBatteryStatus());

    expect(vm.isSupported).toBe(false);
  });

  test(`should return "false" for unsupported case but report initial values`, async () => {
    Object.defineProperty(window, 'navigator', {
      value: undefined,
      configurable: true,
      writable: true
    });
    const vm = mountHook(() => useBatteryStatus({ isCharging: true, chargingTime: 540 }));

    expect(vm.isSupported).toBe(false);
    expect(vm.isCharging).toBe(true);
    expect(vm.chargingTime).toBe(540);
  });

  test(`should return "true" for supported case`, async () => {
    Object.defineProperty(window.navigator, 'getBattery', {
      value: () =>
        Promise.resolve(mockBatteryManager({ charging: true, chargingTime: 1, dischargingTime: 0, level: 1 })),
      configurable: true,
      writable: true
    });
    const vm = mountHook(() => useBatteryStatus());

    expect(vm.isSupported).toBe(true);
  });

  test(`should report the battery status`, async () => {
    Object.defineProperty(window.navigator, 'getBattery', {
      value: () =>
        Promise.resolve(mockBatteryManager({ charging: true, chargingTime: 140, dischargingTime: 40, level: 1 })),
      configurable: true,
      writable: true
    });
    const vm = mountHook(() => useBatteryStatus());
    await flushP();

    expect(vm.isCharging).toBe(true);
    expect(vm.chargingTime).toBe(140);
    expect(vm.dischargingTime).toBe(40);
    expect(vm.level).toBe(1);
  });

  test(`should update the charging status when it changes`, async () => {
    const batteryMock = mockBatteryManager({ charging: true, chargingTime: 140, dischargingTime: 40, level: 1 });
    Object.defineProperty(window.navigator, 'getBattery', {
      value: () => Promise.resolve(batteryMock),
      configurable: true,
      writable: true
    });
    const vm = mountHook(() => useBatteryStatus());
    await flushP();
    batteryMock.charging = false;
    map.chargingchange();
    expect(vm.isCharging).toBe(false);
  });

  test(`should update the chargingtime when it changes`, async () => {
    const batteryMock = mockBatteryManager({ charging: true, chargingTime: 140, dischargingTime: 40, level: 1 });
    Object.defineProperty(window.navigator, 'getBattery', {
      value: () => Promise.resolve(batteryMock),
      configurable: true,
      writable: true
    });

    const vm = mountHook(() => useBatteryStatus());
    await flushP();
    batteryMock.chargingTime = 50;
    map.chargingtimechange();
    expect(vm.chargingTime).toBe(50);
  });

  test(`should update the dischargingTime when it changes`, async () => {
    const batteryMock = mockBatteryManager({ charging: true, chargingTime: 140, dischargingTime: 40, level: 1 });
    Object.defineProperty(window.navigator, 'getBattery', {
      value: () => Promise.resolve(batteryMock),
      configurable: true,
      writable: true
    });

    const vm = mountHook(() => useBatteryStatus());
    await flushP();
    batteryMock.dischargingTime = 10;
    map.dischargingtimechange();
    expect(vm.dischargingTime).toBe(10);
  });

  test(`should update the level when it changes`, async () => {
    const batteryMock = mockBatteryManager({ charging: true, chargingTime: 140, dischargingTime: 40, level: 1 });
    Object.defineProperty(window.navigator, 'getBattery', {
      value: () => Promise.resolve(batteryMock),
      configurable: true,
      writable: true
    });

    const vm = mountHook(() => useBatteryStatus());
    await flushP();
    batteryMock.level = 0.4;
    map.levelchange();
    expect(vm.level).toBe(0.4);
  });
});

describe('use Battery Budget', () => {
  test(`should return "true" for isCharging budget`, async () => {
    Object.defineProperty(window.navigator, 'getBattery', {
      value: () =>
        Promise.resolve(mockBatteryManager({ charging: true, chargingTime: 1, dischargingTime: 0, level: 1 })),
      configurable: true,
      writable: true
    });
    const vm = mountHook(() => {
      const isChargingBudget = useBatteryStatusBudget({ isCharging: true });

      return {
        isChargingBudget
      };
    });

    await flushP();

    expect(vm.isChargingBudget).toBe(true);
  });

  test(`should return "false" for isCharging budget`, async () => {
    Object.defineProperty(window.navigator, 'getBattery', {
      value: () =>
        Promise.resolve(mockBatteryManager({ charging: false, chargingTime: 1, dischargingTime: 0, level: 1 })),
      configurable: true,
      writable: true
    });
    const vm = mountHook(() => {
      const isChargingBudget = useBatteryStatusBudget({ isCharging: true });

      return {
        isChargingBudget
      };
    });

    await flushP();

    expect(vm.isChargingBudget).toBe(false);
  });

  test(`should return "true" for level budget`, async () => {
    Object.defineProperty(window.navigator, 'getBattery', {
      value: () =>
        Promise.resolve(mockBatteryManager({ charging: false, chargingTime: 1, dischargingTime: 0, level: 0.5 })),
      configurable: true,
      writable: true
    });
    const vm = mountHook(() => {
      const isWithinLevels = useBatteryStatusBudget({ level: 0.4 });

      return {
        isWithinLevels
      };
    });
    await flushP();

    expect(vm.isWithinLevels).toBe(true);
  });

  test(`should return "false" for level budget`, async () => {
    Object.defineProperty(window.navigator, 'getBattery', {
      value: () =>
        Promise.resolve(mockBatteryManager({ charging: false, chargingTime: 1, dischargingTime: 0, level: 0.3 })),
      configurable: true,
      writable: true
    });
    const vm = mountHook(() => {
      const isWithinLevels = useBatteryStatusBudget({ level: 0.4 });

      return {
        isWithinLevels
      };
    });

    await flushP();

    expect(vm.isWithinLevels).toBe(false);
  });
});
