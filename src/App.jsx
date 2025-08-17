import { Outlet } from "react-router-dom";
import "./App.css";
import AppShell from "./AppShell.jsx";
import GlobalStyle from "./GlobalStyle.js";

function App() {
  return (
    <AppShell>
      <GlobalStyle />
      <Outlet />
    </AppShell>
  );
}

export default App;
