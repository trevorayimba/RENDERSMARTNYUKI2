const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const RED = require('node-red');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'nyuki2025', resave: false, saveUninitialized: false }));

const PASSWORD = "nyuki2025";

app.get('/', (req, res) => {
  if (req.session.loggedin) return res.redirect('/ui');
  res.send(`
    <style>
      body{background:linear-gradient(135deg,#ff6d00,#ffb300);color:white;font-family:Arial;display:flex;justify-content:center;align-items:center;height:100vh;margin:0}
      .box{background:rgba(255,255,255,0.15);backdrop-filter:blur(20px);padding:50px;border-radius:25px;box-shadow:0 20px 40px #00000088;text-align:center;width:380px}
      input,button{padding:16px;margin:10px 0;width:100%;border:none;border-radius:15px;font-size:18px}
      button{background:#c43e00;color:white;cursor:pointer;font-weight:bold}
      h1{font-size:3.5rem;margin-bottom:40px}
    </style>
    <div class="box">
      <h1>SMART NYUKI</h1>
      <form method="post">
        <input name="name" placeholder="Your Name" required><br>
        <input name="pass" type="password" placeholder="Password" required><br>
        <button type="submit">ENTER DASHBOARD</button>
      </form>
    </div>
  `);
});

app.post('/', (req, res) => {
  if (req.body.pass === PASSWORD) {
    req.session.loggedin = true;
    res.redirect('/ui');
  } else {
    res.send('<h2 style="color:white;text-align:center;margin-top:100px">Wrong password!</h2>');
  }
});

const settings = { httpAdminRoot: "/red", httpNodeRoot: "/", userDir: ".", flowFile: "flows.json", ui: { path: "/ui" } };
RED.init(app, settings);
app.use(settings.httpAdminRoot, RED.httpAdmin);
app.use(settings.httpNodeRoot, RED.httpNode);
RED.start();

const port = process.env.PORT || 1880;
app.listen(port, () => console.log('SMART NYUKI LIVE'));
