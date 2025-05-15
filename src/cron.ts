import cron from 'node-cron'
import { prisma } from './db';
import { getIssues, getLastIssue } from './github';


export function cronJob(){
    cron.schedule('* * * * *', async () => {
        console.log('running a task every minute');

        
        const repos = await prisma.repo.findMany({
            include:{
                subscribers:true
            }
        });

        console.log(repos)
        repos.forEach(async (repo) => {
            const issues:any = await getIssues(repo.name, repo.owner)
            if(issues.length >= 1){
                for (const issue of issues) {
                    await prisma.notification.create({
                        data: {
                            title: issue.title, 
                            user: {
                                connect: repo.subscribers.map(subscriber => ({
                                    id: subscriber.id 
                                }))
                            }
                        }
                    });
                }
            }
            const lastUpdatedAt : any= await getLastIssue(repo.name,repo.owner)
            if(lastUpdatedAt){
                await prisma.repo.update({
                    where:{
                        id:repo.id
                    },
                    data:{
                        lastIssueUpdatedAt:lastUpdatedAt.lastIssueUpdatedAt,
                        lastIssueId:lastUpdatedAt.id
                    }
                })
            }
        })
        

        
    });
}