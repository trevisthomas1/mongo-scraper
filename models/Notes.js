var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NotesSchema = new Schema({

    articleid: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: true
    },
    created: {
        type: String,
        required: true
    }
});

var Notes = mongoose.model("Notes", NotesSchema);

module.exports = Notes;
