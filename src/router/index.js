import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'

import Expenses from '@/components/expenses'
import Bills from '@/components/bills'

import Page404 from '@/components/error_404'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'Hello',
            component: Hello
        },
        {
            path: '/expenses',
            name: 'Expenses',
            component: Expenses
        },
        {
            path: '/bills',
            name: 'Bills',
            component: Bills
        },
        {
            path: "*",
            name: 'PageNotMatch',
            component: Page404
        }
    ]
})