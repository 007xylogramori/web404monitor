const mongoose = require("mongoose");
const websiteSchema = require("./websiteSchema");
const axios = require("axios");

const validateUrl = (value) => {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    value
  );
};

const createWebsite = async (req, res) => {
  const { url } = req.body;

  // validating url

  if (!url) {
    res.status(400).json({
      status: false,
      message: "URL required",
    });

    return;
  }

  if (!validateUrl(url)) {
    res.status(422).json({
      status: false,
      message: "Invalid URL",
    });

    return;
  }

  const website = await websiteSchema.findOne({
    url: url,
    userId: req.user._id,
  });
  if (website) {
    res.status(422).json({
      status: false,
      message: "website already added",
    });
    return;
  }

  const response = await axios.get(url).catch((e) => {
    void e;
  });


  if (!response || response.status !== 200) {
    res.status(422).json({
      status: false,
      message: "Website with " + url + " is not active",
    });

    return;
  }

  const newWebsite = new websiteSchema({
    url: url,
    userId: req.user._id,
    isActive: true,
  });

  newWebsite
    .save()
    .then((website) => {
      res.status(201).json({
        status: true,
        message: "Website Added for user: " + req.user.name,
        data: website,
      });
    })
    .catch((e) => {
      res.status(422).json({
        status: false,
        message: "error creating website",
      });
    });
};

const deleteWebsite = async (req, res) => {
  const id = req.query.webId;

  await websiteSchema
    .deleteOne({ _id: id })
    .then((website) => {
      res.status(201).json({
        status: true,
        message: "Websitedeleted",
        data: website,
      });
    })
    .catch((e) => {
      res.status(422).json({
        status: false,
        message: "error creating website",
      });
    });
};

const toggleMonitor = async (req, res) => {
  const id  = req.query.webId;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(422).json({
      status: false,
      message: 'Invalid webId',
    });
  }


  await websiteSchema.findOneAndUpdate(
    { _id: id },
    { $set: {isMonitoring: req.query.isMonitoring=="false"?false:true} },
    { new: true }
   ).then((website) => {
      res.status(200).json({
        status: true,
        message: "Updated Monitoring status",
        data: website,
      });
    })
    .catch((e) => {
      res.status(422).json({
        status: false,
        message: "error toggling monitoring status",
      });
    });
};

const getAllWebsites = async (req, res) => {
  const response = await websiteSchema
    .find({ userId: req.user._id }).populate(
       { path:"userId",
        select:["name","email"]
        }
    )
    .then((website) => {
      res.status(201).json({
        status: true,
        message: "success",
        data: website,
      });
    })
    .catch((e) => {
      res.status(422).json({
        status: false,
        message: "error getting websites",
      });
    });
};

module.exports = {
  createWebsite,
  deleteWebsite,
  getAllWebsites,
  toggleMonitor
};
