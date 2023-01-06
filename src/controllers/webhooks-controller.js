/**
 * Webhooks controller.
 *
 * @author Daniel Andersson
 */
import createError from 'http-errors'

/**
 * Encapsulates a controller.
 */
export class WebhooksController {
  /**
   * Webhook authentication.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Next middleware function.
   */
  authenticate (req, res, next) {
    if (req.headers['x-gitlab-token'] !== process.env.WEBHOOK_SECRET) {
      next(createError(401, 'Invalid token'))
      return
    }
    next()
  }

  /**
   * Creates a new issue from the webhook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Next middleware function.
   */
  async indexPost (req, res, next) {
    try {
      res.status(200).end()
      let issue = null

      if (req.body.event_type === 'issue') {
        if (req.body.object_attributes.action === 'reopen') {
          issue = {
            id: req.body.object_attributes.id,
            title: req.body.object_attributes.title
          }
          res.io.emit('issues/reopen', issue)
        } else if (req.body.object_attributes.action === 'close') {
          issue = {
            id: req.body.object_attributes.id,
            title: req.body.object_attributes.title
          }
          res.io.emit('issues/close', issue)
        } else if (req.body.object_attributes.action === 'update') {
          issue = {
            id: req.body.object_attributes.id,
            newDescription: req.body.changes.description.current
          }
          res.io.emit('issues/update', issue)
        } else {
          issue = {
            id: req.body.object_attributes.id,
            iid: req.body.object_attributes.iid,
            title: req.body.object_attributes.title,
            description: req.body.object_attributes.description,
            name: req.body.user.name,
            username: req.body.user.username,
            avatar: req.body.user.avatar_url
          }
          res.io.emit('issues/create', issue)
        }
      }
    } catch (err) {
      next(createError(500))
    }
  }
}
