import Login from "./components/auth/login";
import Register from "./components/auth/register";

import Header from "./components/header";
import Home from "./components/home";

import { AuthProvider } from "./contexts/authContext";
import { useRoutes } from "react-router-dom";

import BudgetGeneral from "./Pages/BudgetGeneral/BudgetGeneral";
import BudgetParrain from './Pages/BudgetParrain/BudgetParrain';
import Unauthorized from "./Pages/Unauthorized";

function App() {
  const routesArray = [
    {
      path: "*",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/budget-general",
      element: <BudgetGeneral />,
    },
    {
      path: "/budget-parrain",
      element: <BudgetParrain />,
    },
    {
      path: "/unauthorized",
      element: <Unauthorized />,
    },
  ];
  let routesElement = useRoutes(routesArray);
  return (
    <AuthProvider>
      <Header />
      <div className="w-full h-screen flex flex-col">{routesElement}</div>
    </AuthProvider>
  );
}

export default App;
