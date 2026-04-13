import { Admin } from '../models/Admin.js';
import { createToken } from '../utils/createToken.js';

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ detail: 'Email y contraseña son obligatorios' });
  }

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (!admin) return res.status(401).json({ detail: 'Credenciales inválidas' });

  const valid = await admin.comparePassword(password);
  if (!valid) return res.status(401).json({ detail: 'Credenciales inválidas' });

  const token = createToken(admin);
  res.json({ token, admin: admin.toJSON() });
}

export async function me(req, res) {
  res.json(req.admin.toJSON());
}
