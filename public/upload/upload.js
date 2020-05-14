let fileValid = false;

function validateForm(){
    
    const title = document.forms.pictureuploadform.title.value.trim();
    const description = document.forms.pictureuploadform.description.value;
    const tags = document.forms.pictureuploadform.tags;

    const titleMaxLength = 128;
    if (title.length === 0 || title.length > titleMaxLength) {
        console.log("Error title length = " + title.length);
        return false;
    };

    const descriptionMaxLength = 2048;
    if (description.length > descriptionMaxLength) {
        console.log("Error description length = " + description.length);
        return false;
    };

    const tagsMaxLength = 8;
    if (tags.length > tagsMaxLength) {
        console.log("Error tags length = " + description.length);
        return false;
    };

    fileValid = true;

    return fileValid;
};

function handleFileUpload(files){
    const file = files[0];

    const fileSize = file.size;
    const mimeArray = file.type.split("/");
    const fileType = mimeArray[0];


    
    if (fileType !== "image") {
        console.log("Error file type = " + fileType);
        fileValid = false;
        return;
    };

    // 250MB
    const fileSizeLimit = 262144000;
    if (fileSize > fileSizeLimit) {
        console.log("Error file size = " + fileSize);
        fileValid = false;
        return;
    };
    
    fileValid = true;
    
    return fileValid;
};