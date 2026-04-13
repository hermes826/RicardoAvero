import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';

export async function protect(req, res, next) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ detail: 'No autorizado' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.sub);
    if (!admin) {
      return res.status(401).json({ detail: 'Token inválido' });
    }
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ detail: 'Token inválido o expirado' });
  }
}
