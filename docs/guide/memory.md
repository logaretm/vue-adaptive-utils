# Memory Status

## Usage

You can use the `useMemoryStatus` function to gain access to the battery information:

```js
import { useMemoryStatus } from 'vue-adaptive-utils';

export default {
  setup() {
    const info = useMemoryStatus();
  }
};
```

The `useMemoryStatus` returns the following properties and methods:

:::tip
The **Ref Type** column represents the underlying exposed type of the refs. **All the exposed Refs are read-only**.
:::

| Prop            | Ref Type  | Fallback Value | Description                                                                |
| --------------- | --------- | -------------- | -------------------------------------------------------------------------- |
| concurrency     | `number`  | `undefined`    | The number of logical processors.                                          |
| totalJSHeapSize | `number`  | `undefined`    | The total allocated heap size, in bytes..                                  |
| usedJSHeapSize  | `number`  | `undefined`    | The currently active segment of JS heap, in bytes..                        |
| jsHeapSizeLimit | `number`  | `undefined`    | The maximum size of the heap, in bytes, that is available to the context.. |
| isSupported     | `boolean` | `false`        | If `navigator.deviceMemory` is supported on this device.                   |

:::tip
The `totalJSHeapSize`, `usedJSHeapSize` and `jsHeapSizeLimit` are only available in chrome and chromium based browsers.
:::

## Budget API

You can use the `useMemoryStatusBudget` function to construct boolean conditions to make it easier to set memory budgets for your components.

You would need to pass the "minimum" ideal operating conditions for your code, for the memory status API there is only one facet which is the `deviceMemory`.

The `useMemoryStatusBudget` is a function that returns a single computed properly that reflects whether the current memory on the device meets or exceeds the supplied one.

```js
import { useMemoryStatusBudget } from 'vue-adaptive-utils';

export default {
  setup() {
    // Device must at least have 4 Gigs of RAM
    const isOperable = useMemoryStatusBudget({ deviceMemory: 4 });
  }
};
```
