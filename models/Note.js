const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose)
// para seguir uma sequencia, e sim é assim estranho mesmo

const noteSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId, //é um tipo de schema objectID
			required: true,
			ref: "User", //a qual schema? ao schema User se refere.
		},
		title: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		completed: {
			type: Boolean,
			default: false, //qnd criamos um note, ele deve vir como falso, pq queremos q se torne true
		},
	},
	{
		timestamps: true, //vai dar o tempo q foi criado
	}
);

noteSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',      //vai criar um ticket field dentro do noteschema
    id: 'ticketNums',
    start_seq: 500
})

module.exports = mongoose.model("Note", noteSchema);
