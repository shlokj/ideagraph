import React from "react";
import LoginScreen from "./LoginScreen";
import Main from "./Main";
import { Route, Routes } from "react-router";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/app" element={<Main />} />
        <Route path="/" element={<LoginScreen />} />
      </Routes>
    </div>
  );
}

export default App;
