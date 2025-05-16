import { Request, Response } from "express";
import { prisma } from "./db";

export async function getNotification(req:Request, res:Response):Promise<any>{
    try {
        const {userId} = req.body;
        const notifications = await prisma.notification.findMany({
            where: {
                user: {
                    some: {
                    id: userId 
                    }
                }
            }
        });
        res.status(200).json(notifications);
    } catch (error) {
        return res.status(500).json(error)
    }
}


export async function getLatestNotification(req:Request, res:Response):Promise<any>{
    try {
        const {userId,lastNotificationId} = req.body;
        const notifications = await prisma.notification.findMany({
            where: {
                user: {
                    some: {
                    id: userId 
                    }
                }
            }
        });

        const newNotification = notifications.filter((notification:any) => notification.id > lastNotificationId)
        res.status(200).json(newNotification);
    } catch (error) {
        return res.status(500).json(error)
    }
}