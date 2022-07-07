const { output, log } = require("../../utils/utils");
let connectDB = require('../connectDB/connectDB');




exports.handler = async (event) => {

    let {
        httpMethod: method,
        queryStringParameters: p
    } = event;


    let client = await connectDB()
    const colUsers = client.db().collection('users');


    if (method == "POST") {
        try {
            
            let { id } = p;
            let user = await colUsers.find({ id }).toArray();
            let carrito = user[0].carrito;
            let resultado = `ELECTRO-MART  \n FACTURA \n Carrito de compras\n Cliente: ${user[0].nombre} ${user[0].apellidos} \n correo: ${user[0].correo} \n ciudad: ${user[0].ciudad} \n\n `
            let precioTotal=0;

            for (let index = 0; index < 20; index++) {
                if (carrito[index].cantidad > 0) {
                    
                    precioTotal+=carrito[index].price*carrito[index].cantidad;
                    resultado += `Id: ${carrito[index].id} \n Nombre: ${carrito[index].name} \n Precio: ${carrito[index].price} \n Cantidad: ${carrito[index].cantidad} \n 
                    ----------------------- \n`;
                }
            }

            resultado+=`\n Precio Total = ${precioTotal}`
          return output(resultado); 
            
        } catch (error) {
            log(error);
        }

    }

}