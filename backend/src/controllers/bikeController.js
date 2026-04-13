import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Bike } from '../models/Bike.js';
import cloudinary, { isCloudinaryConfigured } from '../lib/cloudinary.js';

const isDevelopment = process.env.NODE_ENV === 'development';

function normalizeBikePayload(payload = {}) {
  const output = { ...payload };

  if (output.price !== undefined) output.price = Number(output.price);
  if (output.year === '' || output.year === null) output.year = null;
  if (output.year !== undefined && output.year !== null) output.year = Number(output.year);
  if (output.kilometers === '' || output.kilometers === null) output.kilometers = null;
  if (output.kilometers !== undefined && output.kilometers !== null) {
    output.kilometers = Number(output.kilometers);
  }
  if (output.featured !== undefined) output.featured = Boolean(output.featured);

  return output;
}

function buildLocalFileUrl(req, filename) {
  return `${req.protocol}://${req.get('host')}/api/files/${filename}`;
}

function getLocalFilePathFromUrl(url) {
  try {
    const parsed = new URL(url);
    if (!parsed.pathname.startsWith('/api/files/')) return null;
    const filename = decodeURIComponent(parsed.pathname.replace('/api/files/', ''));
    return path.join(process.cwd(), 'uploads', filename);
  } catch {
    return null;
  }
}

async function destroyLocalImageByUrl(url) {
  const filePath = getLocalFilePathFromUrl(url);
  if (!filePath) return;
  await fs.unlink(filePath).catch(() => {});
}

export async function listBikes(req, res) {
  const { status, featured } = req.query;
  const query = {};

  if (status) query.status = status;
  if (featured !== undefined) query.featured = featured === 'true';

  const bikes = await Bike.find(query).sort({ created_at: -1 });
  res.json(bikes.map((bike) => bike.toJSON()));
}

export async function getBike(req, res) {
  const bike = await Bike.findById(req.params.id);
  if (!bike) return res.status(404).json({ detail: 'Moto no encontrada' });
  res.json(bike.toJSON());
}

export async function createBike(req, res) {
  const { title, description, price, condition } = req.body;

  if (!title || !description || price === undefined || !condition) {
    return res.status(400).json({ detail: 'Faltan campos obligatorios' });
  }

  const bike = await Bike.create({ ...normalizeBikePayload(req.body), images: [] });
  res.status(201).json(bike.toJSON());
}

export async function updateBike(req, res) {
  const bike = await Bike.findByIdAndUpdate(
    req.params.id,
    normalizeBikePayload(req.body),
    { new: true, runValidators: true }
  );

  if (!bike) return res.status(404).json({ detail: 'Moto no encontrada' });
  res.json(bike.toJSON());
}

async function uploadImageToCloudinary(fileBuffer, folder, originalName) {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary no está configurado en el backend');
  }

  const originalBaseName = originalName?.split('.')?.[0] || 'bike-image';
  const publicId = `${originalBaseName}-${uuidv4()}`;

  return await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        public_id: publicId,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
}

function parseCloudinaryPublicIdFromUrl(url) {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes('cloudinary.com')) return null;

    const parts = parsed.pathname.split('/').filter(Boolean);
    const uploadIndex = parts.findIndex((part) => part === 'upload');
    if (uploadIndex === -1) return null;

    let assetParts = parts.slice(uploadIndex + 1);
    if (assetParts[0]?.startsWith('v')) {
      assetParts = assetParts.slice(1);
    }

    const joined = assetParts.join('/');
    return joined.replace(/\.[^.]+$/, '');
  } catch {
    return null;
  }
}

async function destroyCloudinaryImageByUrl(url) {
  if (!isCloudinaryConfigured()) return;

  const publicId = parseCloudinaryPublicIdFromUrl(url);
  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId, { resource_type: 'image' }).catch(() => {});
}

export async function deleteBike(req, res) {
  const bike = await Bike.findById(req.params.id);
  if (!bike) return res.status(404).json({ detail: 'Moto no encontrada' });

  for (const imageUrl of bike.images || []) {
    if (isDevelopment) {
      await destroyLocalImageByUrl(imageUrl);
    } else {
      await destroyCloudinaryImageByUrl(imageUrl);
    }
  }

  await Bike.deleteOne({ _id: bike._id });
  res.json({ message: 'Moto eliminada correctamente' });
}

export async function addBikeImage(req, res) {
  const bike = await Bike.findById(req.params.id);
  if (!bike) return res.status(404).json({ detail: 'Moto no encontrada' });

  if (!req.file) {
    return res.status(400).json({ detail: 'No se ha recibido ninguna imagen' });
  }

  if (isDevelopment) {
    const localUrl = buildLocalFileUrl(req, req.file.filename);
    bike.images.push(localUrl);
    await bike.save();

    return res.json({
      path: localUrl,
      id: req.file.filename,
    });
  }

  if (!isCloudinaryConfigured()) {
    return res.status(500).json({ detail: 'Cloudinary no está configurado en el backend' });
  }

  const uploadResult = await uploadImageToCloudinary(
    req.file.buffer,
    `factory-motor-bike/bikes/${bike.id}`,
    req.file.originalname
  );

  bike.images.push(uploadResult.secure_url);
  await bike.save();

  res.json({ path: uploadResult.secure_url, id: uploadResult.public_id });
}

export async function deleteBikeImage(req, res) {
  const bike = await Bike.findById(req.params.id);
  if (!bike) return res.status(404).json({ detail: 'Moto no encontrada' });

  const imagePath = decodeURIComponent(req.params.imagePath);
  bike.images = (bike.images || []).filter((item) => item !== imagePath);
  await bike.save();

  if (isDevelopment) {
    await destroyLocalImageByUrl(imagePath);
  } else {
    await destroyCloudinaryImageByUrl(imagePath);
  }

  res.json({ message: 'Imagen eliminada' });
}
