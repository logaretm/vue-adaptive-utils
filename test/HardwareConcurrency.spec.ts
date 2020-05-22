import { mountHook } from './helpers';
import { useHardwareConcurrency, useHardwareConcurrencyBudget } from '../src';

describe('useHardwareConcurrency', () => {
  const navigator = window.navigator;

  afterEach(() => {
    // @ts-ignore
    if (!window.navigator) window.navigator = navigator;
  });

  test(`should return "false" for unsupported case`, async () => {
    Object.defineProperty(window, 'navigator', {
      value: undefined,
      configurable: true,
      writable: true
    });

    const vm = mountHook(() => useHardwareConcurrency());

    expect(vm.isSupported).toBe(false);
  });

  test(`should return "false" for unsupported case but report the initial value`, async () => {
    Object.defineProperty(window, 'navigator', {
      value: undefined,
      configurable: true,
      writable: true
    });

    const vm = mountHook(() => useHardwareConcurrency(3));
    expect(vm.concurrency).toBe(3);

    expect(vm.isSupported).toBe(false);
  });

  test(`should return "true" for supported case`, () => {
    const vm = mountHook(() => useHardwareConcurrency());

    expect(vm.concurrency).toBe(window.navigator.hardwareConcurrency);
    expect(vm.isSupported).toBe(true);
  });

  test('should return 4 for device of hardwareConcurrency = 4', () => {
    Object.defineProperty(window.navigator, 'hardwareConcurrency', {
      value: 4,
      configurable: true,
      writable: true
    });
    const vm = mountHook(() => useHardwareConcurrency());

    expect(vm.concurrency).toEqual(4);
    expect(vm.isSupported).toBe(true);
  });

  test('should return 2 for device of hardwareConcurrency = 2', () => {
    Object.defineProperty(window.navigator, 'hardwareConcurrency', {
      value: 2,
      configurable: true,
      writable: true
    });
    const vm = mountHook(() => useHardwareConcurrency());

    expect(vm.concurrency).toEqual(2);
    expect(vm.isSupported).toBe(true);
  });
});

describe('useHardwareConcurrency budget', () => {
  const navigator = window.navigator;

  afterEach(() => {
    // @ts-ignore
    if (!window.navigator) window.navigator = navigator;
  });

  test('should return `false` when required budget of 2', () => {
    Object.defineProperty(window.navigator, 'hardwareConcurrency', {
      value: 1,
      configurable: true,
      writable: true
    });
    const vm = mountHook(() => {
      const hasEnoughConcurrency = useHardwareConcurrencyBudget(2);

      return {
        hasEnoughConcurrency
      };
    });

    expect(vm.hasEnoughConcurrency).toBe(false);
  });

  test('should return `true` when required budget of 2 is satisfied', () => {
    Object.defineProperty(window.navigator, 'hardwareConcurrency', {
      value: 3,
      configurable: true,
      writable: true
    });
    const vm = mountHook(() => {
      const hasEnoughConcurrency = useHardwareConcurrencyBudget(2);

      return {
        hasEnoughConcurrency
      };
    });

    expect(vm.hasEnoughConcurrency).toBe(true);
  });
});
