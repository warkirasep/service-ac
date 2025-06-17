import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/LoginPage.vue'
import OTPConfirmation from '../components/OTPConfirmation.vue'
import Dashboard from '../components/Dashboard.vue'
import Contact from '../components/Contact.vue'
import Product from '../components/Product.vue'
import BookingService from '../components/BookingService.vue'
import OrderService from '../components/OrderService.vue'
import ServiceIncome from '../components/ServiceIncome.vue'
import ServiceExpense from '../components/ServiceExpense.vue'
import MonthlyReport from '../components/MonthlyReport.vue'
import PersonalSettings from '../components/PersonalSettings.vue'
import Invoice from '../components/Invoice.vue'
import InvoicePDF from '../components/InvoicePDF.vue'

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
      name: 'order-service',
      component: OrderService
    },
    {
      path: '/invoice',
      name: 'Invoice',
      component: Invoice
    },
    {
      path: '/invoice-pdf',
      name: 'InvoicePDF',
      component: InvoicePDF,
      props: true
    },
    {
    path: '/service-income',
    name: 'service-income',
    component: ServiceIncome
  },
  {
    path: '/service-expense',
    name: 'service-expense',
    component: ServiceExpense
  },
  {
    path: '/monthly-report',
    name: 'monthly-report',
    component: MonthlyReport
  },
  {
    path: '/personal-settings',
    name: 'personal-settings',
    component: PersonalSettings
  },
  ]
})

export default router