import express from "express";
const router = express.Router();

router.get('/', function (req: express.Request, res: express.Response) {
    return res.send("hi")
});

module.exports = router;
