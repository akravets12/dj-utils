let d =  require("./src/deep-copy")
module.exports = {
    copy: d.deepCopy,
    apply: d.apply,
    plain: d.plain,
    getProperty:d.getProperty,
    query: require("./src/query/query"),
    asyncQuery: require("./src/query/query-async")
}