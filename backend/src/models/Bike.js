import mongoose from 'mongoose';

const bikeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    condition: { type: String, enum: ['nuevo', 'km0', 'ocasion'], required: true },
    status: { type: String, enum: ['disponible', 'reservada', 'vendida'], default: 'disponible' },
    year: { type: Number, default: null },
    brand: { type: String, default: null, trim: true },
    model: { type: String, default: null, trim: true },
    kilometers: { type: Number, default: null, min: 0 },
    featured: { type: Boolean, default: false },
    images: { type: [String], default: [] },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

bikeSchema.index({ title: 'text', description: 'text', brand: 'text', model: 'text' });

bikeSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Bike = mongoose.model('Bike', bikeSchema);
