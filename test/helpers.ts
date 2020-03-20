import { createApp, compile } from 'vue';

export function mount(component: Record<string, any>) {
  const app = createApp(component);
  app.config.devtools = false;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  app.config.warnHandler = () => {};
  app.config.errorHandler = err => {
    if ((err as Error).message === 'data is not defined') {
      return;
    }

    // eslint-disable-next-line no-console
    console.error(err);
  };

  document.body.innerHTML = `<div id="app"></div>`;
  component.render = compile(component.template);
  component.template = undefined;

  return app.mount('#app');
}

/**
 * Takes a hook fn and exposes its values for direct access.
 *
 * @param fn The function to unwrap its API
 */
export function mountHook(fn: () => Record<string, any>) {
  const component = {
    setup() {
      const api = fn();

      return api;
    },
    template: '<div></div>'
  };

  return mount(component) as any;
}
