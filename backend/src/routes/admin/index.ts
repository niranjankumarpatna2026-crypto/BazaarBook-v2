import { Router } from 'express';
import authRoutes from './auth.js';
import dashboardRoutes from './dashboard.js';
import usersRoutes from './users.js';
import paymentsRoutes from './payments.js';

const router = Router();
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/users', usersRoutes);
router.use('/payments', paymentsRoutes);
export default router;
