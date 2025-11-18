import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
//NO HEADER PAGES BELOW IMPORT
import NotFound from "./pages/NotFound";
export default function App() {
    return (
        <Routes>
            {/* Routes WITH header */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/contact" element={<Contact />} />

            </Route>

            {/* Routes WITHOUT header */}
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />}/>
        </Routes>
    );
}
