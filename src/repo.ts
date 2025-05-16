import { Request, Response } from "express";

import { getIssues, getLastIssue } from "./github";
import { prisma } from "./db";


// TO CREATE A REPO

export  async function createRepo(req:Request, res:Response):Promise<any>{
    try {


        const {name , owner} = req.body;

        const lastIssue : any = await getLastIssue(name,owner) 
        const repo = await prisma.repo.create({
            data:{
                name:name,
                owner:owner,
                lastIssueId:lastIssue.id,
                lastIssueUpdatedAt:lastIssue.lastIssueUpdatedAt
            }
        })

        return res.json({
            message:'repo created',
            repo
        })
    } catch (error) {
        return res.json(error)
    }
}


// TO GET A REPO

export  async function getARepo(req:Request, res:Response):Promise<any>{
    try {
        const {id} = req.body; // repo id
        const repo = await prisma.repo.findFirst({
            where:{
                id:id
            }
        })

        return res.json({
            message:'repo found',
            repo
        })
    } catch (error) {
        return res.json(error)
    }
}


// TO GET ALL REPO

export  async function getAllRepo(req:Request, res:Response):Promise<any>{
    try {
        const {id} = req.body; //user id
        const repos = await prisma.user.findUnique({
            where:{
                id:id
            },
            include:{
                subRepos: true
            }
        })

        return res.json({
            message:'repos found',
            repos: repos?.subRepos
        })
    } catch (error) {
        return res.json(error)
    }
}


// TO DELETE A REPO 

export  async function deleteARepo(req:Request, res:Response):Promise<any>{
    try {
        const {id} = req.body; // repo id
        const repo = await prisma.repo.delete({
            where:{
               id:id
            }
        })

        return res.json({
            message:'repo deleted'
            
        })
    } catch (error) {
        return res.json(error)
    }
}


// TO SUBSCRIBE A REPO

export async function subscribeRepo(req: Request , res: Response):Promise<any>{
    try {
        const {repoId , userId} = req.body;

        const sub = await prisma.repo.update({
            where: {
            id: repoId
            },
            data: {
            subscribers: {

                connect: {
                    id: userId
                }
            }
            }
        })

        return res.json({
            message:"subscribed"
        })

    } catch (error) {
        return res.json({
            error
        })
    }
}


// TO UNSUBSCRIBE A REPO

export async function unsubscribeRepo(req: Request , res: Response):Promise<any>{
    try {
        const {repoId , userId} = req.body;

        const sub = await prisma.repo.update({
            where: {
            id: repoId
            },
            data: {
            subscribers: {

                disconnect: {
                    id: userId
                }
            }
            }
        })
        
        return res.json({
            message:"unsubscribed"
        })

    } catch (error) {
        return res.json({
            error
        })
    }
}

// GET THE LAST ISSUE ID
export  async function getLastIssueId(name:string,owner:string){
    try {
      
        const repo = await prisma.repo.findFirst({
            where:{
               name:name,
               owner:owner
            }
        })

        return {
            lastIssueId : repo?.lastIssueId,
            lastIssueUpdatedAt: repo?.lastIssueUpdatedAt
        }
    } catch (error) {
        console.log(error)
    }
}



export  async function getdemoIssues(req:Request, res:Response):Promise<any>{
    try {


        const {name , owner} = req.body;

        const issues = await getIssues(name,owner)

        return res.json({
            issues
        })
    } catch (error) {
        return res.json(error)
    }
}
