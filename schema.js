// server side form validation ke lye schema define here
const Joi = require("joi");
const { CATEGORIES } = require("./utils/categories");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    category: Joi.string()
      .valid(...CATEGORIES.map(ele=>ele.name))
      .required(),

    image: Joi.string().allow("", null),
  }).required(),
});


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});
