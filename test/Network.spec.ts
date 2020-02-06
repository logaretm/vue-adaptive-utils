import { useNetworkStatus } from '../src';
import { mountHook } from './helpers';

describe('useNetworkStatus', () => {
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

  const testEctStatusEventListenerMethod = (method: any) => {
    expect(method).toBeCalledTimes(1);
    expect(method.mock.calls[0][0]).toEqual('change');
    expect(method.mock.calls[0][1].constructor).toEqual(Function);
  };

  test(`should return "false" for unsupported case`, () => {
    const vm = mountHook(() => useNetworkStatus());

    expect(vm.isSupported).toBe(false);
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
