import cron from 'node-cron'
import { Policy } from '../models/policy.js'
import { Cron } from '../models/cronDetails.js'
import type { ClientStructure } from '../models/client.js';
import type { Types } from 'mongoose';

type ClientName = Pick<ClientStructure, "name">;

interface AlertedPolicy {
    policyId: Types.ObjectId;
    policyName: string;
    amount: number;
    dueDate: Date;
    clientName: string;
    agentId: Types.ObjectId;
    alertedOn: Date;
}


cron.schedule("10 * * * *", async () => {

    console.log("corn file is running")
    console.log("fetching all the policies")

    // calculation for getting the policies of last 7 days
    const todayDate = new Date()

    const lastDate = new Date()
    lastDate.setDate(todayDate.getDate() + 6)

    const cronLog = await Cron.create({
        startDate: new Date(),
        status: 'pending',
        policiesDetail: []
    })

    const policies = await Policy.find({ nextPaymentDate: { $gte: todayDate, $lte: lastDate } }).populate<{ clientId: ClientName | null }>("clientId", "name");

    // console.log("policy between this dates are: ", polycies)

    const policyDetail: AlertedPolicy[] = policies.flatMap((policy) => {
        if (!policy.clientId) {
            return []   
        }

        return [{
            policyId: policy._id,
            policyName: policy.policyName,
            amount: policy.policyAmount,
            dueDate: policy.nextPaymentDate,
            clientName: policy.clientId.name,
            agentId: policy.agentId,
            alertedOn: new Date(),
        }];
    });

    await Cron.findByIdAndUpdate(cronLog._id, { policiesDetail: policyDetail, status: 'completed', endDate: new Date() })

})