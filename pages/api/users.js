import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from "../../models/User";
import connectDb from "../../utils/connectDb";

connectDb();

export default async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
        return res.status(422).send(`Missing one or more fields`);
    
    try {
        // check if user exists in db
        const emailExists = await User.findOne({ email });

        if (emailExists) return res.status(422).send(`Email already exists.`)

        const hash = await bcrypt.hash(password, 10);

        // create user
        const user = await new User({ name, email, password: hash }).save();

        console.log({user})

        // create jwt token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.status(201).send(token);
    } catch (e) {
        console.error(e);
        res.status(500).send(`Error while signing up user.`)
    }
}