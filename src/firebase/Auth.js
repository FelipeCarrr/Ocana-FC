import app from "./app";
import {
  getAuth,
  getMultiFactorResolver,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { useStore } from "../utils/store";

export const auth = getAuth(app);

export const validateSession = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      useStore.getState().ChangeLogged(true);
    } else {
      useStore.getState().ChangeLogged(false);
    }
  });
};

export const LogOut = () => {
  signOut(auth)
    .then(() => {
      useStore.getState().ChangeLogged(false);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const Login = async (email, password) => {
  await setPersistence(auth, browserLocalPersistence)
    .then(async () => {
      return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
          useStore.getState().ChangeLogged(true);
        })
        .catch(async (error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(error);
          if (error.code == "auth/multi-factor-auth-required") {
            const resolver = getMultiFactorResolver(auth, error);
            const phoneInfoOptions = {
              multiFactorHint: resolver.hints[0],
              session: resolver.session,
            };
            const phoneAuthProvider = new PhoneAuthProvider(auth);
            // Send SMS verification code
            return phoneAuthProvider
              .verifyPhoneNumber(
                phoneInfoOptions,
                useStore.getState().captchaId
              )
              .then(async function (verificationId) {
                useStore.getState().ChangeFirstPass(true);
                await waitForVerificationCode();
                // Ask user for the SMS verification code. Then:
                const cred = PhoneAuthProvider.credential(
                  verificationId,
                  useStore.getState().number
                );
                const multiFactorAssertion =
                  PhoneMultiFactorGenerator.assertion(cred);
                // Complete sign-in.
                return resolver.resolveSignIn(multiFactorAssertion);
              })
              .then(function (userCredential) {
                alert(userCredential);
                console.log(userCredential);
              });
          } else if (error.code == "auth/wrong-password") {
            // Handle other errors such as wrong password.
          }
        });
      return;
    })
    .catch((error) => {
      console.log(error);
    });
};

const waitForVerificationCode = () => {
  return new Promise((resolve) => {
    const checkVerificationCode = (state) => {
      if (state.number !== false) {
        resolve();
        unsubscribe();
      }
    };

    const unsubscribe = useStore.subscribe(
      checkVerificationCode,
      (state) => state.number
    );

    if (useStore.getState().number !== false) {
      resolve();
      unsubscribe();
    }
  });
};
