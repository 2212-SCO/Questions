

const questionSchema = new mongoose.Schema({
  product_id: { type: Number, required: true },
  body: { type: String, required: true, maxlength: 1000 },
  date_written: { type: Date, required: true },
  asker_name: { type: String, required: true, maxlength: 60 },
  asker_email: { type: String, required: true, maxlength: 254 },
  helpfulness: { type: Number, required: true, default: 0 },
  reported: { type: Boolean, required: true, default: false },
  answers: [{
    body: { type: String, required: true, maxlength: 1000 },
    date_written: { type: Date, required: true },
    answerer_name: { type: String, required: true, maxlength: 60 },
    answerer_email: { type: String, required: true, maxlength: 254 },
    reported: { type: Boolean, required: true, default: false },
    helpfulness: { type: Number, required: true, default: 0 },
    photos: [{
      photo_url: { type: String, required: true, maxlength: 512 }
    }]
  }]
});