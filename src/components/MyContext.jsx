import React, { useState } from "react";
import { MyContext } from "../contexts/MyContext";

export const MyProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const updateUser = (newUser) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('user');
    }
  };

  return (
    <MyContext.Provider value={{ user, setUser: updateUser }}>
      {children}
    </MyContext.Provider>
  );
};
