process.on("message", (job) => {
    console.log("worker running...")

    setTimeout(() => {
        // console.log("worker finished: ", job)

        process.send({
            status: "completed",
            job
        })
    }, 5000)
})