import { mountHook } from './helpers';
import { useHardwareConcurrency } from '../src';

describe('useHardwareConcurrency', () => {
  const navigator = window.navigator;

  afterEach(() => {
    // @ts-ignore
    if (!window.navigator) window.navigator = navigator;
  });

  test(`should return "true" for unsupported case`, async () => {
    Object.defineProperty(window, 'navigator', {
      value: undefined,
      configurable: true,
      writable: true
    });

    const vm = mountHook(() => useHardwareConcurrency());

    expect(vm.unsupported).toBe(true);
  });

  test(`should return window.navigator.hardwareConcurrency`, () => {
    const vm = mountHook(() => useHardwareConcurrency());

    expect(vm.concurrency).toBe(window.navigator.hardwareConcurrency);
    expect(vm.unsupported).toBe(false);
  });

  test('should return 4 for device of hardwareConcurrency = 4', () => {
    Object.defineProperty(window.navigator, 'hardwareConcurrency', {
      value: 4,
      configurable: true,
      writable: true
    });
    const vm = mountHook(() => useHardwareConcurrency());

    expect(vm.concurrency).toEqual(4);
    expect(vm.unsupported).toBe(false);
  });

  test('should return 2 for device of hardwareConcurrency = 2', () => {
    Object.defineProperty(window.navigator, 'hardwareConcurrency', {
      value: 2,
      configurable: true,
      writable: true
    });
    const vm = mountHook(() => useHardwareConcurrency());

    expect(vm.concurrency).toEqual(2);
    expect(vm.unsupported).toBe(false);
  });
});
