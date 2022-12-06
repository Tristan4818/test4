var mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

var Schema = mongoose.Schema;

var finalUsers = new Schema({
  email: {
    unique: true,
    type: String,
  },
  password: String,
});

let Users;

module.exports.startDB = () => {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection("mongodb+srv://TristanMS:xcw5QFsjRxAHCTYZ@senecaweb.gytd6md.mongodb.net/Test4");

        db.on('error', (err)=>{
            reject(err);
        });

        db.once('open', ()=> {
            Users = mongoose.model("users", finalUsers);
            console.log("DB connection successful.");
            resolve();
        });
    });
}




module.exports.register = (user) => {

    return new Promise((resolve, reject)=>
    {

        if (user.email === "" || user.password === "")
        {
            reject("Error: email or password cannot be empty.");
        }
        else
        {
            bcrypt.hash(user.password, 10).then((pass_result) => {

                let an_account = new Users({
                    email: user.email,
                    password: pass_result
                });
                
                an_account.save().then(()=>
                {
                    console.log("The account was saved successfully");
                    resolve(an_account);
                }).catch((err)=>
                {
                    if (err.code == 11000) {
                        reject("Error: " + user.email + "already exists");
                    }
                    else {
                        reject("Error: cannot create the user.");
                    }
                    
                });
                
            });
        }

        
    })


};

module.exports.signIn = (user) => {

    return new Promise((resolve, reject)=>
    {
        Users.findOne({email: user.email})
    .exec()
    .then((record)=>
    {
        if(record)
        {

            bcrypt.compare(user.password, record.password)
            .then((match)=>
            {
                if(match)
                {
                    console.log("You are logged in");
                    resolve(user);
                }
                else
                {
                    console.log("Wrong password");
                    reject("Incorrect password for user " + user.email);
                }
            })

        }
        else
        {
            console.log("Account does not exists");
            reject("Cannot find the user: " + user.email);
        }
    })



    })
    
}
