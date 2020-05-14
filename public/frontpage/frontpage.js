$.get("videos?page=1", (data) => {
    data.response.map((video) => {
        $("#picture-gallery")
            .append(`<li class="list-group-item list-group-item-action mb-2"> <a href="player/${picture.fileName}" >${picture.title} </a></li>`)
    });
});


