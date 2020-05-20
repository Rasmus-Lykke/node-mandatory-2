$.get("pictures?page=1", (data) => {
    data.response.map((picture) => {
        if (picture.category == "car") {
            $("#picture-gallery-cars")
                .append(`<li class="list-group-item list-group-item-action mb-2"> 
                <a href="player/${picture.fileName}" >${picture.title} </a>
            </li>`)
        } else if (picture.category == "motorcycle") {
            $("#picture-gallery-motorcycles")
                .append(`<li class="list-group-item list-group-item-action mb-2"> 
                <a href="player/${picture.fileName}" >${picture.title} </a>
            </li>`)
        } else if (picture.category == "racing") {
            $("#picture-gallery-racing")
                .append(`<li class="list-group-item list-group-item-action mb-2"> 
                <a href="player/${picture.fileName}" >${picture.title} </a>
            </li>`)
        } else if (picture.category == "custom") {
            $("#picture-gallery-custom")
                .append(`<li class="list-group-item list-group-item-action mb-2"> 
                <a href="player/${picture.fileName}" >${picture.title} </a>
            </li>`)
        }

    });
});