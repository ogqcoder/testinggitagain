const express = require("express");
const app = express();
const methodoverride = require("method-override");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const db = require("./models/mngo");
const sanitizer = require("express-sanitizer");

app.use(bodyparser.urlencoded({ extended: true })); //bodyparser
app.set("view engine", "ejs");
app.use(express.static("public"));
mongoose.connect("mongodb://localhost/restfulblogapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // createIndexes: true,
});
app.use(methodoverride("_method"))
app.use(sanitizer);

// db.create({
//   title: "Test Blog",
//   image:
//     "https://images.unsplash.com/photo-1565279427445-10c13a1d1f82?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=889&q=80",
//   body: "hello",
// });

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
  db.find({}, (err, blogs) => {
    if (err) {
      console.log("ERROR");
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

app.get("/blogs/new", (req, res) => {
  res.render("new");
});

app.get("/blogs/:id", (req, res) => {
  db.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect("/blogs")
    }
    else {
      res.render("show", { blog: foundBlog });
    }
  })

})

app.post("/blogs", (req, res) => {

  req.body.blog.body = req.sanitize(req.body.blog.body);
  db.create(req.body.blog, function (err, newBlog) {
    if (err) {
      res.render("new");
    }
    else {
      res.redirect("/blogs");
    }
  })
});

app.get("/blogs/:id/edit", (req, res) => {
  db.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect("/blogs")
    }
    else {
      res.render("edit", { blog: foundBlog });
    }
  })

})

app.put("/blogs/:id", (req, res) => {
  db.findByIdAndUpdate(req.params.id, req.body.blog,
    (err, updatedBlog) => {
      if (err) {
        res.redirect("/blogs")
      }
      res.redirect("/blogs/" + req.params.id);
    })
})

app.delete("/blogs/:id", (req, res) => {
  db.findByIdAndDelete(req.params.id, function (err) {
    if (err) {
      res.redirect("/blogs");
    }
    else {
      res.redirect("/blogs");
    }
  })
})


app.listen(3000, function () {
  console.log("Server has started");
});
