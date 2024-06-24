import { createRouter, createWebHistory } from 'vue-router';
import LeadCommissionCalculator from '@/components/LeadCommissionCalculator.vue';
import SalesCommissionCalculator from '@/components/SalesCommissionCalculator.vue';

const routes = [
  {
    path: '/lead',
    name: 'LeadCommissionCalculator',
    component: LeadCommissionCalculator
  },

  {
    path: '/sales',
    name: 'SalesCommissionCalculator',
    component: SalesCommissionCalculator
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;