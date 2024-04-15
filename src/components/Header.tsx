"use client"

import React, { useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import type { User } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrentUser(user);
    } else {
      /*if (pathname === "/") {
        router.push("/signin");
      }*/
    }
  });

  const handleSignOut = () => {
    signOut(auth).then(() => {
      setCurrentUser(null);
      router.refresh();
    });
  }

  return (
    <div className="bg-white w-full">
      <div className="text-black p-8 max-w-5xl w-full ml-auto mr-auto flex justify-between items-center">
        <div>Hello, {currentUser ? currentUser?.email : "Guest"}</div>
        {currentUser
        ? <button onClick={() => handleSignOut()}>Sign Out</button>
        :  <button onClick={() => router.push("/signin")}>Sign In</button>}
      </div>
    </div>
  );
};

export default Header;
