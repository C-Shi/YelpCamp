var registerPasswordWarning = document.getElementById("registerPasswordWarning");
var registerPassword        = document.getElementById("registerPassword");
var registerPasswordButton  = document.getElementById("registerPasswordButton");

registerPassword.addEventListener("focus", function(){
    registerPasswordWarning.style.display = "block";
},true)

registerPasswordButton.addEventListener("click", function(){
    registerPasswordWarning.style.display = "none";
},true)

