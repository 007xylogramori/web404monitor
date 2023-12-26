const bcrypt = require("bcrypt");
const userSchema = require("./userSchema");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

const generateToken = (data, exp) => {
  if (!exp) {
    exp = Date.now() / 1000 + 24 * 60 * 60; //valid for 1day
  }
  const token = jwt.sign(
    {
      exp: exp,
      data: data,
    },
    process.env.SECRET_KEY
  );
  return token;
};

const decodeToken = async (token) => {
  let data;
  try {
    data = await jwt.verify(token, process.env.SECRET_KEY);
  } catch (e) {
    console.log(e);
  }

  return data;
};

const generateNewAccessToken = async (req, res) => {
  // refresh token validation
  const {refreshToken} = req.body;
  console.log(refreshToken)
  if (!refreshToken) {
    res.status(400).json({
      status: false,
      message: "No refresh token",
    });

    return;
  }

  // finding user with the refresh token
  

    
  const user = await userSchema.findOne({
      "tokens.refreshToken.token": refreshToken,
    })
 
 

  // user not exists

  if (!user) {
    res.status(422).json({
      status: false,
      message: "user not found",
    });
    return;
  }

  // user exists

  const atokenExp = Date.now() / 1000 + 24 * 60 * 60;
  const atoken = generateToken(
    {
      email: user.email,
      name: user.name,
    },
    atokenExp
  );

  // saving new access taken

  user.tokens.accessToken = {
    token: atoken,
    expireAt: new Date(atokenExp * 1000),
  };

  user
    .save()
    .then((user) => {
      res.status(201).json({
        status: true,
        message: "access token created",
        data: user,
      });
    })
    .catch((e) => {
      res.status(200).json({
        status: false,
        message: "access token denied",
        error: e,
      });
    });
};

const validateEmail = (email) => {
  var re =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  return re.test(email);
};

const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  // detail validation

  if (!name || !email || !password) {
    res.status(200).json({
      status: false,
      message: "ALL FIELDS ARE REQUIRED",
    });
    return;
  }

  // email validation

  if (!validateEmail(email)) {
    res.status(200).json({
      status: false,
      message: "EMAIL INVALID",
    });
    return;
  }

  // finding user in DB

  const user = await userSchema.findOne({ email: email });
  if (user) {
    res.status(422).json({
      status: false,
      message: "User already exists!",
    });
    return;
  }

  // hashing password

  const hashedPassword = await bcrypt.hash(password, 10);

  // generating tokens and expiry time

  const atoken = generateToken({ email, name });
  const atokenExp = Date.now() / 1000 + 24 * 60 * 60;
  const rtokenExp = Date.now() / 1000 + 20 * 24 * 60 * 60;
  const rtoken = generateToken({ email, name }, rtokenExp);


  // saving new user

  const newUser = new userSchema({
    name: name,
    email: email,
    password: hashedPassword,
    tokens: {
      accessToken: { 
        token: atoken,
        expireAt: new Date(atokenExp * 1000) 
        },
      refreshToken: {
        token: rtoken,
        expireAt: new Date(rtokenExp * 1000) 
        },
    },
  });

  newUser
    .save()
    .then((user) => {
      res.status(201).json({
        status: true,
        message: "SignUp Successfull",
        data: user,
      });
    })
    .catch((e) => {
      res.status(200).json({
        status: false,
        message: "user not created",
        error: e,
      });
    });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(200).json({
      status: false,
      message: "ALL FIELDS ARE REQUIRED",
    });
    return;
  }
  if (!validateEmail(email)) {
    res.status(200).json({
      status: false,
      message: "EMAIL INVALID",
    });
    return;
  }

  const user = await userSchema.findOne({ email: email });
  if (!user) {
    res.status(422).json({
      status: false,
      message: "user not found",
    });
    return;
  }

  const dbpassword = user.password;

  await bcrypt.compare(password, dbpassword).then((matched) => {
    if (!matched) {
      res.status(422).json({
        status: false,
        message: "wrong password",
      });
      return;
    }
  });

  res.status(200).json({
    status: true,
    message: "user validated",
    data:user
  });

  return;
};

module.exports = { signupUser, loginUser, generateNewAccessToken };
