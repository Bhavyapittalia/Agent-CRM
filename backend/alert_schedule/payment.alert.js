import cron from 'node-cron'
import { Policy } from '../models/policy.js'
import { Cron } from '../models/cronDetails.js'


cron.schedule("10 * * * *", async () => {
    
    console.log("corn file is running")
    console.log("fetching all the policies")

    const policyDetail = []

    // calculation for getting the policies of last 7 days
    const todayDate = new Date()

    const lastDate = new Date()
    lastDate.setDate(todayDate.getDate() + 6)

    const cronLog = await Cron.create({
        startDate: new Date(),
        status: 'pending',
        policiesDetail: []
    })

    const polycies = await Policy.find({ nextPaymentDate: { $gte: todayDate, $lte: lastDate } }).populate("clientId")

    // console.log("policy between this dates are: ", polycies)

    polycies.forEach( (policy) => {

        policyDetail.push({ policyId: policy._id, policyName: policy.policyName, amount: policy.policyAmount, dueDate: policy.nextPaymentDate, clientName: policy.clientId.name, agentId: policy.agentId, alertedOn: new Date()})
        console.log(policyDetail)

    })

    await Cron.findByIdAndUpdate(cronLog._id, { policiesDetail: policyDetail, status: 'completed', endDate: new Date() })

})