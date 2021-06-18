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


function currentDate(){
    var data = new Date(),
        day  = data.getDate().toString(),
        dayF = (day.length == 1) ? '0'+day : day,
        month  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        monthF = (month.length == 1) ? '0'+month : month,
        yearF = data.getFullYear(),
        hours = data.getHours(),
        minutes = data.getMinutes(),
        seconds = data.getSeconds();
    return yearF+monthF+dayF+hours+minutes+seconds;
}

$(document).ready(function () {

	firebase.database().ref('posts').orderByChild('title').on('child_added', function (snapshot) {
		var card = "";
		card += '<div class="col">';
		card += '<div class="card mb-4 rounded-3 shadow-sm">';
		card += '<img class="card-img-top" src="'+snapshot.child('pi').val() +'">';
		card += '<div class="card-body">';
		card += '<div class="d-flex">';
		card += '<span class="me-auto text-left">'+snapshot.child('pn').val() +'</span>';
		card += '<span class="ms-auto text-right">R$ '+mascara(snapshot.child('pp').val())+'</span>';
		card += '</div>';
		card += '<p class="mt-3 text-start">'+snapshot.child('pd').val() +'</p>';
		card += '<button href="#" class="btn btn-outline-marrs-green float-end" id"'+snapshot.child('pk').val() +'"  onClick="deleteItem(this.id)">Excluir</button>';
		card += '</div>';
		card += '</div>';
		card += '</div>';

		$("#content_posts").html($("#content_posts").html() + card);
	});

	$("#publish_post").on('click', function () {

		var product_image = document.getElementById("product_image").files[0];
		var product_name = $("#product_name").val();
		var product_price = $("#product_price").val();
		var product_description = $("#product_description").val();

		var user = firebase.auth().currentUser;
		var user_photo = user.photoURL;
		var user_name = user.displayName;
		
		var timenow = moment().format('YYYY-MM-DD HH:m:s');

		// Generate a reference to a new location and add some data using push()
		var postsRef = firebase.database().ref('posts').push();
		// Get the unique key generated by push()
		var product_key = postsRef.key;


		var ref = firebase.storage().ref("posts");

		var uploadTask = ref.child("images/" + product_image.name).put(product_image);
		uploadTask.on('state_changed', function (snapshot) {
			var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			$('.progress-bar').css('width', progress + '%').attr('aria-valuenow', progress);
			if (parseInt(progress) == 100) {
				setTimeout(function () {
					$("#modal_add").modal("hide");
					}, 5000);
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
			uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
				console.log('File available at', downloadURL);
				firebase.database().ref('posts').child(product_key).set({
					pi: downloadURL,
					pn: product_name,
					pp: product_price,
					pd: product_description,
					pk: product_key,
					p_un: user_name,
					p_up: user_photo,
                    p_date: currentDate()
					
				});
			});
		});
		
		$("#product_image_preview").attr("src", "../assets/images/cover.webp");
		$("#product_name").val("");
		$("#product_price").val("");
		$("#product_description").val("");
	
	});

});




function deleteItem(key) {
	firebase.database().ref('posts').remove(key);
	setTimeout(function(){ window.location.reload(); }, 1000);
}
