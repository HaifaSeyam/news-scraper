var debug = (value, context) => {
    console.log(`TYPEOF ${typeof value}`)
    console.log(`VALUE ${JSON.stringify(value, null, 2)}`);
}

module.exports = { debug }