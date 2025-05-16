import express from 'express'
import { getIssues } from './github'
import { cronJob } from './cron'
import { createRepo, getAllRepo, getdemoIssues, subscribeRepo, unsubscribeRepo } from './repo'
import { login, signup, verifyUser } from './auth'
import { getLatestNotification, getNotification } from './notification'


const app = express()

cronJob()

app.use(express.json())
app.post('/login',login)
app.post('/signup',signup)
app.post('/repo/create',createRepo)
app.post('/repos',verifyUser,getAllRepo)

app.post('/repo/subscribe',verifyUser,subscribeRepo)
app.post('/repo/unsubscribe',verifyUser,unsubscribeRepo)
app.post('/getIssues',getdemoIssues)
app.post('/user/notification',verifyUser,getNotification)
app.post('/user/notification/new',verifyUser,getLatestNotification)
app.get('/', async(req,res) => {
    res.json({
        message:"kela k tham pe"
    })
})



app.listen(3001,()=>[
    console.log('server listening on port 3001')
])