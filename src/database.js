//IMPORTAR MONGOS
import mongoose from 'mongoose'


//enn LA BDD
mongoose.set('strictQuery', true)

//CREAR UNA CONNECCTION
const connection = async()=>{
    try {
        
        const {connection} = await mongoose.connect(process.env.MONGODB_URI)
        //PRESENTAR LA CONEXION EN LA CONSOLA
        console.log(`Database is connected on ${connection.host} - ${connection.port}`)
    } catch (error) {
        //CAPTURAR EL ERROR DE LA CONEXION
        console.log(error);
    }
}


export default  connection
