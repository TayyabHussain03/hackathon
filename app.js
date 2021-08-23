var loaderText = document.getElementById("loaderText")
var loader = document.getElementById("loader")
var errorDiv = document.getElementById("errorMessage")
let loading = document.getElementsByClassName("loading")
loaderText.style.display = "block";
loader.style.display = "none";

function signUp() {
    var userName = document.getElementById("userName")
    var userEmail = document.getElementById("userEmail")
    var userPassword = document.getElementById("userPassword")
    if (userName.value === "") {
        errorMessage.style.display = "block"
        errorDiv.innerHTML = "Please Enter User Name";
        setTimeout(function () {
            errorMessage.style.display = "none";
        }, 2000);
    } else if (userEmail.value === "") {
        errorMessage.style.display = "block"
        errorDiv.innerHTML = "Please Enter Email";
        setTimeout(function () {
            errorMessage.style.display = "none";
        }, 2000);
    } else if (userPassword.value === "" || userPassword.value < 6) {
        errorMessage.style.display = "block"
        errorDiv.innerHTML = "Password should be atleast 6 characters or long";
        setTimeout(function () {
            errorMessage.style.display = "none";
        }, 2000);
    } else {
        firebase.auth().createUserWithEmailAndPassword(userEmail.value, userPassword.value)
            .then((res) => {
                firebase.database().ref(`userData/${res.user.uid}`).set({
                    userName: userName.value,
                    userEmail: userEmail.value,
                    userPassword: userPassword.value,
                })
                localStorage.setItem("userId", res.user.uid)
                userName.value = ""
                userEmail.value = ""
                userPassword.value = ""
                loaderText.style.display = "block";
                loader.style.display = "none";
                setTimeout(function () {
                    window.location = "login.html"
                }, 1000)
            })
            .catch((error) => {
                var errorDiv = document.getElementById("errorMessage")
                errorMessage.style.display = "block"
                errorDiv.innerHTML = error.message;
                loaderText.style.display = "none";
                loader.style.display = "block";
                setTimeout(function () {
                    loader.style.display = "none";
                    loaderText.style.display = "block";
                }, 1000);
                setTimeout(function () {
                    errorMessage.style.display = "none";
                }, 2000);
            })
    }
}



function login() {
    // let main = document.getElementById("main-div")
    // let mainLoader = document.getElementById("main-loader")
    loaderText.style.display = "none";
    loader.style.display = "block";
    // main.style.display="none"
    // mainLoader.style.display="block"
    firebase.auth().signInWithEmailAndPassword(userEmail.value, userPassword.value)
        .then((res) => {
            // Signed in 
            setTimeout(function () {
                window.location = "profile.html"
                // main.style.display = "block"
                // mainLoader.style.display = "none "
            }, 1000);
        })
        .catch((error) => {
            var errorDiv = document.getElementById("errorMessage")
            errorMessage.style.display = "block"
            loader.style.display = "block";
            errorDiv.innerHTML = error.message;
            loaderText.style.display = "none";
            setTimeout(function () {
                loader.style.display = "none";
                errorMessage.style.display = "none";
                loaderText.style.display = "block";
            }, 2000);
        });
}

function logout () {
    firebase.auth().signOut()
        .then(() => {
            localStorage.removeItem("userId")
            window.location = "login.html"
        })
}

let userid = localStorage.getItem("userId")

