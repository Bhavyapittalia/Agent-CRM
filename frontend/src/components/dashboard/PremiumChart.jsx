
import React from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const PremiumChart = ({ data }) => {

    console.log("chart data is: ", data)

    let amount = 0
    data.forEach(item => {
        return amount += item.totalPremium
    })

    console.log("total premium is: ", amount)

    return (

        <div className='bg-white rounded-lg shadow-sm border-t-4 p-4 w-full border-t-blue-600'>

            <h3 className='text-lg font-semibold mb-5'>
                Monthly Expected Premium
            </h3>

            <h3 className='text-lg font-semibold '>
                Total Premium is: {amount}
            </h3>

            <ResponsiveContainer width="100%" height={300} >
                <BarChart data={data} margin={{ left: 20 }} >

                    {/* <CartesianGrid strokeDasharray="3 3" /> */}

                    <XAxis dataKey="label" fontSize={14} />

                    <YAxis fontSize={14} />

                    <Tooltip />

                    <Legend />

                    <Bar dataKey="collected" fill='#1d4ed8' stackId="premium" barSize={40} />
                    <Bar dataKey="upcoming" fill='#93c5fd' stackId="premium" barSize={40} />

                </BarChart>

            </ResponsiveContainer>

        </div>
    )
}

export default PremiumChart
