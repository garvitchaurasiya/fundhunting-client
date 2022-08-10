const routes = require('next-routes')()

routes
    .add('/profile/:username', '/profile')

module.exports = routes;