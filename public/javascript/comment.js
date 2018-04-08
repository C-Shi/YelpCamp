var addCommentButton        = document.getElementById("addCommentButton");
var commentSection          = document.getElementById("commentSection");

addCommentButton.addEventListener("click", function(){
    $(commentSection).slideToggle();
})
