import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { Admin } from './models/Admin.js';
import { Bike } from './models/Bike.js';
import { Setting } from './models/Setting.js';

dotenv.config();

const bikes = [
  {
    title: 'Updated BMW S1000RR 2024 - TESTED',
    description: 'Superbike cuidada al detalle, revisada y lista para entregar. Motor lleno, electrónica avanzada y una presencia brutal en directo.',
    price: 20000,
    condition: 'ocasion',
    status: 'disponible',
    year: 2024,
    brand: 'BMW',
    model: 'S1000RR',
    kilometers: 3500,
    featured: true,
    images: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'],
  },
  {
    title: 'Honda CB650R 2023',
    description: 'Naked deportiva muy equilibrada, con mantenimiento al día y lista para disfrutar desde el primer día.',
    price: 7900,
    condition: 'km0',
    status: 'disponible',
    year: 2023,
    brand: 'Honda',
    model: 'CB650R',
    kilometers: 900,
    featured: false,
    images: ['https://images.unsplash.com/photo-1515777315835-281b94c9589f?auto=format&fit=crop&w=1200&q=80'],
  },
  {
    title: 'Yamaha MT-07 2022',
    description: 'Moto ágil, divertida y perfecta para uso diario o escapadas de fin de semana.',
    price: 6400,
    condition: 'ocasion',
    status: 'reservada',
    year: 2022,
    brand: 'Yamaha',
    model: 'MT-07',
    kilometers: 12400,
    featured: false,
    images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'],
  },
  {
    title: 'Ducati Monster 937 2021',
    description: 'Diseño italiano, sonido inconfundible y comportamiento premium. Unidad muy mimada.',
    price: 10800,
    condition: 'ocasion',
    status: 'vendida',
    year: 2021,
    brand: 'Ducati',
    model: 'Monster 937',
    kilometers: 15800,
    featured: true,
    images: ['https://images.unsplash.com/photo-1611241443322-b8fb2d4cb0a2?auto=format&fit=crop&w=1200&q=80'],
  }
];

async function seed() {
  try {
    await connectDB();

    await Admin.deleteMany();
    await Bike.deleteMany();
    await Setting.deleteMany();

    const email = process.env.ADMIN_EMAIL || 'admin@factorymotorbike.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin1234@';

    await Admin.create({ email, password });
    await Bike.insertMany(bikes);
    await Setting.create({
      type: 'contact',
      whatsapp: '666208341',
      address: 'La Laguna, Tenerife',
      email: 'info@factorymotorbike.com',
      promotion: '¡Financiación disponible!',
    });

    console.log('Seed completado');
    console.log(`Admin: ${email}`);
    console.log(`Password: ${password}`);
    process.exit(0);
  } catch (error) {
    console.error('Error en el seed:', error);
    process.exit(1);
  }
}

seed();
