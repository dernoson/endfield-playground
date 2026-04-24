import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/app/layouts/MainLayout.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'editor',
            component: MainLayout,
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/',
        },
    ],
});

export default router;
