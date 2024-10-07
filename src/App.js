import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import SearchResponce from './pages/SearchResponcePage';
import SearchPage from './pages/SearchPage';
import Login from "./components/Login";
import Register from "./components/Register";
import MyFlightsPage from "./pages/MyFlightsPage";
import UpdateUsernamePage from "./pages/UpdateUsernamePage";
import UpdatePasswordPage from "./pages/UpdatePasswordForm";
import ImportMoneyPage from "./pages/ImportMoneyPage";
import CreateFlightPage from "./pages/CreateFlightPage";

function App() {
  return (
    <Router>
    <div>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={
            <>
            <SearchPage />
            </>
          } />
            <Route path="/login" element={
            <>
            <Login />
            </>
          } />
            <Route path="/register" element={
            <>
            <Register />
            </>
          } />
            <Route path="/found" element={
            <>
            <SearchResponce />
            </>
          } />
            <Route path="/reservation" element={
            <>
            <MyFlightsPage/>
            </>
          } />
            <Route path="/wallet" element={
            <>
            {/* <Pet /> */}
            </>
          } />
           <Route path="/username" element={
            <>
            <UpdateUsernamePage />
            </>
          } />
             <Route path="/password" element={
            <>
            <UpdatePasswordPage />
            </>
          } />
              <Route path="/replenishment" element={
            <>
            <ImportMoneyPage />
            </>
          } />
                <Route path="/admin" element={
            <>
            <CreateFlightPage />
            </>
          } />
        </Routes>
      </main>
    </div>
  </Router>
  );
}

export default App;
