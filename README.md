# Web-404-Monitor

Web404Monitor is a hassle-free website monitoring system that allows you to effortlessly keep tabs on the health of your websites. Simply log the URLs of the websites you want to monitor, sit back, and let Web404Monitor do the rest. No more worrying about downtime – Web404Monitor has got your back!

## Features

- Automated Monitoring: Web404Monitor continuously checks the status of your websites to ensure they are up and running smoothly.
- Instant Notifications: Receive timely notifications when any of your websites experience downtime, so you can take immediate action.
- OAUTH 2.0 and User-Friendly Interface

## Tech Stack

**Client:**  React, Redux, TailwindCSS , React Router

**Server:** Node, Express , MongoDB , JWT , OAUTH 2.0 , Mongoose(ORM)


## Run Locally


Clone the project


```bash
  git clone (https://github.com/007xylogramori/web404monitor.git)
```
FRONTEND SETUP

Go to the project directory for

```bash
  cd client
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

BACKEND SETUP

Go to the project directory for

```bash
  cd server
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

FRONTEND:

`VITE_API_URL :  http://localhost:5000`

BACKEND:

`MONGO_URI=Your MONGO URI`

`PORT=5000`

`SECRET_KEY=Your Secret key for JWT sign`

`EMAIL=your email`

`PASSWORD=your email password`

`TIME=0 */1 * * *`

`BURL=http://localhost:5000`





