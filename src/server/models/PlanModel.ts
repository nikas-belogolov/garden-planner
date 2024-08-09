import mongoose from 'mongoose';

const PlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    features: [{
        type: String
    }],
    price: {
        monthly: { type: String, required: true },
        yearly: { type: String, required: true }
    }
})

const Plan = mongoose.model('Plan', PlanSchema);

export default module.exports = Plan;