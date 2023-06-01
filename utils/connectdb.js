const mongoose = require("mongoose");

const connectMongo = async () =>
  // mongoose.connect( "mongodb+srv://admin-nsi:a5enLo0RGTW0TKW8@cluster0.kbourxq.mongodb.net/Continuum?retryWrites=true&w=majority");
  mongoose.connect( "mongodb://127.0.0.1/carrygo");

// mongodb://127.0.0.1/Continuum
//  mongodb+srv://admin-nsi:a5enLo0RGTW0TKW8@cluster0.kbourxq.mongodb.net/?retryWrites=true&w=majority
export default connectMongo;
