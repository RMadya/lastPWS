/**
 * Role-Based Access Control Middleware
 * Checks if user has required role (admin)
 */
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }

    next();
};

/**
 * Check if user is accessing their own resource
 */
const requireOwnerOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    const resourceUserId = parseInt(req.params.userId || req.params.id_user);

    if (req.user.role === 'admin' || req.user.id_user === resourceUserId) {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: 'Access denied'
    });
};

module.exports = {
    requireAdmin,
    requireOwnerOrAdmin
};
