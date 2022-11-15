var backEndGameUrl = "https://codingprof.hs-rw.de/city-revival-game/game.html";
var eventSourceUrl = "https://codingprof.hs-rw.de/cityrevivalbackend/button-click";

var source = new EventSource(eventSourceUrl);
source.addEventListener("message", (e) => {

    if(!(document.location.href == backEndGameUrl)){
        console.log("Forward init");
        document.location.href = backEndGameUrl;
    }

});