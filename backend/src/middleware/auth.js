const jwt = require('jsonwebtoken')
const { getUserById } = require('../models/userModel')
const config = require('../config/env')

function authMiddleware(allowedRoles = []) {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null

    if (!token) {
      return res.status(401).json({ message: 'Authorization token required' })
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] })
      const user = await getUserById(decoded.id)

      if (!user) {
        return res.status(401).json({ message: 'User not found' })
      }

      if (Number(decoded.version || 0) !== Number(user.token_version || 0)) {
        return res.status(401).json({ message: 'Session expired. Sign in again.' })
      }
      req.user = user

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Permission denied' })
      }

      return next()
    } catch (error) {
      if (['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(error.name)) {
        return res.status(401).json({ message: 'Invalid or expired token' })
      }
      return next(error)
    }
  }
}

module.exports = {
  authMiddleware,
}
