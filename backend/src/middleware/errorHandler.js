export function notFound(req, res) {
  res.status(404).json({ detail: 'Ruta no encontrada' });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({ detail: err.message || 'Error interno del servidor' });
}
