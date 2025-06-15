import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/LoginPage.vue'
import OTPConfirmation from '../components/OTPConfirmation.vue'
import Dashboard from '../components/Dashboard.vue'
import Contact from '../components/Contact.vue'
import Product from '../components/Product.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginPage
    },
    {
      path: '/otp-confirmation',
      name: 'OTPConfirmation',
      component: OTPConfirmation
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact
    },
    {
      path: '/product',
      name: 'Product',
      component: Product
    }
  ]
})

export default router