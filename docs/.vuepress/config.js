const sidebars = {
  guide: ['', 'battery', 'network', 'memory', 'hardware-concurrency']
};

function genSidebarConfig(...names) {
  return names.map(t => {
    return {
      title: t,
      collapsable: false,
      children: sidebars[t.toLowerCase()]
    };
  });
}

module.exports = {
  base: '/vue-adaptive-utils/',
  title: 'Vue Adaptive Utils',
  description: 'A small and fast GraphQL client for Vue.js',
  themeConfig: {
    docsDir: 'docs',
    repo: 'logaretm/vue-adaptive-utils',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' }
    ],
    sidebarDepth: 1,
    sidebar: {
      '/guide/': genSidebarConfig('Guide')
    },
    displayAllHeaders: false // Default: false
  }
};
