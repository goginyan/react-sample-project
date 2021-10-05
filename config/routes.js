export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            authority: ['admin', 'user'],
            routes: [
              {
                path: '/',
                redirect: '/lv/front/doc-templates',
              },
              {
                path: '/lv/front/doc-templates/history',
                name: 'documents-history',
                icon: 'smile',
                component: './DocTemplate/History/DocTemplateHistory',
                authority: ['user'],
              },
              {
                path: '/lv/front/doc-templates',
                name: 'Документы',
                icon: 'crown',
                component: './DocTemplate/List/DocTemplateList',
                //authority: ['admin'],
                routes: [

                ],
              },
              {
                path: '/lv/front/rate/highway',
                name: 'Тарифы',
                icon: 'crown',
                component: './Rate/List/HighwayRateTable',
                //authority: ['admin'],
              },
              {
                path: '/lv/front/rate/stock',
                name: 'Город',
                icon: 'crown',
                component: './Rate/List/StockRateTable',
                //authority: ['admin'],
              },
              {
                path: '/lv/front/rate/urgency-incr',
                name: 'Надбавка за срочность (заборы)',
                icon: 'crown',
                component: './Rate/List/UrgencyIncrRateTable',
                //authority: ['admin'],
              },
              {
                path: '/lv/front/rate/highway/urgency-incr',
                name: 'Надбавка за срочность (магистрали)',
                icon: 'crown',
                component: './Rate/List/HighwayUrgencyIncrRateTable',
                //authority: ['admin'],
              },
              {
                path: '/lv/front/rate/settings',
                name: 'Настройки',
                icon: 'crown',
                component: './Rate/Settings',
                //authority: ['admin'],
              },
              {
                path: '/lv/front/counterparty',
                name: 'контрагент',
                icon: 'crown',
                component: './Counterparty/CounterpartyIndex',
                //authority: ['admin'],
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
