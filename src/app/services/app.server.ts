import User from "../../server/models/UserModel"
import Garden from "../../server/models/GardenModel"
import mongoose from "mongoose";
import Layout from "src/server/models/LayoutModel";

export async function getGardens(user: any) {
    const userGardens = await Garden.find({
        _id: { 
            $in: user.gardens.map((id: string) => new mongoose.Types.ObjectId(id))
        }
    }).select("updated_at width height name").lean().exec();

    return userGardens
}

export async function createLayout({
    name,
    width,
    height,
    units,
    gardenId
}: any) {
    return new Promise((resolve, reject) => {
        let session: any = null;
        let layout: any = null;
        
        // const gardenExists = mongoose.isValidObjectId(gardenId) && await Garden.exists({ _id: gardenId })

        // if (!gardenExists) return reject(new Error("Garden not found."));

        console.log(units)

        if (units != "metric" && units != "imperial") return reject(new Error("Invalid units."))

        Layout.startSession().then(_session => {
            session = _session;
            session.startTransaction();
        }).then(() => {
            layout = new Layout({
                name,
                width,
                height,
                units,
                garden: gardenId
            });

            return layout.save({ session });

            
        }).then((layout: any) => {
            return Garden.findByIdAndUpdate(gardenId, {
                $push: {
                    layouts: layout.id
                }
            }, { session });

            return layout;
        }).then(() => {
            resolve({ layout });
            return session.commitTransaction();
        }).catch(error =>{
            reject(error)
            return session.abortTransaction()
        }).finally(() => {
            session.endSession()
        })
    })
}

export async function createGarden({
    name,
    location,
    width,
    height,
    ownerId
}: {
    name: string,
    location: string,
    width: number,
    height: number,
    ownerId: mongoose.Types.ObjectId
}): Promise<{newUser: any, garden: any}> {
    
    return new Promise((resolve, reject) => {
        let session: any = null;
        const garden = new Garden({ name, location, width, height, owner: ownerId })

        Garden.startSession().then(_session => {
            session = _session;
            session.startTransaction();
        }).then(() => {
            return garden.save({ session });
        }).then(() => {
            return User.findByIdAndUpdate(ownerId, {
                $push: {
                    gardens: garden._id
                }
            }, { session });
        }).then(async user => {
            await session.commitTransaction();
            resolve({ newUser: user, garden });
            // req._passport.instance.serializeUser(user, (req) => { req._passport.session.user = user; });
            // return res.redirect(`/app/garden/${garden._id}?mode=edit`);
        }).catch(async error => {
            await session.abortTransaction()
            reject(error)
            // console.log(error instanceof Error.ValidationError);
            // if (error instanceof Error.ValidationError) {
                // res.render('app/overview', {
                //     errors: error.errors,
                //     gardenName,
                //     gardenLocation,
                //     gardenWidth,
                //     gardenHeight
                // })
            // }
        }).finally(() => {
            session.endSession()
        })
    })
}