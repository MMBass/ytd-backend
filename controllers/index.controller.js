const start = (req, res) => {
    if(res.header("access-token")) res.status(200).send();
    else{
        res.status(500).send();
        console.error("GET/ err no toekn created");
    }
};

module.exports = { start };