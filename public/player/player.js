const url = window.location.href;
let pictureId = url.substr(url.lastIndexOf("/") + 1);

// Appends a image tag with the image to the id "Player" in the player.html file and adds title,
// and description to the corresponding paragraph fields
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






