import mongoose from 'mongoose';

const PlantSchema = new mongoose.Schema({
    name: { type: String },
    color: { type: String },
    group: {
        type: String
    },
    varieties: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Variety'
    }]
})

const Plant = mongoose.model('Plant', PlantSchema);

export default module.exports = Plant;