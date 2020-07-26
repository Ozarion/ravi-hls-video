module.exports = logger = {
    info: (mesg) => {
        console.info(`${new Date().toTimeString()} - ${mesg}`);
    },
    error: (mesg) => {
        console.error(`${new Date().toTimeString()} - ${mesg}`);
    },
    log: (mesg) => {
        console.log(`${new Date().toTimeString()} - ${mesg}`);
    }
}