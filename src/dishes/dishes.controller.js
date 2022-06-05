const res = require("express/lib/response");
const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass


//FUNCTION TO LIST DISHES - Return a list of DISHES - GET
function list(req, res, next) {
  res.json({ data: dishes });
}

//READ FUNCTION -Return the DISH with the specified id,- GET

function read(req, res, next) {
  res.json({ data: res.locals.dish });
}

//:dishId exists or Dish does not exist: $dishId error 

function dishExists(req, res, next) {
  const dishId = req.params.dishId;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    res.locals.dish = foundDish;
    return next();
  }
  next({
    status: 404,
    message: `Dish id does not exist: ${dishId}`,
  });
  next();
}

//THIS WILL CREATE A DISH -POST 
function create(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const id = nextId();
  const newDish = {
    id,
    name,
    description,
    price,
    image_url,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}


//NAME PROPERTY W ERROR 
function hasName(req, res, next) {
  const { name } = req.body.data;
  if (name) {
    return next();
  }
  next({ status: 400, message: "Dish must include a name" });
}

//DESCRIPTION PROPERTY WITH ERROR 
function hasDescription(req, res, next) {
  const { description } = req.body.data;
  if (description) {
    return next();
  }
  next({ status: 400, message: "Dish must include a description" });
}


//IMAGE PROPERTY WITH ERROR 
function hasImageUrl(req, res, next) {
  const { image_url } = req.body.data;
  if (image_url) {
    return next();
  }
  next({ status: 400, message: "Dish must include a image_url" });
}

//PRICE IS MISSING WITH ERROR 
function hasPriceZero(req, res, next) {
  const { price } = req.body.data;
  if (price > 0) {
    return next();
  } else {
    next({
      status: 400,
      message: "Dish must include a price",
    });
  }
  next();
}

//PRICE IS NOT AN INTEGER WITH ERROR 

function priceNaN(req, res, next) {
  const { price } = req.body.data;
  if (typeof(price) === "number") {
    return next();
  } else {
    next({
      status: 400,
      message: "Dish must have a price that is an integer greater than 0",
    });
  }
  next();
}

//id in the body does not match :dishId in the route	Dish id does not match route id. Dish: ${id}, Route: ${dishId}


function idMatch(req, res, next) {
  const { dishId } = req.params;
  const { id } = req.body.data;
  if (!id || id === dishId) {
    return next();
  } else {
    next({
      status: 400,
      message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
    });
  }
  next();
}

//PUT - Update an existing profile with the data in the request.

function update(req, res) {
    const dish = res.locals.dish;
    const { data: { name, description, price, image_url } = {} } = req.body;

    dish.name = name;
    dish.description = description;
    dish.price = price;
    dish.image_url = image_url

    res.json({data: dish})
}

//TO CONFIRM TAST 1 WAS COMPLETE, ADD THE LIST, CREATE, READ, AND UPDATE. CANNOT DELETE

module.exports = {
  list,
  create: [hasName, 
    hasDescription, 
    hasImageUrl, 
    priceNaN,
    hasPriceZero,
    create],
  read: [dishExists, read],
  update: [
    dishExists,
    idMatch,
    hasDescription,
    hasName,
    hasImageUrl,
    hasPriceZero,
    priceNaN,
    update
  ],
};