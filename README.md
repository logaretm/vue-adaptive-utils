# vue-adaptive-utils

> Deliver empathetic experiences to your users by adapting to their capabilities

<p align="center">

[![codecov](https://codecov.io/gh/logaretm/vue-adaptive-utils/branch/master/graph/badge.svg)](https://codecov.io/gh/logaretm/vue-adaptive-utils)
[![Build Status](https://travis-ci.org/logaretm/vue-adaptive-utils.svg?branch=master)](https://travis-ci.org/logaretm/vue-adaptive-utils)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/087bd788687c4ccab6650756ce56fa05)](https://www.codacy.com/app/logaretm/vue-adaptive-utils)
[![npm](https://img.shields.io/npm/dm/vue-adaptive-utils.svg)](https://npm-stat.com/charts.html?package=vue-adaptive-utils)
[![npm](https://img.shields.io/npm/v/vue-adaptive-utils.svg)](https://www.npmjs.com/package/vue-adaptive-utils)
[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/logaretm/vue-adaptive-utils.svg)](http://isitmaintained.com/project/logaretm/vue-adaptive-utils 'Average time to resolve an issue')
[![Percentage of issues still open](http://isitmaintained.com/badge/open/logaretm/vue-adaptive-utils.svg)](http://isitmaintained.com/project/logaretm/vue-adaptive-utils 'Percentage of issues still open')

</p>
<br>

## What is this

Inspired by [react-adaptive-hooks](https://github.com/GoogleChromeLabs/react-adaptive-hooks), and a continuation of my work in [vue-use-web](https://github.com/logaretm/vue-use-web).

This is a collection of Vue 3.0 composition API functions and utilties to allow your apps to adapt your user's:

- Network conditions.
- Battery Status.
- CPU Cores.
- Device Memory.

I have iterated on this idea multiple times, once in my article: [Resource-Adaptive Vue Apps](https://logaretm.com/blog/2019-07-19-resource-adaptive-vue-apps/) which discussed this idea prior to the introduction of the composition API, I have enhanced the idea even more in my work in [vue-use-web](https://github.com/logaretm/vue-use-web).

With the Vue 3.0 composition API introduction, this is a perfect way to consume such functionalities into your components. This library is aimed to Vue 3.0 and already working with the Alpha releases.

## Why

This **is not** "yet another web APIs wrappers for Vue's upcoming composition API", this project aims to focus on only the APIs that allow you to tailor your website experience based on various factors like network status, device memory and more. It allows you to build "adaptive" vue applications that are aware of your users devices limitation and to be more empathetic towards them.

This library aims to bring value with those composition functions, not only mirroring the native web APIs that's underneath.

## Install

```sh
yarn add vue-adaptive-utils

# or

npm i vue-adaptive-utils --save
```

## Usage

Import the composition function(s) that you will use:

```js
import { useNetworkStatus } from 'vue-adaptive-utils';
import { useBattery } from 'vue-adaptive-utils';
import { useHardwareConcurrency } from 'vue-adaptive-utils';
import { useMemoryStatus } from 'vue-adaptive-utils';
```

Each of the composition functions return an `unsupported` value to indicate if the API is supported or not.

> ⚠ All the values exposed are **read only** and cannot be mutated.

### Network Status

This is a **compounded API**, meaning it collects various information from multiple APIs, them being the `Connection API` and `online/offline` events.

**Partial Compatibility**: The `unsupported` flag here refers to the availability of the `Connection API`, the `isOnline` and `offlineAt` properties should be available in all browsers.

```js
import { useNetworkStatus } from 'vue-adaptive-utils';

const {
  isOnline,
  saveData,
  offlineAt,
  downlink,
  downlinkMax,
  effectiveConnectionType,
  networkType,
  unsupported
} = useNetworkStatus();
```

### Battery Status

This is an experimental API and is only available on Chrome at the moment.

```js
import { useBattery } from 'vue-adaptive-utils';

const { charging, chargingTime, dischargingTime, level, unsupported } = useBattery();
```

### Hardware Concurrency (CPU Cores)

```js
import { useHardwareConcurrency } from 'vue-adaptive-utils';

const { concurrency, unsupported } = useHardwareConcurrency();
```

### Memory Status

This is a **compounded API**, meaning it collects various information from multiple APIs, mainly the `navigator.deviceMemory` and `navigator.performance`.

```js
import { useHardwareConcurrency } from 'vue-adaptive-utils';

const { deviceMemory, totalJSHeapSize, usedJSHeapSize, jsHeapSizeLimit, unsupported } = useMemoryStatus();
```

## Browser Support

- [Battery API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/battery) is only available on Chrome.
- [Connection API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/connection) is available on Chrome 61+ and Firefox.
- [Device Memory](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/deviceMemory) is available on Chrome 63+.
- Performance memory API is a non-standard and only available in Chrome 7+, Opera, Chrome for Android 18+, Opera for Android.

## License

Licensed under the MIT license.
