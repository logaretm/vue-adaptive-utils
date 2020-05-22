import { mountHook } from './helpers';
import { useMemoryStatus, useMemoryStatusBudget } from '../src';

const getMemoryStatus = (vm: any) => ({
  isSupported: vm.isSupported,
  deviceMemory: vm.deviceMemory,
  totalJSHeapSize: vm.totalJSHeapSize,
  usedJSHeapSize: vm.usedJSHeapSize,
  jsHeapSizeLimit: vm.jsHeapSizeLimit
});

describe('useMemoryStatus', () => {
  test(`should return "false" for unsupported case`, () => {
    const vm = mountHook(() => useMemoryStatus());

    expect(vm.isSupported).toBe(false);
  });

  test(`should return "false" for unsupported case but report initialMemoryStatus`, () => {
    const vm = mountHook(() => useMemoryStatus({ deviceMemory: 3, usedJSHeapSize: 400 }));

    expect(vm.isSupported).toBe(false);
    expect(vm.deviceMemory).toBe(3);
    expect(vm.usedJSHeapSize).toBe(400);
    expect(vm.jsHeapSizeLimit).toBe(undefined);
  });

  test('should return device memory for isSupported case', () => {
    const deviceMemory = 4;
    (global as any).navigator.deviceMemory = deviceMemory;

    const vm = mountHook(() => useMemoryStatus());

    expect(vm.isSupported).toBe(true);
    expect(vm.deviceMemory).toEqual(deviceMemory);
  });

  test('should return memory status', () => {
    const mockMemoryStatus = {
      deviceMemory: 4,
      totalJSHeapSize: 60,
      usedJSHeapSize: 40,
      jsHeapSizeLimit: 50
    };

    (global as any).navigator.deviceMemory = mockMemoryStatus.deviceMemory;
    (global as any).window.performance.memory = {
      totalJSHeapSize: mockMemoryStatus.totalJSHeapSize,
      usedJSHeapSize: mockMemoryStatus.usedJSHeapSize,
      jsHeapSizeLimit: mockMemoryStatus.jsHeapSizeLimit
    };

    const vm = mountHook(() => useMemoryStatus());

    expect(getMemoryStatus(vm)).toMatchObject({
      ...mockMemoryStatus,
      isSupported: true
    });
  });

  test('should return memory status without performance memory data', () => {
    const mockMemoryStatus = {
      deviceMemory: 4
    };

    (global as any).navigator.deviceMemory = mockMemoryStatus.deviceMemory;
    delete (global as any).window.performance.memory;

    const vm = mountHook(() => useMemoryStatus());

    expect(vm.deviceMemory).toEqual(mockMemoryStatus.deviceMemory);
    expect(vm.isSupported).toEqual(true);
  });

  test('should not return initialMemoryStatus for supported case', () => {
    const mockMemoryStatus = {
      deviceMemory: 4,
      totalJSHeapSize: 60,
      usedJSHeapSize: 40,
      jsHeapSizeLimit: 50
    };

    // const mockInitialMemoryStatus = {
    //   deviceMemory: 4
    // };

    (global as any).navigator.deviceMemory = mockMemoryStatus.deviceMemory;

    (global as any).window.performance.memory = {
      totalJSHeapSize: mockMemoryStatus.totalJSHeapSize,
      usedJSHeapSize: mockMemoryStatus.usedJSHeapSize,
      jsHeapSizeLimit: mockMemoryStatus.jsHeapSizeLimit
    };

    const vm = mountHook(() => useMemoryStatus());

    expect(getMemoryStatus(vm)).toMatchObject({
      ...mockMemoryStatus,
      isSupported: true
    });
  });
});

describe('useMemoryStatus budget', () => {
  test(`should return "true" when there are memory more than requested`, () => {
    const deviceMemory = 2;
    (global as any).navigator.deviceMemory = deviceMemory;

    const vm = mountHook(() => {
      const hasEnoughMemory = useMemoryStatusBudget({ deviceMemory: 2 });

      return {
        hasEnoughMemory
      };
    });

    expect(vm.hasEnoughMemory).toBe(true);
  });

  test(`should return "false" when there are memory less than requested`, () => {
    const deviceMemory = 1;
    (global as any).navigator.deviceMemory = deviceMemory;

    const vm = mountHook(() => {
      const hasEnoughMemory = useMemoryStatusBudget({ deviceMemory: 2 });

      return {
        hasEnoughMemory
      };
    });

    expect(vm.hasEnoughMemory).toBe(false);
  });
});
