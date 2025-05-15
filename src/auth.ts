import { Request, Response } from "express";
import { prisma } from "./db";


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
            return res.status(200).json({
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