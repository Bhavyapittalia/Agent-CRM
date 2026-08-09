import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import { Plus, FileText, Eye, Pencil, Trash2 } from 'lucide-react'
import { checkStatus } from '@/utils/check.status'

const policyTable = ({policies, id}) => {

  const navigate = useNavigate()

  return (
    <div>
      <Card className="border-t-4 border-t-blue-600 shadow-sm rounded-lg overflow-hidden ring-0 mt-5">
        <CardContent className='p-0 mt-[-16px]'>

          {policies.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              No policies
            </div>
          ) : (


            // {/* table layout */}
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-100">

                  <TableHead className="w-[15%] text-center">Policy Number</TableHead>
                  <TableHead className="w-[15%] text-center">Policy Name</TableHead>
                  <TableHead className="w-[15%] text-center">Premium</TableHead>
                  <TableHead className="w-[15%] text-center">Next Payment Date</TableHead>
                  <TableHead className="w-[15%] text-center">Status</TableHead>
                  <TableHead className="w-[15%] text-center">Action</TableHead>


                </TableRow>
              </TableHeader>

              <TableBody>
                {policies.map(Policy => (
                  <TableRow key={Policy._id}>
                    <TableCell className="font-medium text-center">{Policy.policyNumber}</TableCell>
                    <TableCell className="font-medium text-center">{Policy.policyName}</TableCell>
                    <TableCell className="font-medium text-center">{Policy.policyAmount.toLocaleString("en-IN")}</TableCell>
                    <TableCell className="font-medium text-center">{new Date(Policy.nextPaymentDate).toDateString()}</TableCell>
                    <TableCell className="font-medium text-center">
                      {checkStatus(Policy.policyStatus)}
                    </TableCell>
                    <TableCell className="font-medium text-center">
                      <div className="flex justify-evenly gap-2">

                        <Button
                          // passing 2 id's to handle the "back" btn 
                          onClick={() => navigate(`/clients/policy/more-info/${id}/${Policy._id}`)}
                          className="bg-blue-100 hover:bg-blue-200 w-full sm:w-auto"
                        >
                          <Eye className="h-4 w-4 " />
                        </Button>

                        <Button
                          onClick={() => handleDelete(Policy._id)}
                          className="bg-red-100 hover:bg-red-200 w-full sm:w-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

        </CardContent>
      </Card>
    </div>
  )
}

export default policyTable
