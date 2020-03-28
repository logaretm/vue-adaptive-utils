---
title: Introduction
lang: en-US
meta:
  - name: og:title
    content: Introduction | Vue Adaptive Utils
---

## Introduction

Inspired by [react-adaptive-hooks](https://github.com/GoogleChromeLabs/react-adaptive-hooks), and a continuation of my work in [vue-use-web](https://github.com/logaretm/vue-use-web).

This is a collection of Vue 3.0 composition API functions and utilities to allow your apps to adapt your user's:

- [Network conditions](./network.md).
- [Battery Status](./battery.md).
- [Hardware Concurrency (CPU Cores)](./hw.md).
- [Device Memory](./memory.md).

I have iterated on this idea multiple times, once in my article: [Resource-Adaptive Vue Apps](https://logaretm.com/blog/2019-07-19-resource-adaptive-vue-apps/) which discussed this idea prior to the introduction of the composition API, I have enhanced the idea even more in my work in [vue-use-web](https://github.com/logaretm/vue-use-web).

With the Vue 3.0 composition API introduction, this is a perfect way to consume such functionalities into your components. This library is aimed to Vue 3.0 and already working with the Alpha releases.

## Project Goals

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

All of the composition functions return an `isSupported` boolean ref to indicate if the API is supported or not.

You can find information about each function here

## Browser Support

- [Battery API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/battery) is only available on Chrome.
- [Connection API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/connection) is available on Chrome 61+ and Firefox.
- [Device Memory](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/deviceMemory) is available on Chrome 63+.
- Performance memory API is a non-standard and only available in Chrome 7+, Opera, Chrome for Android 18+, Opera for Android.
