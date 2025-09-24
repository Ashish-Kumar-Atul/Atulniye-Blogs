const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/user.model');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage});

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if username already exists
    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in DB
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      // profilePhoto: optional, set a default if needed
    });

    // Create a safe session object
    const sessionUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePhoto: user.profilePhoto || null, // include profile photo
    };

    // Store in session
    req.session.user = sessionUser;

    res.status(201).json({
      message: "Registered successfully",
      user: sessionUser,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // --- CRITICAL PART ---
    // Create a user object for the session (exclude password)
    const sessionUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      profilePhoto: user.profilePhoto
    };

    // Save session
    req.session.user = sessionUser;

    // Update "loggedInBefore" flag
    user.loggedInBefore = true;
    await user.save();

    // Send back response
    res.json({
      message: "Login successful",
      user: sessionUser,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});

//If logged in or not
router.get('/status', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ authenticated: true, user: req.session.user });
    } else {
        res.status(401).json({ authenticated: false, message: 'Not authenticated' });
    }
});

//Update profile
router.post('/update-profile',upload.single('profilePhoto'), async (req,res) => {
  try {
    // Check if user is authenticated
    if (!req.session.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const userId = req.session.user._id;

    const {
      username,
      fullName,
      email,
      phone,
      website,
      bio,
      twitter,
      linkedin,
      github,
      instagram
    } = req.body;


    const currentUser = await User.findById(userId);
    if(!currentUser){
      return res.status(404).json({message:'User not found'});
    }

    if(username && username !== currentUser.username){
      const existingUser = await User.findOne({username,_id: {$ne:userId} });

      if(existingUser){
        return res.status(409).json({message: 'Username Already Taken'});
      }
    }
    
    if(email && email !== currentUser.email){
      const existingEmail = await User.findOne({email,_id: {$ne:req.session.userId} });

      if(existingEmail){
        return res.status(409).json({message: 'Email Already Taken'});
      }
    }

    const updateData = {};

    if(req.file) {
        updateData.profilePhoto = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };
    }
    if(username) updateData.username = username;
    if(fullName) updateData.fullName = fullName;
    if(email) updateData.email = email;
    if(phone) updateData.phone = phone;
    if(website) updateData.website = website;
    if(bio) updateData.bio = bio;
    if(twitter) updateData.twitter = twitter;
    if(linkedin) updateData.linkedin = linkedin;
    if(github) updateData.github = github;
    if(instagram) updateData.instagram = instagram;


    const updateUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password')

    const sessionUser = {
      _id: updatedUser._id,
      username: updateUser.username,
      email: updateUser.email,
      fullName: updateUser.fullName,
      profilePhoto: updateUser.profilePhoto
    };
    req.session.user = sessionUser;

    res.status(200).json({
      message: 'Profile Updated Successfully',
      user: updateUser
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to update profile', 
      error: error.message 
    });
  }
})

router.get('/profile-photo/:userId',async (req,res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.profilePhoto || !user.profilePhoto.data){
      return res.status(404).json({message:'Profile Photo Not Found'});
    }
    res.set('Content-Type', user.profilePhoto.contentType);
    res.send(user.profilePhoto.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile photo' });
  }
})


// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
