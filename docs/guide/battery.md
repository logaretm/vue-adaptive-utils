# Battery Status

[Battery status](https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API) is a Web API that's available only on chrome because it was deprecated on Firefox. It exposes useful information about the device battery status, like if it is currently charging and the current charge level.

## Usage

You can use the `useBatteryStatus` function to gain access to the battery information:

```js
import { useBatteryStatus } from 'vue-adaptive-utils';

export default {
  setup() {
    const info = useBatteryStatus();
  }
};
```

The `useBatteryStatus` returns the following properties and methods:

:::tip
The **Ref Type** column represents the underlying exposed type of the refs. **All the exposed Refs are read-only**.
:::

| Prop            | Ref Type  | Fallback Value | Description                                                                          |
| --------------- | --------- | -------------- | ------------------------------------------------------------------------------------ |
| isCharging      | `boolean` | `false`        | Wether the device is currently charging or not.                                      |
| chargingTime    | `number`  | `0`            | The time the device needs to be fully charged in seconds, 0 means its fully charged. |
| dischargingTime | `number`  | `0`            | The time the device has left to be drained and about to shutdown.                    |
| level           | `number`  | `1`            | A number between `0` and `1` to represent the current charge level.                  |
| isSupported     | `boolean` | `false`        | If the API is supported on this device.                                              |
