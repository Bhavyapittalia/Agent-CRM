import api from "@/api/axios";
import { toast } from "sonner";


export const handleUploadPdf = async (policyId, event) => {

  const file = event.target.files[0]
  console.log("global event.target.value is: ", event.target.value)
  // suppose client open "file picker" and then select "file.pdf"
  // but then he "cancel" it then we simply return nothing bcz (!file) become true
  if (!file) {
    return;
  }

  if (file.type !== "application/pdf") {
    toast.error("File format must be a PDF")
    console.log("ERROOR FOR TYPE PDF...")
    console.log("event.target.value: ", event.target.value)
    event.target.value = ""

    return
  }

  // special container which can carry files, and form data
  const formData = new FormData()

  // putting the file inside the formData container using field name "pdf"
  // and also field name must be match with route uploadPdf.single("pdf")
  formData.append("pdf", file)

  try {
    const response = await api.post(`/policy/upload-pdf/${policyId}`, formData)
    console.log("toast is running")
    toast.success(response.data.message)
    console.log("toast is running")
  }
  catch (error) {
    console.log("error occured", error)
    toast.error("PDF upload fail")
  }

  console.log("refresh is going on")

  event.target.value = ""

}

export const handleViewPdf = async (policyId, documentId) => {
  try {
    // response type should be "blob" as response is in the "binary data"
    console.log("document Id is: ", documentId)
    console.log("POlicy Id is: ", policyId)
    const response = await api.get(`/policy/view-pdf/${policyId}/${documentId}`, { responseType: 'blob' })
    console.log("response of PDF is: ", response.data)
    const pdfBlob = new Blob([response.data], { type: "application/pdf" })

    const pdfUrl = URL.createObjectURL(pdfBlob)

    window.open(pdfUrl, "_blank")

  }
  catch (error) {
    console.log("error in viewPdf is: ", error)
    toast.error("Unable to view PDF")
  }
}