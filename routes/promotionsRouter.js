const express = require("express");
const Promotion = require("../models/promotion");
const promotionsRouter = express.Router();
const authenticate = require("../authenticate");

promotionsRouter.route("/")
.get((req, res, next) => {
    Promotion.find().then(promotions => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotions);
    }).catch(err => next(err));
     
}).post(authenticate.verifyUser, (req, res, next) => {
    Promotion.create(req.body).then(promotion => {
        console.log("Promotion created: ", promotion);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
    }).catch(err => next(err));

}).put(authenticate.verifyUser, (req,res) => {
    res.statusCode = 403;                           
    res.end(`Put operation not supported on /promotions.`);

}).delete(authenticate.verifyUser, (req, res, next) => {
    Promotion.deleteMany().then(response => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
    }).catch(err => next(err));             
});

promotionsRouter.route("/:promotionsId")
.get((req, res, next) => {
    Promotion.findById(req.params.promotionsId).then(promotion => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
    }).catch(err => next(err)); 
}).post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`Post operations not supported on /promotions/${req.params.promotionsId}.`);
}).put(authenticate.verifyUser, (req, res, next) => {
    Promotion.findByIdAndUpdate(req.params.promotionsId, {
        $set: req.body
    }, { new: true}).then(promotion => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
    }).catch(err => next(err));

}).delete(authenticate.verifyUser, (req, res, next) => {
    Promotion.findByIdAndDelete(req.params.promotionsId).then(response => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
    }).catch(err => next(err));
});

module.exports = promotionsRouter;