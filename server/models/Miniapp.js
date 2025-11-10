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
  },
  visitedIPs: [{
    ip: String,
    lastVisit: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

const MiniApp = mongoose.model('MiniApp', miniAppSchema);

export default MiniApp;
