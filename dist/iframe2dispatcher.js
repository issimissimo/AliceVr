var parentWindow = null;
let receivedMessageHandlers = [];
let messagesQueue = [];
let messagesInterval = null;

console.log("INIZ IFRAME2DISPATCHER")

/// register listener to receive message from parent window
window.addEventListener("message", function(event) {
    console.log("RICEVUTO MESSAGGIO")
        /// register parentWindow
    if (event.data === "hello") {
        parentWindow = event.source;
        console.log("****** RICEVUTO HELLO ***")
    }

    /// dispatch message
    else {
        // console.log(event.data.data)
        for (let i in receivedMessageHandlers) {
            if (receivedMessageHandlers[i].message === event.data.message) {
                receivedMessageHandlers[i].func(event.data.data);
            }
        }
    }
});




/// manage the queue for messages
function messagesQueueManager(msg) {
    messagesQueue.push(msg);

    if (messagesInterval) clearInterval(messagesInterval);
    messagesInterval = setInterval(() => {

        if (parentWindow) {
            clearInterval(messagesInterval);
            messagesInterval = null;
            for (let i = 0; i < messagesQueue.length; i++) {
                parentWindow.postMessage(messagesQueue[i], "*");
            }
            messagesQueue = [];
        }
    }, 200)
}



var dispatcher = {

    /////////////////////////////////////
    /// send message to parent window
    /////////////////////////////////////
    sendMessage: function(message, data = null) {

        let msg = {
            message: message,
            data: data
        };

        if (parentWindow) {
            parentWindow.postMessage(msg, "*");
        } else {
            console.warn("Parent window script not yet defined. Maybe parent window is still loading, or the iframes are not fully loaded. Maybe do you have a slow network?");
            messagesQueueManager(msg);
        }
    },

    /////////////////////////////////////
    /// register a callback for a specific message
    /////////////////////////////////////
    receiveMessage: function(message, func) {

        let msg = {
            message: message,
            func: func
        };
        receivedMessageHandlers.push(msg);
    }
}