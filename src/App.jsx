// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import Delivery from "./pages/Delivery";
import Management from "./pages/Management";
import CreateOrder from "./pages/CreateOrder";
import NewDelivery from "./pages/NewDelivery";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/admin" element={<Home />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/delivery" element={<Delivery />} />
                <Route path="/management" element={<Management />} />
                <Route path="/create-order" element={<CreateOrder />} />
                <Route path="/new-delivery" element={<NewDelivery />} />
                <Route path="/" exact component={Orders} />
            </Routes>
        </Router>
    );
}

export default App;
