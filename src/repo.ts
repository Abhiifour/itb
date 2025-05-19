import { Request, Response } from "express";

import { getIssues, getLastIssue } from "./github";
import { prisma } from "./db";


// TO CREATE A REPO

export  async function createRepo(req:Request, res:Response):Promise<any>{
    try {


        const {name , owner} = req.body;
        console.log(name,owner)

     
        const repoExists = await prisma.repo.findFirst({
            where:{
                name:name,
                owner:owner
            }
        })

        if(!repoExists){
            const lastIssue : any = await getLastIssue(name,owner) 
            console.log(lastIssue)
            const repo = await prisma.repo.create({
                data:{
                    name:name,
                    owner:owner,
                    lastIssueId:lastIssue.id,
                    lastIssueUpdatedAt:lastIssue.lastIssueUpdatedAt
                }
            })
    
            return res.json({
                repo
            })
        }

        return res.json({
            repoExists
        });
  
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
        const {username} = req.body; //user id
        const repos = await prisma.user.findUnique({
            where:{
                username:username
            },
            include:{
                subRepos: true
            }
        })

        return res.json({
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
        const {name,owner , username} = req.body;

        const repo = await prisma.repo.findFirst({
            where:{
                name:name,
                owner:owner
            }
        })

        const user = await prisma.user.findFirst({
            where:{
                username:username
            }
        })

        if(repo && user){
            await prisma.repo.update({
                where: {
                    id: repo.id
                },
                data: {
                    subscribers: {
                        connect: {
                            username: username
                        }
                    }
                }
            });

            return res.json({
                message: "subscribed"
            });
    
        }

        if(!user)
        return res.json({
            message:"user not found !!"
        })

        return res.json({
            message:"repo not found"
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
        const {name, owner , username} = req.body;
        const repo = await prisma.repo.findFirst({
            where:{
                name:name,
                owner:owner
            }
        })
        if(repo){
            const sub = await prisma.repo.update({
                where: {
                id: repo.id
                },
                data: {
                subscribers: {
    
                    disconnect: {
                        username:username
                    }
                }
                }
            })
        }
      
        
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
