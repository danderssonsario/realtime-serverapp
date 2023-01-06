/**
 * Issues routes.
 *
 * @author Daniel Andersson
 */
import express from 'express'
import { IssuesController } from '../controllers/issues-controller.js'

export const router = express.Router()

const controller = new IssuesController()

router.get('/', (req, res, next) => controller.index(req, res, next))

router.get('/create', (req, res, next) => controller.create(req, res, next))

router.post('/:id/close', (req, res, next) => controller.close(req, res, next))
router.post('/:id/open', (req, res, next) => controller.reopen(req, res, next))
