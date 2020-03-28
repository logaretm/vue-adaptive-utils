# Network Status

The [Network Information](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/connection) is a Web API that provides useful information about the device's connection. To quote from the MDN:

> containing information about the system's connection, such as the current bandwidth of the user's device or whether the connection is metered. This could be used to select high definition content or low definition content based on the user's connection.

## Usage

You can use the `useNetworkStatus` function to gain access to the network information:

```js
import { useNetworkStatus } from 'vue-adaptive-utils';

export default {
  setup() {
    const info = useNetworkStatus();
  }
};
```

The `useNetworkStatus` returns the following properties and methods:

:::tip
The **Ref Type** column represents the underlying exposed type of the refs. **All the exposed Refs are read-only**.
:::

| Prop                    | Ref Type                                                                                  | Fallback Value | Description                                                           |
| ----------------------- | ----------------------------------------------------------------------------------------- | -------------- | --------------------------------------------------------------------- |
| isOnline                | `boolean`                                                                                 | `true`         | Wether the device is currently connected or not.                      |
| saveData                | `boolean`                                                                                 | `false`        | Wether the device has the "save data" option enabled or not.          |
| offlineAt               | `number`                                                                                  | `undefined`    | A timestamp when the user was last disconnected.                      |
| downlink                | `number`                                                                                  | `undefined`    | The average download speed of the connection in megabits per second.  |
| downlinkMax             | `number`                                                                                  | `undefined`    | The maximum download speed of the connection in megabits per second.  |
| effectiveConnectionType | `'slow-2g' | '2g' | '3g' | '4g' | undefined`                                              | `undefined`    | Effective type of the connection.                                     |
| networkType             | `'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown'` | `undefined`    | type of connection a device is using to communicate with the network. |
| isSupported             | `boolean`                                                                                 | `false`        | If the API is supported on this device.                               |
