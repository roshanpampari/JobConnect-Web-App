import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import session from "express-session";
import c_session from "cookie-session";
import passport from "passport";
import {Strategy} from "passport-local"
import GoogleStategy from "passport-google-oauth2"
import env from "dotenv"
import bcrypt from "bcrypt";
import cors from "cors";
import multer from "multer";
import fs from "fs";


const app = express();
const port = 3001;
const saltRounds = 10;





env.config();

app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );

 
  app.use(passport.initialize());
  app.use(passport.session());
  


   app.use(cors({origin : 'http://localhost:3000',
                    methods : ["GET","POST","DELETE"],
                    credentials : true
                  })); /// ---  passport failing, why??

//  app.options('*', cors());

  // app.use((req, res, next) => {
  //   const origin = req.get('Origin');
  //   console.log('Origin:', origin);
  //   // You can do further processing with the origin header here
  //   next();
  // });

  // app.use((req, res, next) => {
  //  // res.setHeader('Access-Control-Allow-Origin', '*');
  //   const CORS = res.getHeader('Access-Control-Allow-Origin');
  //   console.log("CORS -- ", CORS);
  //   next();
  // });
//   app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '*');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });

app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));

  const db = new pg.Client({
    user : process.env.PG_USER,
    password : process.env.PG_PASSWORD,
    host : process.env.PG_HOST,
    port : process.env.PG_PORT,
    database : process.env.PG_DATABASE,
})

db.connect();


  app.get("/auth/google", passport.authenticate("google",{
    scope : ["email", "profile"]
  }));

  app.get("/auth/google/rdirect", passport.authenticate("google", {
    successRedirect : "/success",
    failureRedirect : "/login"
  }));

  /*app.post("/auth/local", passport.authenticate("local", {
    successRedirect : "/notes",
    failureRedirect : "/login"
  })); */

  app.post("/auth/local", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.json({ verdict: false, message: "Invalid credentials" });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);

      // Just send success response with username
      return res.json({
        verdict: true,
        userName: user.username
      });
    });
  })(req, res, next);
});

  

  app.get("/jobs", async (req, res) => {
        // send respose to render notes
      if(req.isAuthenticated())
      {
        //console.log(req.user);
        // console.log(req.passport);
        // console.log(req.body);
        const username = req.user.email;
        try
        {
          const findResult = await db.query("select * from jobs");

          const result = {  "verdict" : true,
                            "userName": username,
                            "contents" : findResult.rows}
          res.json(result);   //check
        // res.redirect("http://localhost:3000");
        }
        catch(err)
        {
          console.log(err);
        }
      }
      else
      {
        console.log("isAuth() -- ",req.isAuthenticated());
        res.redirect("/login");
      }
  });

  app.get("/success", (req, res) => {
    //window.close();
    res.send(`<h1> &nbsp; </h1>`);
}); 

  app.get("/login", (req, res) => {
        if(req.user){
          res.json({ "verdict" : true })

        } else{
          res.json({ "verdict" : false,
                     "message" : "Please login.."})
        }

  }); 

  app.get("/logout", (req, res) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
    });
    const result = {  "verdict" : true,
                      "message" : "User Logged out"}
    res.json(result);
  })

  app.post("/register", async (req, res) => {  // not getting the data
     const username = req.body.username;
     const password = req.body.password;
    // console.log(req.body);
    try{
      const findResult = await db.query("select * from users where email = $1",[username]);

      if(findResult.rowCount === 0)
      {
        bcrypt.hash(password,saltRounds, async (err, hash) => {
          if(err)
          {
            console.log(err);
          }
          else
          {
            const result = await db.query("insert into users(email,hash) values($1, $2) returning *",[username,hash]);
            const user = result.rows[0];
            req.login(user, (err) => {
              if(err)
              {
                console.log("Failed to login a newly registered user");
                console.log(err);
              }
              else
              {
                console.log("Success -- loged a newly registered user");
                console.log(user);
                res.redirect("/notes");
              }
            })
          }
        })
      }
      else
      {
        res.redirect("/login");
      }
    }
    catch(err)
    {
      console.log(err);
    }
  })

  app.post("/postJob", async (req, res) => {
    const { title, description, company } = req.body;
    const recruiterId = req.user.id;
    console.log(req.body, recruiterId);
    let resF = {};
    try {
      const result = await db.query(
        "INSERT INTO jobs (title, description, company, recruiter_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [title, description, company, recruiterId]
      );

      console.log("Added job to the DB:", result.rows[0]);
      resF = {
        verdict: true,
        job: result.rows[0],
      };
    } catch (err) {
      console.error(err.message, "Failed to add job to the DB");
      resF = {
        verdict: false,
        message: err.message,
      };
    }
    res.json(resF);
  });

  app.get("/myJobs", async (req, res) => {
    if (req.isAuthenticated()) {
      const recruiterId = req.user.id;
      try {
        const jobsResult = await db.query("SELECT * FROM jobs WHERE recruiter_id = $1", [recruiterId]);
        res.json({ verdict: true, jobs: jobsResult.rows });
      } catch (err) {
        console.error("Failed to fetch recruiter's jobs:", err);
        res.status(500).json({ verdict: false, message: err.message });
      }
    } else {
      res.status(401).json({ verdict: false, message: "Unauthorized" });
    }
  });
  
  app.delete("/deleteJob/:id", async (req, res) => {
    const jobId = req.params.id;
    const recruiterId = req.user.id;
  
    try {
      const result = await db.query(
        "DELETE FROM jobs WHERE id = $1 AND recruiter_id = $2",
        [jobId, recruiterId]
      );
      res.json({ verdict: true });
    } catch (err) {
      console.error("Failed to delete job:", err);
      res.status(500).json({ verdict: false, message: err.message });
    }
  });

  const upload = multer({ dest: "uploads/" });

