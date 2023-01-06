/**
 * Webhooks routes.
 *
 * @author Daniel Andersson
 */

import express from 'express'
import { WebhooksController } from '../controllers/webhooks-controller.js'

export const router = express.Router()

const webhooksController = new WebhooksController()

router.post('/', webhooksController.authenticate, webhooksController.indexPost)
