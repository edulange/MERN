require('dotenv').config()
const express = require("express");
const app = express();
const path = require("path");
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV)

connectDB()

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json()) //outro built-in middleware

app.use(cookieParser())

app.use("/", express.static(path.join(__dirname, "public")));
// esse app.use poderia ser reescrtio de outra forma
// app.use(express.static('public))
//poderia ser assim se o "server.js"(que eu utilizo para rodar o node)
//fosse colocado no mesmo diretório do public, nesse caso, funcionaria
// isso aqui é um middleware?
/*Sim, essa linha de código utiliza a função express.static para servir arquivos estáticos contidos na pasta public. E essa função é um middleware do framework Express.js.

Middleware são funções que podem ser encadeadas para processar requisições HTTP em uma aplicação Express.js, e a função express.static é um dos middlewares embutidos no framework, usado para servir arquivos estáticos.

Portanto, pode-se dizer que essa linha de código configura o middleware express.static para lidar com todas as requisições que chegam na rota '/' da aplicação.
*/

app.use("/", require("./routes/root"));

app.all("*", (req, res) => {
	res.status(404);
	if (req.accepts("html")) {
		res.sendFile(path.join(__dirname, "views", "404.html"));
	} else if (req.accepts("json")) {
		res.json({ message: "404 Not Found" });
	} else {
		res.type("txt").send("404 Not Found");
	}
});

app.use(errorHandler)

mongoose.connection.once('open', () => {
	console.log('Connected no MONGÃO')
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})

mongoose.connection.on('error', err => {
	console.log(err)
	logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
