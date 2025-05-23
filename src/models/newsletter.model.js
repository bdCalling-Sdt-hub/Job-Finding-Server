const mongoose = require('mongoose');


const newsletterSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);


const Newsletter = mongoose.model('Newsletter', newsletterSchema);
module.exports = Newsletter;