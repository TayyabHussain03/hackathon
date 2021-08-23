var loaderText = document.getElementById("loaderText")
var loader = document.getElementById("loader")
var errorDiv = document.getElementById("errorMessage")
let loading = document.getElementsByClassName("loading")
loaderText.style.display = "block";
loader.style.display = "none";

function uploadFiles(file) {
    let storageRef = firebase.storage().ref(`restImages/Images/${file.name}`)
    let progress1 = document.getElementById("progress")
    progress1.style.display = "block"
    let bar = document.getElementById("bar")
    let uploading = storageRef.put(file)
    return new Promise((resolve, reject) => {
        uploading.on('state_changed',
            (snapshot) => {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                bar.style.width = Math.round(progress.toFixed()) + "%";
                bar.innerHTML = Math.round(progress.toFixed()) + "%";
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                reject(error)
            },
            () => {
                uploading.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    resolve(downloadURL)
                });
            }
        );

    })
}


async function register() {
    var restName = document.getElementById("restName")
    var restDesc = document.getElementById("description")
    var restEmail = document.getElementById("restEmail")
    var restPassword = document.getElementById("restPassword")
    let restImage = document.getElementById("restImage")
    let image = await uploadFiles(restImage.files[0])
    if (restName.value === "") {
        errorMessage.style.display = "block"
        errorDiv.innerHTML = "Please Enter User Name";
        setTimeout(function () {
            errorMessage.style.display = "none";
        }, 10000);
    } else if (restEmail.value === "") {
        errorMessage.style.display = "block"
        errorDiv.innerHTML = "Please Enter Email";
        setTimeout(function () {
            errorMessage.style.display = "none";
        }, 10000);
    } else if (restPassword.value === "" || restPassword.value < 6) {
        errorMessage.style.display = "block"
        errorDiv.innerHTML = "Password should be atleast 6 characters or long";
        setTimeout(function () {
            errorMessage.style.display = "none";
        }, 10000);
    } else {
        firebase.auth().createUserWithEmailAndPassword(restEmail.value, restPassword.value)
            .then((res) => {
                firebase.database().ref(`restData/${res.user.uid}`).set({
                    restName: restName.value,
                    restEmail: restEmail.value,
                    restPassword: restPassword.value,
                    restDesc: restDesc.value,
                    restImage: image
                })

                localStorage.setItem("restId", res.user.uid)
                restName.value = ""
                restEmail.value = ""
                restPassword.value = ""
                restDesc.value = ""
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

let adminID = localStorage.getItem("restID")

firebase.auth().signInWithEmailAndPassword(userEmail.value, userPassword.value)
    .then((res) => {
        // Signed in 
        setTimeout(function () {
            window.location = "dashboard.html"
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

function logout() {
    firebase.auth().signOut()
        .then(() => {
            localStorage.removeItem("restID")
            window.location = "login.html"
        })
}
