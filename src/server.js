/**
 * Starting point of application.
 *
 * @author Daniel Andersson
 * @version 1.0.0
 */

import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import morgan from 'morgan'
import { dirname, join } from 'path'
import { router } from './routes/router.js'
import { fileURLToPath } from 'url'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import session from 'express-session'
import helmet from 'helmet'
import { sessionOptions } from './config/session.js'
import { helmetOptions } from './config/helmet.js'

try {
  const app = express()

  app.use(helmet(helmetOptions))

  // Create http server and pass to socket.io
  const httpServer = createServer(app)
  const io = new Server(httpServer)

  // socket.io: Track connections
  io.on('connection', (socket) => {
    console.log('socket.io: a user connected.')

    socket.on('disconnect', () => {
      console.log('socket.io: a user disconnected')
    })
  })

  const directoryFullname = dirname(fileURLToPath(import.meta.url))

  const baseURL = process.env.BASE_URL || '/'

  // Set upp morgan logger.
  app.use(morgan('dev'))

  // View engine set up.
  app.set('view engine', 'ejs')
  app.set('views', join(directoryFullname, 'views'))
  app.use(expressLayouts)
  app.set('layout', join(directoryFullname, 'views', 'layouts', 'default'))

  app.use(express.urlencoded({ extended: false }))

  app.use(express.static(join(directoryFullname, '..', 'public')))

  app.use(express.json())

  // Session set up.
  app.set('trust proxy', 1)
  app.use(session(sessionOptions))

  // Middleware before routes.
  app.use((req, res, next) => {
    res.locals.baseURL = baseURL

    res.io = io

    next()
  })

  // Routes.
  app.use('/', router)

  // Error handler,
  app.use(function (err, req, res, next) {
    if (req.originalUrl.includes('/webhooks')) {
      return res.status(err.status || 500).end(err.message)
    }

    if (err.status === 404) {
      return res.status(404).sendFile(join(directoryFullname, 'views', 'errors', '404.html'))
    }

    return res.status(500).sendFile(join(directoryFullname, 'views', 'errors', '500.html'))
  })

  // Starts http server and listen for connection.
  httpServer.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log('Press Ctrl-C to terminate...')
  })
} catch (err) {
  console.error(err)
  process.exitCode = 1
}
