import express from 'express';
import Employee from '../models/employee.js';
import Todo from '../models/todo.js';
import Weather from '../models/weather.js';
import Login from '../models/login.js';
import authenticateToken from '../middleware/auth.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import axios from 'axios';

const router = express.Router();
const Toulouse_lat = 43.600000;
const Toulouse_lon = 1.433333;
const API_URL = (lat, lon) => `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=377459704e1f43967a4f80a3996b91b7&lang=fr&units=metric`;

router.get('/todos', authenticateToken, (req, res, next) => {
  Todo.find({}, 'action')
    .then((data) => res.json(data))
    .catch(next);
});

router.get('/employees', authenticateToken, async (req, res, next) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/employee', authenticateToken, async (req, res, next) => {
  try {
    const newEmployee = new Employee(req.body);
    const savedEmployee = await newEmployee.save();
    console.log(savedEmployee);

    res.json(savedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/employee/:id', authenticateToken, async (req, res, next) => {
  try {
    const employeeId = req.params.id;
    const deletedEmployee = await Employee.findByIdAndDelete(employeeId);

    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(deletedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/employee/:id', authenticateToken, async (req, res, next) => {
  try {
    const employeeId = req.params.id;
    const newValues = req.body;

    const employeeUpdated = await Employee.findByIdAndUpdate(
      employeeId,
      newValues,
      { new: true }
    );

    if (!employeeUpdated) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employeeUpdated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/todos', authenticateToken, (req, res, next) => {
  if (req.body.action) {
    Todo.create(req.body)
      .then((data) => res.json(data))
      .catch(next);
  } else {
    res.json({
      error: 'The input field is empty',
    });
  }
});

router.delete('/todos/:id', authenticateToken, (req, res, next) => {
  Todo.findOneAndDelete({ _id: req.params.id })
    .then((data) => res.json(data))
    .catch(next);
});

router.get('/meteo', authenticateToken, async (req, res, next) => {
  try {
    const response = await axios.get(API_URL(Toulouse_lat, Toulouse_lon));

    const weatherData = response.data;
    const weatherDataList = weatherData.list;

    for (const currentItem of weatherDataList) {

      const newWeather = new Weather({
        timestamp: currentItem.dt,
        temperature: currentItem.main.temp,
        feels_like: currentItem.main.feels_like,
        temp_min: currentItem.main.temp_min,
        temp_max: currentItem.main.temp_max,
        pressure: currentItem.main.pressure,
        sea_level: currentItem.main.sea_level,
        grnd_level: currentItem.main.grnd_level,
        humidity: currentItem.main.humidity,
        weather: {
          id: currentItem.weather[0].id,
          main: currentItem.weather[0].main,
          description: currentItem.weather[0].description,
          icon: currentItem.weather[0].icon,
        },
        clouds: {
          all: currentItem.clouds.all,
        },
        wind: {
          speed: currentItem.wind.speed,
          deg: currentItem.wind.deg,
          gust: currentItem.wind.gust,
        },
        visibility: currentItem.visibility,
        pop: currentItem.pop,
        sys: {
          pod: currentItem.sys.pod,
        },
        dt_txt: currentItem.dt_txt,
      });
      await newWeather.save();
    }
    res.json({ message: 'Weather data added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/signup', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const isUserExisting = await Login.findOne({username});

    if (isUserExisting) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new Login({username: username, password: hashedPassword});
    await user.save();

    const loginResponse = await axios.post('http://localhost:5000/api/login', {
      username: username,
      password: password,
    });

    res.json({ message: loginResponse.data.token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await Login.findOne({username});

    if (!user) {
      res.status(400).json({ error: "User doesn't exist" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ username: user.username }, 'secret_key', { expiresIn: '1h' });

    res.header('Authorization', `Bearer ${token}`).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
