import mongoose from "mongoose";
import { Policy } from "../models/policy.js";
import type { Request, Response } from "express";
import { AppError } from "../utils/appError.js";

export const dashboardAnalytcis = async (req: Request, res: Response) => {

    console.log("agentId is: ", req.agent.agentId)

    const today = new Date()

    const chartData = await Policy.aggregate([
        {
            $match: {
                agentId: new mongoose.Types.ObjectId(req.agent.agentId)
            }
        },

        {
            $group: {

                _id: {
                    month: {
                        $month: "$nextPaymentDate"
                    },

                    year: {
                        $year: "$nextPaymentDate"
                    }
                },


                totalPremium: {
                    $sum: "$policyAmount"
                },

                collected: {

                    // upcoming condition is working like: 
                    // if (nextPaymentDate <= today) {
                    //    then add policyAmount
                    // }
                    // else {
                    //    0
                    // }
                    $sum: {
                        $cond: [
                            {
                                $lte: [
                                    "$nextPaymentDate", today
                                ]
                            },

                            "$policyAmount", 0
                        ]
                    }
                },

                upcoming: {
                    $sum: {
                        $cond: [
                            {
                                $gt: [
                                    "$nextPaymentDate", today
                                ]
                            },

                            "$policyAmount", 0
                        ]
                    }
                }
            }
        },

        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1
            }
        }
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const formattedData = chartData.map(item => ({
        // returning "object" with two properties "label and totalpremium"
        label: `${months[item._id.month - 1]} ${item._id.year}`,
        collected: item.collected,
        upcoming: item.upcoming,
        totalPremium: item.totalPremium
    }))

    return res.status(202).json({
        success: true,
        formattedData,
        chartData
    })


}