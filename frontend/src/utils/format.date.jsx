
// converting date format to proper YYYY/MM/DD format
export const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0]
}