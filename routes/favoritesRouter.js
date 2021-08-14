const express = require("express");
const Favorite = require("../models/favorites");
const Campsite = require("../models/campsite");
const favoritesRouter = express.Router();
const authenticate = require("../authenticate");
const cors = require("./cors");
const user = require("../models/user");


favoritesRouter.route("/")
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id }).populate("user").populate("campsites").then(favorite => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "applicaton/json");
        res.json(favorite);
    }).catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id}).then(favorite => {
        if(favorite) {
            if(favorite.campsites.includes(req.body._id)){
                res.statusCode = 403;
                res.setHeader("Content-Type", "text/plain");
                res.end("Already saved to your favorites.");
            } else {
                favorite.campsites.push(req.body._id);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
            }
        } else {
            Favorite.create({ user: req.user._id, campsites: req.body}).then(fave => {
                fave.save().then(fave => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(fave);
                });
            });
        }
    }).catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("Put operations not supported on /favorites");
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id }).then(response => {
        if(response) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(response);
        } else {
            res.statusCode = 404;
            res.setHeader("Content-Type", "text/plain");
            res.end("You don't have any favorites to delete.");
        }
    }).catch(err => next(err));
});

favoritesRouter.route("/:campsiteId")
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end(`Get operations not supported on /favorites/${req.params.campsiteId}`);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Campsite.findOne({ _id: req.params.campsiteId}).then(campsite => {
        if(campsite) {
            Favorite.findOne({ user: req.user._id}).then(favorite => {
                if(favorite) {
                    if(favorite.campsites.includes(req.params.campsiteId)){
                        res.statusCode = 220;
                        res.setHeader("Content-Type", "text/plan");
                        res.end(`${req.params.campsiteId} is already in your favorites.`);
                    } else {
                        
                        favorite.campsites.push(req.params.campsiteId);
                        favorite.save().then(fave => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(fave);
                        });
                    }
                } else {
                    Favorite.create({ user: req.user._id, campsites: req.params.campsiteId}).then(fave => {
                        fave.save().then(fave => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(fave);
                        });
                    }).catch(err => next(err));
                }
            }).catch(err => next(err));
        } else {
            res.statusCode = 404;
            res.setHeader("Content-Type", "text/plain");
            res.end(`Campsite ${req.params.campsiteId} does not exist.`);
        }
    }).catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end(`Put operations not supported on /favorites/${req.params.campsiteId}`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then(favorite => {
        if(favorite){
            favorite.campsites.splice(favorite.campsites.indexOf(req.params.campsiteId), 1);
            favorite.save().then(fave => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(fave);
            }).catch(err => next(err));
        } else {
            res.statusCode = 404;
            res.setHeader("Content-Type", "text/plain");
            res.end("You do not have any favorites.")
        }
    }).catch(err => next(err));
});


module.exports = favoritesRouter;