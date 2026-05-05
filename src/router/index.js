import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import BoardView from '../views/BoardView.vue'
import CalendarView from '../views/CalendarView.vue'
import ProfileView from '../views/ProfileView.vue'
import SettingsView from '../views/SettingsView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import { authService } from '../services/auth.service'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterView
    },
    {
        path: '/board',
        name: 'Board',
        component: BoardView,
        meta: { requiresAuth: true }
    },
    {
        path: '/calendar',
        name: 'Calendar',
        component: CalendarView,
        meta: { requiresAuth: true }
    },
    {
        path: '/profile',
        name: 'Profile',
        component: ProfileView,
        meta: { requiresAuth: true }
    },
    {
        path: '/settings',
        name: 'Settings',
        component: SettingsView,
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = authService.isAuthenticated();
    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ path: '/login', replace: true });
    } else if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated) {
        next({ path: '/board', replace: true });
    } else {
        next();
    }
})

export default router