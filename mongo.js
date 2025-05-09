const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give password as argument');
    process.exit(1);
}

if (process.argv.length > 5) {
    console.log('too many arguments, are you using spaces withoug quotes?');
   process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://mongoliandbstargazer051:${password}@cluster0.qrcgo.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery',false);

mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Contact = mongoose.model('Contact', phonebookSchema);

if (process.argv.length == 5) {
    const phoneEntry = new Contact({
        "name": process.argv[3],
        "number": process.argv[4],
    });

    phoneEntry.save().then(result => {
        console.log(`added ${process.argv[3]} with number ${process.argv[4]} to the phonebook`);
        mongoose.connection.close();
    });
}

if (process.argv.length < 5) {
    Contact.find({}).then(result => {
        result.forEach(note => {
            console.log(note);
        })
        mongoose.connection.close();
    });
}

console.log('done!');
