const db = require('../../data/connection.js');


module.exports = {
    add,
    get,
    getBy,
    findById
};

function get() {
    return db("users").select("id", "username").orderBy("id");
}

function getBy(filter) {
    return db("users").where(filter).orderBy("id");
}

async function add(user) {
    const [id] = await db('users').insert(user, 'id')
    return findById(id)
}

function findById(id) {
    return db("users").where({ id }).first()
}