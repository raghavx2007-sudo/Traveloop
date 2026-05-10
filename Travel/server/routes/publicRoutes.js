import express from 'express';
import { getPublicTrips, getPublicTrip } from '../controllers/publicController.js';

const router = express.Router();

router.get('/trips', getPublicTrips);
router.get('/trips/:id', getPublicTrip);

export default router;
