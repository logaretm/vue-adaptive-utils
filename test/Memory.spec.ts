import { mountHook } from './helpers';
import { useMemoryStatus } from '../src';

const getMemoryStatus = (vm: any) => ({
  isUnsupported: vm.isUnsupported,
  deviceMemory: vm.deviceMemory,
  totalJSHeapSize: vm.totalJSHeapSize,
  usedJSHeapSize: vm.usedJSHeapSize,
  jsHeapSizeLimit: vm.jsHeapSizeLimit
});

describe('useMemoryStatus', () => {
  test(`should return "true" for unsupported case`, () => {
    const vm = mountHook(() => useMemoryStatus());

    expect(vm.isUnsupported).toBe(true);
  });

  test('should return initialMemoryStatus for unsupported case', () => {
    const deviceMemory = 4;
    (global as any).navigator.deviceMemory = deviceMemory;

    const vm = mountHook(() => useMemoryStatus());

    expect(vm.isUnsupported).toBe(false);
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
      isUnsupported: false
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
    expect(vm.isUnsupported).toEqual(false);
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
      isUnsupported: false
    });
  });
});
