/**
 * Helmet configurations.
 */
export const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      'style-src': [
        "'self'",
        'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css'
      ],
      'script-src': [
        "'self'",
        'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js'
      ],
      'img-src': ["'self'", 'secure.gravatar.com']
    }
  }
}
