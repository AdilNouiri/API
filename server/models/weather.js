import mongoose from 'mongoose';

const { Schema } = mongoose;

const weatherSchema = new Schema({
    timestamp: {
      type: Number,
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    feels_like: {
      type: Number,
      required: true,
    },
    temp_min: {
      type: Number,
      required: true,
    },
    temp_max: {
      type: Number,
      required: true,
    },
    pressure: {
      type: Number,
      required: true,
    },
    sea_level: {
      type: Number,
      required: true,
    },
    grnd_level: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
    },
    weather: {
      id: {
        type: Number,
        required: true,
      },
      main: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      icon: {
        type: String,
        required: true,
      },
    },
    clouds: {
      all: {
        type: Number,
        required: true,
      },
    },
    wind: {
      speed: {
        type: Number,
        required: true,
      },
      deg: {
        type: Number,
        required: true,
      },
      gust: {
        type: Number,
        required: true,
      },
    },
    visibility: {
      type: Number,
      required: true,
    },
    pop: {
      type: Number,
      required: true,
    },
    sys: {
      pod: {
        type: String,
        required: true,
      },
    },
    dt_txt: {
      type: String,
      required: true,
    },
});

const Weather = mongoose.model('weather', weatherSchema);

export default Weather;
