import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { getFirestore, doc, getDoc } from "firebase/firestore";
const router = useRouter()

import {  watch } from 'vue';

var isLoggedIn = ref(JSON.parse(localStorage.getItem('isLoggedIn')) || false);

export function useAuth() {

  watch(isLoggedIn, (newValue) => {
    localStorage.setItem('isLoggedIn', JSON.stringify(newValue));
  });

  return { isLoggedIn };
}

const toggleLogin = () => {
  isLoggedIn.value = !isLoggedIn.value;
};

const auth = getAuth();

var emailSign = ref('')
var passwordSign = ref('')
var errMsg = ref()
var user = ref('')

const emptyForm = () => {
  email.value = ''
  password.value = ''
  emailSign.value = ''
  passwordSign.value = ''
  errMsg.value =''
}
var userName = ref('')
import db from '../firebase/init.js'

// const registerSign = (router) => {
    
//   const auth = getAuth()
//   signInWithEmailAndPassword(auth, emailSign.value, passwordSign.value)
//     .then((data) => {
//       console.log('Succesfully signed in')
//       user.value = auth.currentUser
//       console.log(auth.currentUser)
//       toggleLogin();
//       router.push('/')

      
      
//     })
//     .catch((error) => {
//       console.log(error.code)
//       switch (error.code) {
//         case "auth/invalid-email":
//           errMsg.value = 'Invalid email'
//           break
//         case "auth/user-not-found":
//           errMsg.value = 'there is not an account with that email'
//           break
//         case "auth/wrong-password":
//           errMsg.value = 'incorrect password'
//           break
//           case "auth/invalid-credential":
//             errMsg.value = 'incorrect password or email'
//             break
//         default :
// 			console.log(error)
//           errMsg.value = error.message
//           break
//       }
//     })
// }
const registerSign = async (router) => {
    const auth = getAuth();
    const userDocRef = doc(db, 'users', userName.value);
  
    try {
      const docSnap = await getDoc(userDocRef);
  
      if (docSnap.exists()) {
        const userData = docSnap.data();
  
        if (userData.email === emailSign.value) {
          signInWithEmailAndPassword(auth, userData.email, passwordSign.value)
            .then((data) => {
              console.log('Successfully signed in');
              user.value = auth.currentUser;
              console.log(auth.currentUser);
              toggleLogin();
              router.push('/');
            })
            .catch((error) => {
              console.log(error.code);
              switch (error.code) {
                case "auth/invalid-email":
                  errMsg.value = 'Invalid email';
                  break;
                case "auth/user-not-found":
                  errMsg.value = 'There is not an account with that email';
                  break;
                case "auth/wrong-password":
                  errMsg.value = 'Incorrect password';
                  break;
                case "auth/invalid-credential":
                  errMsg.value = 'Incorrect password or email';
                  break;
                default:
                  console.log(error);
                  errMsg.value = error.message;
                  break;
              }
            });
        } else {
          errMsg.value = 'Email does not match with the username';
        }
      } else {
        errMsg.value = 'Username does not exist';
      }
    } catch (error) {
      console.error('Error getting user document: ', error);
    }
  }


var email = ref('')
var password = ref('')
var confirmPassword = ref('')



import { addUser, userExists } from '@/scripts/firebaseScripts';

const register = async (router) => {
    
  if (password.value !== confirmPassword.value) {
    errMsg.value = 'Passwords do not match';
    return;
  }
  else if(await userExists(userName.value)){
    errMsg.value = 'Username already exists';
    return;
  }
  else if(userName.value === ''){
	errMsg.value = 'Username cannot be empty';
	return;
  }
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      console.log('Successfully registered!');
      user.value = auth.currentUser;
      
      addUser(userName.value)
	  toggleLogin()
      router.push('/')
    })
    .catch((error) => {
      switch (error.code) {
        case 'auth/email-already-in-use':
          errMsg.value = 'Email already exists';
          break;
        case 'auth/weak-password':
          errMsg.value = 'Password is too weak';
          break;
        default:
          errMsg.value = error.message;
          break;
      }
    });
}

async function signOutUser() {
    try {
        await signOut(auth);
        emptyForm()
		toggleLogin();
        console.log('User signed out successfully');
    } catch (error) {
        console.error('Error signing out: ', error);
    }
}

export { 
  toggleLogin, 
  emailSign, 
  passwordSign, 
  errMsg, 
  user, 
  emptyForm, 
  registerSign, 
  email, 
  password, 
  confirmPassword, 
  userName, 
  register, 
  signOutUser 
};