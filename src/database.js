import mongoose from 'mongoose';

mongoose.set('strictQuery', true);

const conectarDB = async () => {
  try {
    console.log('URI usada para MongoDB:', process.env.MONGODB_URI); // 🔍 debug opcional
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ Database connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:', error.message);
    process.exit(1);
  }
};

export default conectarDB;
