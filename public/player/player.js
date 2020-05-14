const url = window.location.href;
let pictureId = url.substr(url.lastIndexOf("/") + 1);

console.log(pictureId);

$.get(`/pictures/${pictureId}`)
    .done((data) => {
        console.log(data.response);

        $("#title").text(data.response.title);

        const player = `<picture style="width: 25%" id="player" controls>
                    <source src="/${pictureId}" >
                    Your browser does not support the picture tag.
                </picture>`;

        $("#player").append(player);

        $("#description").text(data.response.description);
    })
    .catch((error) => {
        console.log(error);
        $("#title").text("Couldn't find the picture");
    });






