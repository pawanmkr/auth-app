import { Request, Response, NextFunction } from 'express';

export default function onlyAdminsAllowed(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.body.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            message:
                'Forbidden: Only admins can do this operation. Please contact your admin',
        });
    }
}
