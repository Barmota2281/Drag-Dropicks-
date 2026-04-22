import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import BoardView from '../views/BoardView.vue'
import ProfileView from '../views/ProfileView.vue'
import SettingsView from '../views/SettingsView.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/board',
        name: 'Board',
        component: BoardView
    },
    {
        path: '/profile',
        name: 'Profile',
        component: ProfileView
    },
    {
        path: '/settings',
        name: 'Settings',
        component: SettingsView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
