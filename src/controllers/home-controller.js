/**
 * Home Controller.
 *
 * @author Daniel Andersson
 */

/**
 * Encapsulates a controller.
 */
export class HomeController {
  /**
   * Renders a view.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Next middleware function.
   */
  index (req, res, next) {
    res.render('home/index')
  }
}
