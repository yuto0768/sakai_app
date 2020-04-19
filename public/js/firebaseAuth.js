// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCWTMb6bFIRUcf8wKSZzhvk_e7zu2nkPMk",
  authDomain: "samurai-auth.firebaseapp.com",
  databaseURL: "https://samurai-auth.firebaseio.com",
  projectId: "samurai-auth",
  storageBucket: "samurai-auth.appspot.com",
  messagingSenderId: "267828173423",
  appId: "1:267828173423:web:c092ce28e8cb12e9750b9a"
};

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      console.log(`result: ${authResult} ${redirectUrl}`)
      let user = authResult.user
      if (user) {
        user.getIdToken(/* forceRefresh */ true).then(function (idToken) {
          $.post("auth", { token: idToken })
            .done((result) => {
              console.log(result)
              window.location.href = "/"
            }).fail((error) => {
              console.log(error)
            })
        })
      }
      return false;
    },
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'redirect',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  // Terms of service url.
  tosUrl: '/services',
  // Privacy policy url.
  privacyPolicyUrl: '/privacy'
};

$(document).ready(() => {
  firebase.initializeApp(firebaseConfig);
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  ui.start('#firebaseui-auth-container', uiConfig);
})