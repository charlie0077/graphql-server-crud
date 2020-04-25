module.exports = {
    title: 'GraphQL Server CRUD',
    description: 'Create GraphQL API server CRUD without boilerplate code',
    locales: {
        // The key is the path for the locale to be nested under.
        // As a special case, the default locale can use '/' as its path.
        '/': {
            lang: 'en-US', // this will be set as the lang attribute on <html>
            title: 'GraphQL Server CRUD',
            description: 'Create GraphQL API server CRUD without boilerplate code'
        },
        '/zh/': {
            lang: 'zh-CN',
            title: 'GraphQL Server CRUD',
            description: '快速搭建GraphQL服务器'
        }
    },
    themeConfig: {
        nav: [
            { text: 'Guide', link: '/guide/' },
            { text: 'Example', link: '/example/' },
            { text: 'Github', link: 'https://github.com/charlie0077/graphql-server-crud' },
        ],
        sidebarDepth: 2,
        sidebar: [
            {
                title: 'Guide',
                collapsable: false,
                children: [
                    '/guide/',
                    '/guide/getting-started',
                    '/guide/model',
                    '/guide/queries',
                    '/guide/mutations',
                    '/guide/database-client',
                    '/guide/configurations'
                ]
            },
            {
                title: 'Example',
                collapsable: false,
                children: [
                    '/example/',
                    '/example/data',
                    '/example/query',
                    '/example/mutation'
                ]
            },
            {
                title: 'Advanced',
                collapsable: false,
                children: [
                    '/advanced/batching',
                    '/advanced/derived-table',
                    '/advanced/custom-logic',
                    '/advanced/working-with-other-resources',
                    '/advanced/limitations'
                ]
            },
            {
                title: 'Technical considerations',
                collapsable: false,
                children: [
                    '/tech/model-definition'
                ]
            }
        ],
        lastUpdated: 'Last Updated', // string | boolean
        // if your docs are in a different repo from your main project:
        docsRepo: 'charlie0077/graphql-server-crud',
        // if your docs are not at the root of the repo:
        docsDir: 'docs',
        // if your docs are in a specific branch (defaults to 'master'):
        docsBranch: 'master',
        // defaults to false, set to true to enable
        editLinks: true,
        smoothScroll: true,
        locales: {
            '/': {
                selectText: 'Language',
                label: 'English',
                editLinkText: 'Help us improve this page!',
                serviceWorker: {
                    updatePopup: {
                        message: "Found new update",
                        buttonText: "refresh"
                    }
                },
            },
            '/zh/': {
                // 多语言下拉菜单的标题
                selectText: '选择语言',
                // 该语言在下拉菜单中的标签
                label: '简体中文',
                // 编辑链接文字
                editLinkText: '在 GitHub 上编辑此页',
                // Service Worker 的配置
                serviceWorker: {
                    updatePopup: {
                        message: "发现新内容可用.",
                        buttonText: "刷新"
                    }
                },
                nav: [
                    { text: '指南', link: '/zh/guide/' },
                    { text: '示例', link: '/zh/example/' },
                    { text: 'Github', link: 'https://github.com/charlie0077/graphql-server-crud' },
                ],
                sidebarDepth: 2,
                sidebar: [
                    {
                        title: '指南',
                        collapsable: false,
                        children: [
                            '/zh/guide/',
                            '/zh/guide/getting-started',
                            '/zh/guide/model',
                            '/zh/guide/queries',
                            '/zh/guide/mutations',
                            '/zh/guide/database-client',
                            '/zh/guide/configurations'
                        ]
                    },
                    {
                        title: '示例',
                        collapsable: false,
                        children: [
                            '/zh/example/',
                            '/zh/example/data',
                            '/zh/example/query',
                            '/zh/example/mutation'
                        ]
                    },
                    {
                        title: '深入',
                        collapsable: false,
                        children: [
                            '/zh/advanced/batching',
                            '/zh/advanced/derived-table',
                            '/zh/advanced/custom-logic',
                            '/zh/advanced/working-with-other-resources',
                            '/zh/advanced/limitations'
                        ]
                    },
                    {
                        title: '技术考虑',
                        collapsable: false,
                        children: [
                            '/zh/tech/model-definition'
                        ]
                    }
                ],
                lastUpdated: '最近更新', // string | boolean
                // Optional options for generating "Edit this page" link
                docsRepo: 'charlie0077/graphql-server-crud',
                // if your docs are not at the root of the repo:
                docsDir: 'docs',
                // if your docs are in a specific branch (defaults to 'master'):
                docsBranch: 'master',
                // defaults to false, set to true to enable
                editLinks: true,
            }
        }
    }
}