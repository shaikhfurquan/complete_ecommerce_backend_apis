
import mongoose from "mongoose";

const validateMongoDbId = (id) => {

    if (!id) {
        throw new Error('Please provide a valid MongoDB ID')
    }

    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
        throw new Error('This Id is not valid ot not found')
    }
}


export { validateMongoDbId }