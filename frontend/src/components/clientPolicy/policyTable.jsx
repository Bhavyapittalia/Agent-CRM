import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, FileText, Eye, Pencil, Trash2, AlertCircle, AlertCircleIcon, AlertOctagonIcon, Bell, BellRing, Upload } from 'lucide-react'
import { checkStatus } from '@/utils/check.status'
import { MoreHorizontal } from "lucide-react"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'

import { handleUploadPdf, handleViewPdf } from '@/utils/handle.pdf'

const policyTable = ({ policies, id, sentAlert }) => {

  const [selectedPolicy, setSelectedPolicy] = useState(null)
  const [documentsDialogOpen, setDocumentsDialogOpen] = useState(false)

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
                  <TableRow key={Policy._id} onClick={() => navigate(`/clients/policy/more-info/${id}/${Policy._id}`)}>
                    <TableCell className="font-medium text-center">{Policy.policyNumber}</TableCell>
                    <TableCell className="font-medium text-center">{Policy.policyName}</TableCell>
                    <TableCell className="font-medium text-center">{Policy.policyAmount.toLocaleString("en-IN")}</TableCell>
                    <TableCell className="font-medium text-center">{new Date(Policy.nextPaymentDate).toDateString()}</TableCell>
                    <TableCell className="font-medium text-center">
                      {checkStatus(Policy.policyStatus)}
                    </TableCell>

                    {/* implementation of the 3 dots using shadeCn */}
                    <TableCell className="font-medium text-center">

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-gray-100"
                            aria-label="Actions"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-5 w-5 text-gray-600" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="end"
                          side="bottom"
                          sideOffset={4}
                          className="w-44 bg-white rounded-md shadow-lg border border-gray-200 p-1 ring-0"
                        >
                          <DropdownMenuItem
                            onClick={(event) => {
                              event.stopPropagation()
                              document.getElementById(`pdf-${Policy._id}`).click()
                            }}
                            className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-50"
                          >
                            <Upload className="h-4 w-4 text-blue-600" /> Upload PDF
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedPolicy(Policy)
                              setDocumentsDialogOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                            View Documents
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              sentAlert(Policy._id)
                            }}
                            className="flex items-center gap-2 px-2 py-2 rounded hover:bg-yellow-50"
                          >
                            <BellRing className="h-4 w-4 text-yellow-600" /> Send Alert
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(Policy._id)
                            }}
                            className="flex items-center gap-2 px-2 py-2 rounded hover:bg-red-50 "
                          >
                            <Trash2 className="h-4 w-4 text-red-600" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <input
                        id={`pdf-${Policy._id}`}
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => handleUploadPdf(Policy._id, event)}
                      />

                    </TableCell>

                    {documentsDialogOpen && (
                      <Dialog onOpenChange={setDocumentsDialogOpen} open={documentsDialogOpen}>
                        <DialogContent className="bg-gray-100 ring-0 rounded-lg border-t-5 border-t-blue-600" onClick={(e) => e.stopPropagation()}>
                          <DialogHeader>
                            <DialogTitle className="!text-black !font-xs">Documents for {selectedPolicy.policyName}</DialogTitle>
                          </DialogHeader>

                          <div className="space-y-4">
                            {selectedPolicy?.documents?.length > 0 ? (
                              selectedPolicy.documents.map((document) => (
                                <div
                                  key={document._id}
                                  className="flex items-center justify-between border-b pb-2"
                                >
                                  <span>{document.fileName}</span>

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleViewPdf(selectedPolicy._id, document._id)
                                    }
                                    }
                                  >
                                    View
                                  </Button>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500">No documents uploaded</p>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

        </CardContent>
      </Card>
    </div >
  )
}

export default policyTable
