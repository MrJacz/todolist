if (process.env.PRODUCTION === "prod") module.exports = { mongoURI: process.env.DBURL }; // eslint-disable-line
else module.exports = { mongoURI: "mongodb://localhost:27017/todolist" };

