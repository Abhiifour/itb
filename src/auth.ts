import { NextFunction, Request, Response } from "express";
import { prisma } from "./db";
import jwt from 'jsonwebtoken'

const jwtKey = process.env.JWT_SECRET_KEY || "abhiifour"

export async function login(req:Request , res: Response): Promise<any>{

    try {
        const {email,password} = req.body;
        const user = await prisma.user.findFirst({
            where:{
                email:email,
                password:password
            }
        })

        if(user){
            const token = jwt.sign(jwtKey,email)
            return res.status(200).json({
                token,
                user
            })
        }
    } catch (error) {
        return res.json(error)
    }

}

export async function signup(req:Request , res: Response) :Promise<any>{

    try {
        const {name , username, email,password} = req.body;
        const user = await prisma.user.findFirst({
            where:{
                email:email,             
            }
        })

        if(!user){

            const newUser = await prisma.user.create({
                data:{
                    name:name,
                    username:username,
                    email:email,
                    password:password
                }
            })
            return res.status(200).json({
                newUser
            })
        }
        return res.json({
            message:"user already exists"
        })
    } catch (error) {
        return res.json(error)
    }

}


export async function verifyUser(req:Request, res:Response, next: NextFunction):Promise<any>{
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: Token missing or malformed" });
        }
       
        try {
            const decoded = jwt.verify(token,jwtKey);
            if(decoded){
                return next()
            }
            return res.status(401).json({ message: "Unauthorized Token" });
        } catch (error) {
            return res.status(403).json({ message: "Forbidden" });
        }
    } catch (error) {
        
    }
}