# Hardware Concurrency

The [hardware concurrency](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorConcurrentHardware/hardwareConcurrency) is a navigator property that returns the number of logical processors available to run threads on the user's computer.

## Usage

You can use the `useHardwareConcurrency` function to gain access to the battery information:

```js
import { useHardwareConcurrency } from 'vue-adaptive-utils';

export default {
  setup() {
    const info = useHardwareConcurrency();
  }
};
```

The `useHardwareConcurrency` returns the following properties and methods:

:::tip
The **Ref Type** column represents the underlying exposed type of the refs. **All the exposed Refs are read-only**.
:::

| Prop        | Ref Type  | Fallback Value | Description                             |
| ----------- | --------- | -------------- | --------------------------------------- |
| concurrency | `number`  | `undefined`    | The number of logical processors.       |
| isSupported | `boolean` | `false`        | If the API is supported on this device. |

## Budget API

You can use the `useHardwareConcurrencyBudget` function to construct boolean conditions to make it easier to set budgets for your components.

You would need to pass the "minimum" ideal operating conditions for your code, for the hardware concurrency API there is only one facet which is the `expectedConcurrency`.

The `useBatteryStatusBudget` is a function that returns a single computed properly that reflects whether the concurrency on the device meets or exceeds the expected one.

```js
import { useHardwareConcurrencyBudget } from 'vue-adaptive-utils';

export default {
  setup() {
    // Device must at least have two logical CPUs (cores)
    const isOperable = useHardwareConcurrencyBudget(2);
  }
};
```
