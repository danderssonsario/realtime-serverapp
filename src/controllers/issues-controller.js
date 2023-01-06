/**
 * Issues Controller.
 *
 * @author Daniel Andersson
 */
import createError from 'http-errors'
import fetch from 'node-fetch'

/**
 * Encapsulates a controller.
 */
export class IssuesController {
  /**
   * Fetches issues and renders them.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Next middleware function.
   */
  async index (req, res, next) {
    try {
      const response = await fetch('https://gitlab.lnu.se/api/v4/projects/21104/issues', {
        headers: { 'PRIVATE-TOKEN': process.env.GITLAB_ACCESS_TOKEN }
      })

      const viewData = await response.json()

      res.render('issues/index', { viewData })
    } catch (err) {
      next(createError(404))
    }
  }

  /**
   * Closes an issue through Gitlab API.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Next middleware function.
   */
  async close (req, res, next) {
    try {
      await fetch(
        `https://gitlab.lnu.se/api/v4/projects/21104/issues/${req.params.id}?state_event=close`,
        {
          method: 'PUT',
          headers: {
            'PRIVATE-TOKEN': process.env.GITLAB_ACCESS_TOKEN,
            'Content-Type': 'application/json'
          }
        }
      )
      res.redirect('..')
    } catch (error) {
      next(createError(404))
    }
  }

  /**
   * Reopens an issue through Gitlab API.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Next middleware function.
   */
  async reopen (req, res, next) {
    try {
      await fetch(
        `https://gitlab.lnu.se/api/v4/projects/21104/issues/${req.params.id}?state_event=reopen`,
        {
          method: 'PUT',
          headers: {
            'PRIVATE-TOKEN': process.env.GITLAB_ACCESS_TOKEN,
            'Content-Type': 'application/json'
          }
        }
      )
      res.redirect('..')
    } catch (err) {
      next(createError(404))
    }
  }
}
