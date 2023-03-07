var express = require("express");
var router = express.Router();
const deployHelper = require("../scripts/deloyHelper");
const twitterHelper = require("./helper/TwitterHelper");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/testDeploy", async (req, res, next) => {
  deployHelper
    .deployContract()
    .then(({ address }) => {
      res.send({ address });
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send("could not deploy contract");
    });
});

router.post("/testInteraction", async (req, res, next) => {
  deployHelper
    .testDeployedContract(req.body.address)
    .then((response) => {
      res.send(response);
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send("could not interact with contract");
    });
});
router.get("/loginPassword", (req, res) => {
  twitterHelper
    .loginPassword()
    .then(() => res.send())
    .catch((e) => {
      console.error(e);
      res.status(400).send("could not init");
    });
});

router.get("/loginOauth", (req, res) => {
  twitterHelper
    .loginOauth()
    .then((r) => res.send(r))
    .catch((e) => {
      console.error(e);
      res.status(400).send("could not init");
    });
});
router.get("/callback", (req, res) => {
  twitterHelper.oauthCallback(req, res);
});

router.get("/user", async (req, res, next) => {
  twitterHelper
    .user()
    .then((r) => res.send(r))
    .catch((e) => {
      console.error(e);
      res.status(500).send("some error occured");
    });
});
router.get("/spaces", async (req, res, next) => {
  twitterHelper
    .spaces()
    .then((r) => res.send(r))
    .catch((e) => {
      console.error(e);
      res.status(500).send("some error occured");
    });
});
router.get("/getSpace", async (req, res, next) => {
  twitterHelper
    .getSpace(req.query.spaceId)
    .then((r) => res.send(r))
    .catch((e) => {
      console.error(e);
      res.status(500).send("some error occured");
    });
});
router.get("/spaceDetails", async (req, res, next) => {
  twitterHelper
    .spaceParticipants(req.query.spaceId)
    .then((r) => res.send(r))
    .catch((e) => {
      // console.error(e, e.data.errors);
      console.error(e);
      res.status(500).send("some error occured");
    });
});
router.get("/getFollowers", async (req, res, next) => {
  const following = await twitterHelper.getFollowing();
  res.send({ following });
});

module.exports = router;
