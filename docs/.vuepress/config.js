module.exports = {
    title: 'GraphQL Server CRUD',
    description: 'Create GraphQL API server CRUD without boilerplate code',
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

        // Optional options for generating "Edit this page" link

        // if your docs are in a different repo from your main project:
        docsRepo: 'vuejs/vuepress',
        // if your docs are not at the root of the repo:
        docsDir: 'docs',
        // if your docs are in a specific branch (defaults to 'master'):
        docsBranch: 'master',
        // defaults to false, set to true to enable
        editLinks: true,
        // custom text for edit link. Defaults to "Edit this page"
        editLinkText: 'Help us improve this page!'
    }
}