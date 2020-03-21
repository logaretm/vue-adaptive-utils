import { onMounted } from 'vue';

export const isServer = typeof window === 'undefined';

export function runWithoutSSR(cb: () => any) {
  if (!isServer) {
    cb();
    return;
  }

  onMounted(cb);
}
