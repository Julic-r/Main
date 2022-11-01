var source = new EventSource('http://localhost:8080/button-click');
source.addEventListener("message", (e) => {

    if(!(document.location.href == "http://127.0.0.1:8887/game.html")){
        console.log("Forward init");
        document.location.href = "http://127.0.0.1:8887/game.html";
    }

});