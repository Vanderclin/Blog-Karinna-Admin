var firebaseConfig = {
    apiKey: "AIzaSyB3sWlDsu8vk-QJaF9uHa0_X04_MG1AzJA",
    authDomain: "karinna-lima.firebaseapp.com",
    databaseURL: "https://karinna-lima-default-rtdb.firebaseio.com",
    projectId: "karinna-lima",
    storageBucket: "karinna-lima.appspot.com",
    messagingSenderId: "139462105718",
    appId: "1:139462105718:web:d8976410fe1424f8f75d57",
    measurementId: "G-TC2QZM9B3Q"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		var displayName = user.displayName;
		var email = user.email;
		var emailVerified = user.emailVerified;
		var photoURL = user.photoURL;
		var isAnonymous = user.isAnonymous;
		var uid = user.uid;
		var providerData = user.providerData;

		firebase.database().ref('users').child(uid).on('value', function (snapshot) {
			var presentation = snapshot.child('presentation').val();
			if ((presentation === null) || (presentation === false)) {
				$("#modal_presentation").modal("show");
			}
		});


		// Displays the user's photo
		if (photoURL === null) {
			document.getElementById("modal-account-image").src = "../assets/images/logo.png";
			document.getElementById("dropdownAvatar").src = "../assets/images/logo.png";
			$("#modal-update-profile").modal("show");
		} else {
			document.getElementById("modal-account-image").src = photoURL;
			document.getElementById("dropdownAvatar").src = photoURL;
		}

		// Displays the user's name
		if (displayName === null) {
			document.getElementById("modal-account-name").innerText = "Unknow";
			document.getElementById("navbar-name").innerText = "Unknow";
			document.getElementById("modal-account-email").innerText = email;
		} else {
			document.getElementById("modal-account-name").innerText = displayName;
			document.getElementById("navbar-name").innerText = displayName;
			document.getElementById("modal-account-email").innerText = email;
		}
		// Displays user verification [True or False]
		if (emailVerified === false) {
			document.getElementById("modal-account-check").src = "../assets/icons/user_unverified.png";
			document.getElementById("modal-account-status").innerText = "status: usuário não verificado";
			$("#alert-message").toast("show");
			document.getElementById("message").innerText = "Por favor, confirme seu endereço de e-mail";
			document.getElementById("modal-account-activation-button").style.display = "block";
			document.getElementById("floatingActionButton").style.display = "none";
		} else {
			document.getElementById("modal-account-check").src = "../assets/icons/user_verified.png";
			document.getElementById("modal-account-status").innerText = "status: usuário verificado";
			document.getElementById("modal-account-activation-button").style.display = "none";
			document.getElementById("floatingActionButton").style.display = "block";
		}

	} else {
		window.location.replace('/');
	}
});

$("#modal-button-signout").click(function () {
	firebase.auth().signOut().then(function () {
		// Sign-out successful.
		window.location.reload();
	}).catch(function (error) {
		// An error happened.
	});
});

function accountActivation() {
	var user = firebase.auth().currentUser;
	user.sendEmailVerification().then(function () {
		// Email sent.
	}).catch(function (error) {
		// An error happened.
	});
}

function setTrue() {
	var uid = firebase.auth().currentUser.uid;
	firebase.database().ref('users').child(uid).child('presentation').set(true);
}

/** Account Delete *****************************************/
function accountDelete() {
	var user = firebase.auth().currentUser;
	user.delete().then(function () {
		// User deleted
		setTimeout(function () {
			window.location.replace("/");
		}, 1000);
	}).catch(function (error) {
		// An error happened.
	});
}
/***********************************************************/

function updateProfile() {

	var update_avatar = document.getElementById("avatar").files[0];
	var update_name = document.getElementById("avatar-name").value;
	var uid = firebase.auth().currentUser.uid;
	var storageRef = firebase.storage().ref("users").child("profiles").child(uid);
	var uploadTask = storageRef.put(update_avatar);

	uploadTask.on('state_changed', function (snapshot) {
		var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		document.getElementById('percentage').innerText=parseInt(progress)+"%";
		var finish = parseInt(progress);
		if (finish == 100) {
			setTimeout(function(){ window.location.reload(); }, 5000);
		}
		switch (snapshot.state) {
			case firebase.storage.TaskState.PAUSED: // or 'paused'
				console.log('Upload is paused');
				break;
			case firebase.storage.TaskState.RUNNING: // or 'running'
				console.log('Upload is running');
				break;
		}
	}, function (error) {
		// Handle unsuccessful uploads
	}, function () {
		// Handle successful uploads on complete
		// For instance, get the download URL: https://firebasestorage.googleapis.com/...
		uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
			console.log('File available at', downloadURL);

			var user = firebase.auth().currentUser;
			var data = {
				name: update_name,
				picture: downloadURL
			};
			firebase.database().ref().child("users").child(uid).set(data);

			user.updateProfile({
				displayName: update_name,
				photoURL: downloadURL
			}).then(function () {
				// Update successful.
			}).catch(function (error) {
				// An error happened.
			});
		});
	});
}

