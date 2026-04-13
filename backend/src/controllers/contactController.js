import { Setting } from '../models/Setting.js';

const defaults = {
  type: 'contact',
  whatsapp: '666208341',
  address: 'La Laguna, Tenerife',
  email: 'info@factorymotorbike.com',
  promotion: '¡Financiación disponible!',
};

export async function getContact(req, res) {
  let doc = await Setting.findOne({ type: 'contact' });
  if (!doc) doc = await Setting.create(defaults);
  res.json(doc.toJSON());
}

export async function updateContact(req, res) {
  const payload = {
    whatsapp: req.body.whatsapp || '',
    address: req.body.address || '',
    email: req.body.email || '',
    promotion: req.body.promotion || '',
  };
  const doc = await Setting.findOneAndUpdate(
    { type: 'contact' },
    { type: 'contact', ...payload },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.json(doc.toJSON());
}