app.post("/update-profile", upload.single("resume"), async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ verdict: false, message: "Unauthorized" });
  }

  const { firstName, lastName, phone, skills } = req.body;
  const userId = req.user.id;

  try {
    let resumeBuffer = null;

    if (req.file) {
      resumeBuffer = fs.readFileSync(req.file.path);
      fs.unlinkSync(req.file.path); // delete temp file after reading
    }

    await db.query(
      `UPDATE users
       SET first_name = $1,
           last_name = $2,
           phone = $3,
           skills = $4,
           resume = $5
       WHERE id = $6`,
      [firstName, lastName, phone, skills, resumeBuffer, userId]
    );

    res.json({ verdict: true });
  } catch (err) {
    console.error("Failed to update profile:", err);
    res.status(500).json({ verdict: false, message: err.message });
  }
});

app.post("/apply-to-job", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ verdict: false, message: "Unauthorized" });
  }

  const userId = req.user.id;
  const { job_id } = req.body;

  try {
    // Prevent duplicate applications
    const check = await db.query(
      "SELECT * FROM applications WHERE user_id = $1 AND job_id = $2",
      [userId, job_id]
    );

    if (check.rowCount > 0) {
      return res.json({ verdict: false, message: "Already applied" });
    }

    await db.query(
      "INSERT INTO applications (user_id, job_id) VALUES ($1, $2)",
      [userId, job_id]
    );

    res.json({ verdict: true });
  } catch (err) {
    console.error("Application error:", err);
    res.status(500).json({ verdict: false, message: err.message });
  }
});

app.get("/job-applicants/:jobId", async (req, res) => {
  const { jobId } = req.params;

  if (!req.isAuthenticated()) {
    return res.status(401).json({ verdict: false, message: "Unauthorized" });
  }

  try {
    const result = await db.query(`
      SELECT users.id, users.email, users.first_name, users.last_name, users.phone, users.resume
      FROM applications
      JOIN users ON applications.user_id = users.id
      WHERE applications.job_id = $1
    `, [jobId]);

    res.json({ verdict: true, applicants: result.rows });
  } catch (err) {
    console.error("Error fetching applicants", err);
    res.status(500).json({ verdict: false, message: err.message });
  }
});

app.get("/resume/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await db.query("SELECT resume FROM users WHERE id = $1", [userId]);
    if (result.rowCount === 0 || !result.rows[0].resume) {
      return res.status(404).send("Resume not found.");
    }

    const resumeBuffer = result.rows[0].resume;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");
    res.send(resumeBuffer);
  } catch (err) {
    console.error("Error serving resume:", err);
    res.status(500).send("Internal Server Error");
  }
});


  

  passport.use("local", new Strategy(async function verify(username, password, cb){  // check whether we get username & pwd here
        try{
          //  console.log(username,password);
            const findResult = await db.query("select * from users where email = $1",[username]);

            if(findResult.rowCount === 0)
            {
                return cb("User not found");
            } 
            else
            {
                const hashedPwd = findResult.rows[0].hash;
                const user = findResult.rows[0];
                bcrypt.compare(password, hashedPwd, (err, valid) => {
                  if(err)
                  {
                    console.log(err);
                    return cb(err);
                  } 
                  else
                  {
                    if(valid)
                    {
                      console.log("Pwd chk success")
                      return cb(null,user);
                    }
                    else
                    {
                      console.log("Pwd chk fail")
                      return cb(null,false);
                    }
                  }
                })
            }
        } catch(err){
            console.log(err);
            return cb(err);
        }
  }))

  passport.use("google",new GoogleStategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:    "http://localhost:3001/auth/google/rdirect",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    async (accessToken, refreshToken, profile, cb) => {
        console.log("Auth Success");
        try{

            const result = await db.query("select * from users where email = $1",[profile.email]);

            if(result.rowCount === 0)
            {
                const resultIns = await db.query("insert into users(email, hash) values($1, $2) returning *",[profile.email,"google"]); 
                cb(null, resultIns.rows[0]);
                console.log("Auth Success -- adding new user");
            } else
            {
                cb(null, result.rows[0]);
            }

        } catch(err){
          console.log(err);
            return cb(err);
        }

    } 
));

passport.serializeUser((user, cb) => {
    cb(null, user);
  });
  passport.deserializeUser((user, cb) => {
    cb(null, user);
  });

app.listen(port, () => {
    console.log(`Server Listening at ${port}`);
})