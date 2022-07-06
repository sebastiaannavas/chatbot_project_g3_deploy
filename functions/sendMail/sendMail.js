const { output, log } = require("../../utils/utils");
let connectDB = require('../connectDB/connectDB');
const { API_DATABASE, ENDPOINT_DATABASE, nodeMailer } = require("../../settings");




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
           // let call = await API_DATABASE.post(ENDPOINT_DATABASE.createTicket + `?id=${id}`)
          //  let ticket = call.data;
            let carrito = user[0].carrito;
            let flag=0;
            let resultado = ` ■ ELECTRO-MART  \n ■ FACTURA \n\n  •Cliente: ${user[0].nombre} ${user[0].apellidos} \n •Correo: ${user[0].correo} \n •Ciudad: ${user[0].ciudad} \n •Método de Pago: ${user[0].pago} \n\n\n ■ Carrito de compras\n\n `
            let precioTotal=0;

            for (let index = 0; index < 20; index++) {
                if (carrito[index].cantidad > 0) {
                    flag=1;
                    precioTotal+=carrito[index].price*carrito[index].cantidad;
                    resultado += `■ Id: ${carrito[index].id} \n ■ Nombre: ${carrito[index].name} \n ■ Precio: ${carrito[index].price} \n ■Cantidad: ${carrito[index].cantidad} \n 
                    ------------------------------------------------------------- \n`;
                }
            }

            resultado+=`\n Precio Total = ${precioTotal}`




            // create reusable transporter object using the default SMTP transport
            var transporter = nodeMailer.createTransport({
                service:'gmail',
                auth: {
                  user: "electromartBOT@gmail.com",
                  pass: "wvnluhjimrxaijzs"
                }
              });

           
             

            await API_DATABASE.put(ENDPOINT_DATABASE.putCart + `?id=${id}`)


            await transporter.sendMail({
                from: 'electromartbot@gmail.com', 
                to: user[0].correo, 
                subject: "FACTURA ENVIADA", 
                text: resultado  
            });
            
            return output('Factura enviada satisfactoriamente, carrito vaciado satisfactoriamente');
        } catch (error) {log(error);}
        }
    }





