import mongoose from 'mongoose';

const VarietySchema = new mongoose.Schema({
    name: { type: String },
})

const Variety = mongoose.model('Variety', VarietySchema);

export default module.exports = Variety;