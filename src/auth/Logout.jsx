import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

const Logout = async () => {
  await signOut(auth);
};

export default Logout