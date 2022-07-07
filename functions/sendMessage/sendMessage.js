const { bot } = require('../../settings');
let { log, output } = require('../../utils/utils');
let connectDB = require('../connectDB/connectDB');


exports.handler = async (event) => {

   let {
      httpMethod: method,
      queryStringParameters: p
   } = event;

   
   let client = await connectDB()
   const colUsers = client.db().collection('users');
  

   if (method == "GET") {

      let { msg } = p;
      try {

      let text=['feliz navidad', 'feliz año nuevo', 'vendemos huevo'];
     
        let i=0;
        let usuario = await colUsers.find({}).toArray();
        let usuarioLen=usuario.length;

        for(;i<usuarioLen;i++){

            bot.sendMessage(Number(usuario[i].id), text[msg])
        }

    
         return output('ta fino mano');





      } catch (error) {log(error);}
   }
}