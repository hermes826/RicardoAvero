import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, unique: true },
    whatsapp: { type: String, default: '' },
    address: { type: String, default: '' },
    email: { type: String, default: '' },
    promotion: { type: String, default: '' },
  },
  { timestamps: true }
);

settingSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Setting = mongoose.model('Setting', settingSchema);