$(document).ready(function () {

	firebase.database().ref('posts').orderByChild('title').on('child_added', function (snapshot) {
		var card = "";
		card += '<div class="card">';
		card += '<img src="' + snapshot.child('image').val() + '" id="' + snapshot.child('key').val() + '" onClick="resultClick(this.id)">';
		card += '<h5 class="hide">' + snapshot.child('title').val() + '</h5>';
		card += '<h6 class="hide">' + snapshot.child('author').val() + '</h6>';
		card += '</div>';

		$("#content-books").html($("#content-books").html() + card);
	});

	$("#publish_post").on('click', function () {

		var bookimage = document.getElementById("book_image").files[0];
		var bookname = $("#book_name").val();
		var bookauthor = $("#book_author").val();
		var bookurl = $("#book_url").val();
		var bookdescription = $("#book_description").val();

		// Generate a reference to a new location and add some data using push()
		var postsRef = firebase.database().ref('posts').push();
		// Get the unique key generated by push()
		var bookkey = postsRef.key;


		var ref = firebase.storage().ref("book");

		var uploadTask = ref.child("images/" + bookimage.name).put(bookimage);
		uploadTask.on('state_changed', function (snapshot) {
			var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			$('.progress-bar').css('width', progress + '%').attr('aria-valuenow', progress);
			switch (snapshot.state) {
				case firebase.storage.TaskState.PAUSED: // or 'paused'
					console.log('Upload is paused');
					break;
				case firebase.storage.TaskState.RUNNING: // or 'running'
					console.log('Upload is running');
					break;
			}
		}, function (error) {
			// Handle unsuccessful uploads
		}, function () {
			firebase.database().ref('users').child(uid).child('uploads_scale').child(daysName(new Date)).set(firebase.database.ServerValue.increment(1));
			// Handle successful uploads on complete
			// For instance, get the download URL: https://firebasestorage.googleapis.com/...
			uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
				console.log('File available at', downloadURL);
				firebase.database().ref('posts').child(bookkey).set({
					image: downloadURL,
					title: bookname,
					author: bookauthor,
					url: bookurl,
					description: bookdescription,
					key: bookkey
				});
			});
		});

		$("#book_image_preview").attr("src", "../assets/images/cover.png");
		$("#book_name").val("");
		$("#book_author").val("");
		$("#book_url").val("");
		$("#book_description").val("");

		var uid = firebase.auth().currentUser.uid;
		firebase.database().ref('users/').child(uid).child('uploads').set(firebase.database.ServerValue.increment(1));

		setTimeout(function () {
			$("#modal_add").modal("hide");
		}, 5000);

	});

});

function resultClick(key) {
	$("#modal-content-book").modal("show");
	firebase.database().ref('posts').child(key).child('views').set(firebase.database.ServerValue.increment(1));
	firebase.database().ref('posts').child(key).on('value', function getData(snapshot) {
		
		var image = snapshot.child('image').val();
		var name = snapshot.child('title').val();
		var author = snapshot.child('author').val();
		var description = snapshot.child('description').val();
		var download = snapshot.child('downloads').val();
		var views = snapshot.child('views').val();
		var url = snapshot.child('url').val();

		document.getElementById("b_image").src = image;
		document.getElementById("b_name").innerText = name;
		document.getElementById("b_author").innerText = author;
		document.getElementById("b_description").innerText = description;
		if (download === null) {
			document.getElementById("b_download_number").innerText = "0";
		} else {
			document.getElementById("b_download_number").innerText = download;
		}
		if (views === null) {
			document.getElementById("b_views").innerText = "0";
		} else {
			document.getElementById("b_views").innerText = views;
		}

		var buttonDownload = "<button id='" + key + "' onClick='getURL(this.id)' class='btn btn-outline-light w-100'>Baixar</button>";
		document.getElementById("b_download").innerHTML = buttonDownload;
	});
}


function getURL(url) {
	firebase.database().ref('posts').child(url).on('value', function (snapshot) {
		var book_url = snapshot.child('url').val();
		if (book_url === null) {
			alert("O código não é válido!");
		} else {
			window.open(book_url, '_blank');
		}
	});
	
	var uid = firebase.auth().currentUser.uid;
	firebase.database().ref('posts').child(url).child('downloads').set(firebase.database.ServerValue.increment(1));
	firebase.database().ref('users').child(uid).child('downloads').set(firebase.database.ServerValue.increment(1));
	firebase.database().ref('users').child(uid).child('downloads_scale').child(daysName(new Date)).set(firebase.database.ServerValue.increment(1));
	$("#modal-content-book").modal("hide");
}

function daysName(date) {
	var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
	var dn = String(date.getDay());
	var dayName = days[dn];
    var names = dayName;
    return names;
}
