import { Router, raw } from 'express';
const router = Router();

router.post('/razorpay', raw({ type: 'application/json' }), async (req, res) => {
  try {
    console.log('Webhook received');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).send('Error');
  }
});

export default router;
