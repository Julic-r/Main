import {backEndGameUrl} from "./config.js";
import {eventSourceUrl} from "./config.js";

var source = new EventSource(eventSourceUrl);
source.addEventListener("message", (e) => {

    if(!(document.location.href == backEndGameUrl)){
        console.log("Forward init");
        document.location.href = backEndGameUrl;
    }

});