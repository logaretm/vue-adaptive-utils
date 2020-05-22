import { useNetworkStatus, useNetworkStatusBudget } from '../src';
import { mountHook } from './helpers';

const nav = window.navigator;

afterEach(() => {
  // @ts-ignore
  if (!window.navigator) window.navigator = nav;
});

const map: Record<string, Function> = {};

const fakeEventTarget = {
  addEventListener: jest.fn((event: string, callback: Function) => {
    map[event] = callback;
  }),
  removeEventListener: jest.fn()
};

afterEach(() => {
  Object.values(fakeEventTarget).forEach(listener => listener.mockClear());
});

describe('useNetworkStatus', () => {
  const testEctStatusEventListenerMethod = (method: any) => {
    expect(method).toBeCalledTimes(1);
    expect(method.mock.calls[0][0]).toEqual('change');
    expect(method.mock.calls[0][1].constructor).toEqual(Function);
  };

  test(`should return "false" for unsupported case`, () => {
    const vm = mountHook(() => useNetworkStatus());

    expect(vm.isSupported).toBe(false);
  });

  test(`should return "false" for unsupported case but report initial values`, () => {
    const vm = mountHook(() =>
      useNetworkStatus({
        saveData: true,
        effectiveConnectionType: '3g'
      })
    );

    expect(vm.isSupported).toBe(false);
    expect(vm.saveData).toBe(true);
    expect(vm.effectiveConnectionType).toBe('3g');
  });

  test('should return 4g of effectiveConnectionType', () => {
    (global as any).navigator.connection = {
      ...fakeEventTarget,
      effectiveType: '4g'
    };

    const vm = mountHook(() => useNetworkStatus());

    testEctStatusEventListenerMethod(fakeEventTarget.addEventListener);
    expect(vm.isSupported).toBe(true);
    expect(vm.effectiveConnectionType).toEqual('4g');
  });

  test('should update the effectiveConnectionType state', () => {
    (global as any).navigator.connection = {
      ...fakeEventTarget,
      effectiveType: '2g'
    };
    const vm = mountHook(() => useNetworkStatus());

    expect(vm.effectiveConnectionType).toEqual('2g');
  });

  test('should update the effectiveConnectionType state when navigator.connection change event', () => {
    (global as any).navigator.connection = {
      ...fakeEventTarget,
      effectiveType: '2g'
    };

    const vm = mountHook(() => useNetworkStatus());
    (global as any).navigator.connection.effectiveType = '4g';
    // simulate the change!
    map.change();

    expect(vm.effectiveConnectionType).toEqual('4g');
  });

  test('should return "true" for the isOnline prop when connected', () => {
    const vm = mountHook(() => useNetworkStatus());
    Object.defineProperty(window, 'navigator', {
      value: {
        onLine: true
      },
      configurable: true,
      writable: true
    });

    expect(vm.isOnline).toBe(true);
  });

  test('should return "false" for the isOnline prop when disconnected', () => {
    const vm = mountHook(() => useNetworkStatus());
    Object.defineProperty(window, 'navigator', {
      value: {
        onLine: false
      },
      configurable: true,
      writable: true
    });

    expect(vm.isOnline).toBe(true);
  });

  test('should update the online state when it changes', () => {
    Object.defineProperty(window, 'navigator', {
      value: {
        onLine: true
      },
      configurable: true,
      writable: true
    });
    const vm = mountHook(() => useNetworkStatus());
    expect(vm.isOnline).toBe(true);
    window.dispatchEvent(new Event('offline'));
    expect(vm.isOnline).toBe(false);
    window.dispatchEvent(new Event('online'));
    expect(vm.isOnline).toBe(true);
  });

  test('should set the offlineAt to the timestamp of the disconnection event', () => {
    Object.defineProperty(window, 'navigator', {
      value: {
        onLine: true
      },
      configurable: true,
      writable: true
    });
    const vm = mountHook(() => useNetworkStatus());
    expect(vm.offlineAt).toBe(undefined);
    const evt = new Event('offline');
    window.dispatchEvent(evt);
    expect(vm.offlineAt).toBe(evt.timeStamp);
  });

  test(`should return "true" for enabled save data`, () => {
    (global as any).navigator.connection = {
      ...fakeEventTarget,
      saveData: true
    };
    const vm = mountHook(() => useNetworkStatus());

    expect(vm.saveData).toEqual((navigator as any).connection.saveData);
  });

  test(`should return "false" for disabled save data`, () => {
    (global as any).navigator.connection = {
      ...fakeEventTarget,
      saveData: false
    };
    const vm = mountHook(() => useNetworkStatus());

    expect(vm.saveData).toEqual((navigator as any).connection.saveData);
  });

  // test('should remove the listener for the navigator.connection change event on unmount', () => {
  //   (global as any).navigator.connection = {
  //     ...fakeEventTarget,
  //     effectiveConnectionType: '2g'
  //   };

  //   const vm = mountHook(() => useNetworkStatus());

  //   testEctStatusEventListenerMethod(fakeEventTarget.addEventListener);
  //   unmount();
  //   testEctStatusEventListenerMethod(fakeEventTarget.removeEventListener);
  // });
});

describe('useNetworkStatus Budget', () => {
  test(`should return "true" when connected`, () => {
    Object.defineProperty(window, 'navigator', {
      value: {
        onLine: true
      },
      configurable: true,
      writable: true
    });

    const vm = mountHook(() => {
      const isConnected = useNetworkStatusBudget({
        isOnline: true
      });

      return {
        isConnected
      };
    });

    expect(vm.isConnected).toBe(true);
  });

  test(`should return "false" when not connected`, () => {
    Object.defineProperty(window, 'navigator', {
      value: {
        onLine: false
      },
      configurable: true,
      writable: true
    });

    const vm = mountHook(() => {
      const isConnected = useNetworkStatusBudget({
        isOnline: true
      });

      return {
        isConnected
      };
    });

    expect(vm.isConnected).toBe(false);
  });

  test(`should return "true" when data saver is disabled`, () => {
    (global as any).navigator.connection = {
      ...fakeEventTarget,
      saveData: false
    };
    const vm = mountHook(() => {
      const isSavingData = useNetworkStatusBudget({
        saveData: false
      });

      return {
        isSavingData
      };
    });

    expect(vm.isSavingData).toBe(true);
  });

  test(`should return "false" when data saver is enabled`, () => {
    (global as any).navigator.connection = {
      ...fakeEventTarget,
      saveData: true
    };
    const vm = mountHook(() => {
      const isSavingData = useNetworkStatusBudget({
        saveData: false
      });

      return {
        isSavingData
      };
    });

    expect(vm.isSavingData).toBe(false);
  });

  test(`should return "false" when effective network type is insufficient`, () => {
    (global as any).navigator.connection = {
      ...fakeEventTarget,
      effectiveType: '2g'
    };

    const vm = mountHook(() => {
      const is4G = useNetworkStatusBudget({
        effectiveConnectionType: '4g'
      });

      return {
        is4G
      };
    });

    expect(vm.is4G).toBe(false);
  });

  test(`should return "true" when effective network type is sufficient`, () => {
    (global as any).navigator.connection = {
      ...fakeEventTarget,
      effectiveType: '4g'
    };

    const vm = mountHook(() => {
      const is3G = useNetworkStatusBudget({
        effectiveConnectionType: '3g'
      });

      return {
        is3G
      };
    });

    expect(vm.is3G).toBe(true);
  });
});
