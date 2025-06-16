import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/LoginPage.vue'
import OTPConfirmation from '../components/OTPConfirmation.vue'
import Dashboard from '../components/Dashboard.vue'
import Contact from '../components/Contact.vue'
import Product from '../components/Product.vue'
import BookingService from '../components/BookingService.vue'
import OrderService from '../components/OrderService.vue'

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
    },
    {
      path: '/booking-service',
      name: 'BookingService',
      component: BookingService
    },
    {
      path: '/order-service',
      name: 'OrderService',
      component: OrderService
    }
  ]
})

export default router