import express from 'express'
import { getIssues } from './github'
import { cronJob } from './cron'
import { createRepo, getAllRepo, getdemoIssues, subscribeRepo, unsubscribeRepo } from './repo'
import { login, signup } from './auth'


const app = express()

cronJob()

app.use(express.json())
app.post('/login',login)
app.post('/signup',signup)
app.post('/repo/create',createRepo)
app.post('/repos',getAllRepo)

app.post('/repo/subscribe',subscribeRepo)
app.post('/repo/unsubscribe',unsubscribeRepo)
app.post('/getIssues',getdemoIssues)

app.get('/', async(req,res) => {
    res.json({
        message:"kela k tham pe"
    })
})



app.listen(3001,()=>[
    console.log('server listening on port 3001')
])