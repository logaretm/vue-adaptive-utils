import { mountHook } from './helpers';
import { useBattery } from '../src';
import flushP from 'flush-promises';

describe('use Battery', () => {
  const navigator = window.navigator;

  const map: Record<string, Function> = {};
  const fakeEventTarget = {
    addEventListener: jest.fn(function(this: any, event: string, callback: Function) {
      map[event] = callback.bind(this);
    }),
    removeEventListener: jest.fn()
  };

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

  afterEach(() => {
    // @ts-ignore
    if (!window.navigator) window.navigator = navigator;
    Object.values(fakeEventTarget).forEach(listener => listener.mockClear());
  });

  test(`should return "false" for unsupported case`, async () => {
    Object.defineProperty(window, 'navigator', {
      value: undefined,
      configurable: true,
      writable: true
    });
    const vm = mountHook(() => useBattery());

    expect(vm.isSupported).toBe(false);
  });

  test(`should return "false" for unsupported case but report initial values`, async () => {
    Object.defineProperty(window, 'navigator', {
      value: undefined,
      configurable: true,
      writable: true
    });
    const vm = mountHook(() => useBattery({ isCharging: true, chargingTime: 540 }));

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
    const vm = mountHook(() => useBattery());

    expect(vm.isSupported).toBe(true);
  });

  test(`should report the battery status`, async () => {
    Object.defineProperty(window.navigator, 'getBattery', {
      value: () =>
        Promise.resolve(mockBatteryManager({ charging: true, chargingTime: 140, dischargingTime: 40, level: 1 })),
      configurable: true,
      writable: true
    });
    const vm = mountHook(() => useBattery());
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
    const vm = mountHook(() => useBattery());
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

    const vm = mountHook(() => useBattery());
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

    const vm = mountHook(() => useBattery());
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

    const vm = mountHook(() => useBattery());
    await flushP();
    batteryMock.level = 0.4;
    map.levelchange();
    expect(vm.level).toBe(0.4);
  });
});
