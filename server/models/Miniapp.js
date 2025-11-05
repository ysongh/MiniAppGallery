import mongoose from 'mongoose';

const miniAppSchema = new mongoose.Schema({
  appId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  visits: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

const MiniApp = mongoose.model('MiniApp', miniAppSchema);

export default MiniApp;
