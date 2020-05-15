const url = window.location.href;
let pictureId = url.substr(url.lastIndexOf("/") + 1);

console.log(pictureId);

$.get(`/pictures/${pictureId}`)
    .done((data) => {
        
        $("#title").text(data.response.title);

        const player = `<img style="width: 25%" id="player" source src="/${pictureId}"></img>`;

        $("#player").append(player);

        $("#description").text(data.response.description);
        
    })
    .catch((error) => {
        console.log(error);
        $("#title").text("Couldn't find the picture");
    });






