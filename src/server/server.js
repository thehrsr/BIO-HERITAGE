const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');
const axios = require('axios');
const sharp = require('sharp');

const app = express();
//const PORT = process.env.PORT || 5000;
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'du5pgt8ty',
  api_key: '158596388363599',
  api_secret: '8WyvKiriQAFjEiQYrGyQoPVJKzU'
});
app.use(bodyParser.json({ limit: '400mb' }));
app.use(bodyParser.urlencoded({ limit: '400mb', extended: true }));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect('mongodb://localhost:27017/hackathon');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  city: String,
  username: String,
  password: String,
});

userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model('User', userSchema);

const PostSchema = new mongoose.Schema({
  title: String,
  description: String,
  photo: String,
  name: String
});

const Posts = mongoose.model('Community', PostSchema);

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ $or: [{ username }, { email: username }] });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, 'abcd', { expiresIn: '9h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get("/",(req,res)=>{
  console.log("server running")
})


const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token.split(' ')[1], 'abcd');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Failed to authenticate token' });
  }
};

app.get('/user/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/signup', async (req, res) => {
  try {
    const { name, email, city, username, password } = req.body;
    const newUser = new User({ name, email, city, username, password });
    await newUser.save();
    // Generating JWT token
    const token = jwt.sign({ userId: newUser._id }, 'your-secret-key', { expiresIn: '9h' });
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/community', (req, res) => {
  Posts.find({})
    .then(posts => {
      if (posts.length === 0) {
        res.json({ message: 'No Post found' });
      } else {
        res.json(posts);
      }
    })
    .catch(err => res.status(500).json({ message: 'Error fetching Posts' }));
});

app.get('/maps', (req, res) => {
  Map.find({})
    .then(maps => {
      if (maps.length === 0) {
        res.json({ message: 'No Maps found' });
      } else {
        res.json(maps);
      }
    })
    .catch(err => res.status(500).json({ message: 'Error fetching Maps' }));
});


app.post('/post', async (req, res) => {
  try {
    const { title, description, photo, name} = req.body;
    let temp = name+title;
    cloudinary.uploader.upload(photo, { public_id: temp },
      async function (error, result) {
        var photo = result.secure_url
        const Post = new Posts({ title, description, photo, name });
        const savedPost = await Post.save();
        res.status(201).json(savedPost);
      });
  } catch (error) {
    console.error('Error posting:', error);
    res.status(500).json({ message: 'Error posting' });
  }
});

const MapSchema = new mongoose.Schema({
  name: String,
  location: String,
  photo1: String,
  photo2: String,
});

const Map = mongoose.model('Map', MapSchema);
app.post("/report",(req,res)=>{
  try{
    const { name, location, image } = req.body.marker;
    let temp = name+"123";
    let temp2 = name+"1234";
    // First Image Upload
    cloudinary.uploader.upload(image, { public_id: temp },
      async function (error, result1) {
        if (error) {
          console.error('Error uploading first image:', error);
          return res.status(500).json({ message: 'Error uploading first image' });
        }
        
        // Second Image Upload
      

            var photo1 = result1.secure_url;

            const newMap = new Map({ name, location, photo1});
            const savedMap = await newMap.save();
            res.status(201).json(savedMap);
          
      });
  } catch (error) {
    console.error('Error posting:', error);
    res.status(500).json({ message: 'Error posting' });
  }
});


// async function classifyImage(imageUrl) {
  
//   const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
//   const imageData = Buffer.from(response.data, 'binary');
//   const sharpImage = sharp(imageData).resize(224, 224);
//   const rawImageData = await sharpImage.raw().toBuffer();
//   const tfImage = tf.tensor3d(rawImageData, [224, 224, 3]);
//   const model = await mobilenet.load();
//   const predictions = await model.classify(tfImage);
//   console.log(predictions[0].className)
//   return predictions[0].className
// }

app.post("/search", async (req, res) => {
  try {
    const base64Image = req.body.image;

    // Convert base64 image to buffer
    const imageData = Buffer.from(base64Image.split(',')[1], 'base64');

    // Resize the image to 224x224 pixels and convert it to raw RGB data
    const { data, info } = await sharp(imageData)
      .resize(224, 224) // Resize to 224x224 pixels
      .raw()
      .ensureAlpha() // Ensure an alpha channel is present
      .toBuffer({ resolveWithObject: true });

    // Convert to RGB if the image has an alpha channel (4 channels)
    let rgbData;
    if (info.channels === 4) {
      rgbData = new Uint8Array(224 * 224 * 3);
      for (let i = 0, j = 0; i < data.length; i += 4, j += 3) {
        rgbData[j] = data[i];
        rgbData[j + 1] = data[i + 1];
        rgbData[j + 2] = data[i + 2];
      }
    } else if (info.channels === 1) { // If the image is grayscale
      rgbData = new Uint8Array(224 * 224 * 3);
      for (let i = 0; i < data.length; i++) {
        const value = data[i];
        rgbData[i * 3] = value;
        rgbData[i * 3 + 1] = value;
        rgbData[i * 3 + 2] = value;
      }
    } else { // RGB image
      rgbData = data;
    }

    // Ensure the image has the correct number of channels
    if (rgbData.length !== 224 * 224 * 3) {
      throw new Error(`Expected image to have 150528 values but got ${rgbData.length}`);
    }

    // Convert the raw image data to a tensor
    const tfImage = tf.tensor3d(rgbData, [224, 224, 3]);

    // Load the MobileNet model and classify the image
    const model = await mobilenet.load();
    const predictions = await model.classify(tfImage);

    // Log the predictions and send them as a JSON response
    console.log(predictions);
    res.json(predictions[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

let data = [];

app.post('/api/data', (req, res) => {
  const newData = req.body;
  data.push(newData);
  console.log('Received new data:', newData);
  res.status(201).send('Data received successfully!');
});

// app.post("/search", async (req, res) => {
//   try {
//     const base64Image = req.body.image;
//     const imageData = Buffer.from(base64Image.split(',')[1], 'base64');
//     const { data, info } = await sharp(imageData)
//       .resize(224, 224)
//       .raw()
//       .toBuffer({ resolveWithObject: true });
//     if (info.channels === 4) {
//       console.log('Image has 4 channels, converting to 3 channels');
//       const rgbData = new Uint8Array(224 * 224 * 3);
//       for (let i = 0, j = 0; i < data.length; i += 4, j += 3) {
//         rgbData[j] = data[i];
//         rgbData[j + 1] = data[i + 1];
//         rgbData[j + 2] = data[i + 2];
//       }
//       data = rgbData;
//     }
//     if (data.length !== 224 * 224 * 3) {
//       throw new Error(`Expected image to have 150528 values but got ${data.length}`);
//     }    
//     const tfImage = tf.tensor3d(data, [224, 224, 3]);
//     const model = await mobilenet.load();
//     const predictions = await model.classify(tfImage);
//     console.log(predictions);
//     res.json(predictions[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(error.message);
//   }
// });

app.listen(5000)
