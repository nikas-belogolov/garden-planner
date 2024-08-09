import { Authenticator } from "remix-auth";
import { sessionStorage } from "src/app/services/session.server";
import { FormStrategy } from "remix-auth-form";
import User, { UserSchema } from "src/server/models/UserModel";
// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session

import bcrypt from "bcryptjs"
import Garden from "src/server/models/GardenModel";

export async function createUser({ username, email, password }: any) {
    return new Promise((resolve, reject) => {
        try {
            const newUser = new User({
                email,
                username,
                password
            });
    
            const newGarden = new Garden({
                name: "My Garden",
                owner: newUser._id
            })
    
            newUser.gardens.push(newGarden._id)
    
            newUser.validate().then(() => {
                return bcrypt.hash(newUser.password, 10);
            }).then(hash => {
                newUser.password = hash;
                return newGarden.save();
            }).then(garden => {
                return newUser.save().then(user => ({ user, garden }));
            }).then(({ user, garden }) => {
                resolve({ user, garden });
            }).catch(error => {
                reject(error);
            });
        } catch (error) {
            reject(error);
        }
    })
    // return new Promise(async (resolve, reject) => {
    //     try {
    //         let newUser = new User({
    //             email,
    //             username,
    //             password
    //         });

    //         let newGarden = new Garden({
    //             name: "My Garden",
    //             owner: newUser._id
    //         })

    //         newUser.gardens.push(newGarden._id)

    //         await newUser.validate();
    
    //         bcrypt.hash(newUser.password, 10).then(async hash => {
    //             newUser.password = hash;
    //             const garden = await newGarden.save();
    //             const user = await newUser.save();
    //             return { user, garden }
    //         }).then(({ user, garden }) => resolve({user, garden}))
    //         .catch(error => reject(error))
    //     } catch(error) {
    //         reject(error)
    //     }
    // })
}

// Tell the Authenticator to use the form strategy
// authenticator.use(
//   new FormStrategy(async ({ form }) => {
//     let emailOrUsername = form.get("emailOrUsername");
//     let password = form.get("password");

//     const foundUser =
//         await User.findOne<UserSchema>({
//             $or: [
//                 { email: emailOrUsername },
//                 { username: emailOrUsername }
//             ]
//         }).lean().exec();
    
//     if (!foundUser) throw new Error("Invalid credentials.")
    
//     const match = bcrypt.compare(password as string, foundUser.password)

//     if (!match) throw new Error("Invalid credentials.")

//     delete foundUser.password;

//     return foundUser;
//   }),
//   "user-pass"
// );