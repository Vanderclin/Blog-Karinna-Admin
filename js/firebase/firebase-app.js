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
		window.location.replace("/home/");
	} else {

	}
});

function signIn() {

	var email = document.getElementById('email-signin').value;
	var password = document.getElementById('password-signin').value;
	if (email.length < 4) {
		alert('Por favor insira um endereço de e-mail.');
		return;
	}
	if (password.length < 4) {
		alert('Por favor insira uma senha.');
		return;
	}
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		if (errorCode === 'auth/wrong-password') {
			alert('Senha incorreta.');
		} else if (errorCode === 'auth/user-not-found') {
			alert('Usuário não registrado.');
		} else {
			alert(errorMessage);
		}
		alert(error);
		document.getElementById('button-sign-in').disabled = false;
	});
	document.getElementById('button-sign-in').disabled = true;
}


function signUp() {

	var email = document.getElementById('email-signup').value;
	var password = document.getElementById('password-signup').value;
	if (email.length < 4) {
		alert('Por favor insira um endereço de e-mail.');
		return;
	}
	if (password.length < 4) {
		alert('Por favor insira uma senha.');
		return;
	}
	// Create user with email and pass.
	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		if (errorCode == 'auth/weak-password') {
			alert('A senha é muito fraca.');
		} else {
			alert(errorMessage);
			
		}
		document.getElementById('button-sign-up').disabled = false;
	});
	document.getElementById('button-sign-up').disabled = true;
}
