const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('connecting to: ', url);
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB :))');
    }).catch(err => {
        console.log('error connecting to MongoDB :((', err.message);
    });

const phonebookSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
           validator: function (v) {
                // regex can probably be better, but i suck at regex and i'd
                // rather not sink my life into perfecting menial regexes
                return /\d{2}\d?-{1}\d{5,}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },

    },
});

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Contact', phonebookSchema);
