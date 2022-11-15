var source = new EventSource('https://codingprof.hs-rw.de/cityrevivalbackend/button-click');
source.addEventListener("message", (e) => {

    if(!(document.location.href == "https://codingprof.hs-rw.de/city-revival-game/game.html")){
        console.log("Forward init");
        document.location.href = "https://codingprof.hs-rw.de/city-revival-game/game.html";
    }

});