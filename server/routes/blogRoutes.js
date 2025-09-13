const express = require('express');
const router = express.Router();
const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({storage})
const Blog = require('../models/blogs.model');


//Get all blogs
router.get("/get-all-blogs", async (req,res,next)=>{
    try {
        const blogs = await Blog.find({});
        res.send({count:blogs.length,data:blogs})
        
    } catch (err) {
        res.status(400).send({message: "something went wrong!"})   
    }
})

//Create Blogs
const {requireAuth} = require('../middleware/auth');
router.post("/create-blogs", upload.single('thumbnail'), async (req,res,next) => {
    try {
        
        const {title,description,author} = req.body;

        if(!req.session.userId) {
            return res.status(401).json({message:'Please Login first'});
        }
        
        const blogData = {
            title,
            description,
            author,
            userId: req.session.userId
        };
        
        // Only add thumbnail if file exists
        if (req.file && req.file.buffer) {
            blogData.thumbnail = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
            console.log('Thumbnail added to blog data');
        } else {
            console.log('No file uploaded or file is empty');
        }
        
        const blog = new Blog(blogData);
        await blog.save();
        console.log('Blog saved successfully');
        res.status(201).json({message:'Blog created successfully!'});
    } catch (err) { 
        console.error('Error creating blog:', err);
        res.status(500).json({message:'Error creating blog', error: err.message})
    }
})


//Get blogs for specific user
router.get("/user-blogs", async (req,res) => {
    try {
        if(!req.session.userId) return res.status(401).json({message:'Please login first'});

        const blogs = await Blog.find({userId:req.session.userId})
        res.send({count: blogs.length, data:blogs});
    } catch (error) {
        res.status(400).send({message: "Something went wrong!"});
    }
})


//Serve thumbnail by ID
router.get('/thumbnail/:id', async (req,res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if(!blog || !blog.thumbnail || !blog.thumbnail.data){
            return res.status(404).send("No image found");
        }
        res.set("Content-Type", blog.thumbnail.contentType);
        res.send(blog.thumbnail.data);
    } catch (error) {
        res.status(500).send("Server error");
    }
})

//Find By Blogs
router.get("/blog/:id", async (req,res,next)=>{
    try {
        const id = req.params.id
        const response = await Blog.findById(id);
        res.send(response)
    } catch (err) {
        res.status(400).send({message: "something went wrong!"});
    }
})

//Edit Blog by Id
router.put("/edit/:id", upload.single('thumbnail'), async (req,res,next)=>{
    try {
        const id = req.params.id;

        const existingBlog = await Blog.findById(id);
        if (!existingBlog || existingBlog.userId.toString() !== req.session.userId) {
            return res.status(403).json({message: 'Not authorized to edit this blog'});
        }
        const data = req.body;
        
        // Add thumbnail if new file was uploaded
        if (req.file) {
            data.thumbnail = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }
        
        const response = await Blog.findByIdAndUpdate(id,data,{returnOriginal:false})
        res.send(response)
    } catch (err) {
        res.status(400).send({message:"Something went wrong!"});
    }
})


//Delete Blog by Id
router.delete("/blog/:id", async (req,res,next)=>{
    try {
        const id = req.params.id;
        
        // Check if user owns this blog
        const existingBlog = await Blog.findById(id);
        if (!existingBlog || existingBlog.userId.toString() !== req.session.userId) {
            return res.status(403).json({message: 'Not authorized to delete this blog'});
        }
        
        const response = await Blog.findByIdAndDelete(id);
        res.send("success");
    } catch (err) {
        res.status(400).send({message:"Something went wrong!"});
    }
});


module.exports = router;