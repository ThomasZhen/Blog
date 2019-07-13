var bodyParser = require("body-parser"),
methodOverride = require("method-override");
expressSanitizer = require("express-sanitizer");
mongoose       = require("mongoose"),
express        = require("express"),
app            = express();

// app config
// mongoose.connect("mongodb://localhost:27017/restful_blog_app", {useNewUrlParser: true});
// mongoose.connect("mongodb+srv://thomas:Qq810834514@cluster0-o4tu7.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true});
mongoose.connect("mongodb+srv://thomas:1433262174@blog-umle2.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true});
// You don't need to type ejs all the time
app.set("view engine", "ejs");
app.use(express.static("public"));
// Use body parser to get input from the form
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// Mongoose/model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test blog",
//     image: "https://images.unsplash.com/photo-1490658772076-913028274fb9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
//     body: "This is a blog post!"
// });

// restful routes
app.get("/", function(req, res){
    res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", function(req, res){
    // The blogs in the fucntion parameter is the
    // data coming back from the database
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("error!");
        } else {
            // we send the data to under the name blogs
            res.render("index", {blogs: blogs});
        }
    });
});

// NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req, res){
    // create blog
    // req.body is the data sent back from the form
    // console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body)
    // console.log(req.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

// Edit routes
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(1);
            res.redirect("/blogs");
        } else {
            console.log(2);
            res.render("edit", {blog: foundBlog});
        }
    });
})

// Update route
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// Delete route
app.delete("/blogs/:id", function(req, res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
    //redirect somewhere
});

app.listen(process.env.PORT || 3000);