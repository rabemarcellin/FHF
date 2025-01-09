import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Landing from "../pages/guest/Landing";
import "../App.css";
import Login from "../pages/guest/Login";
import Root from "./Root";
import Upload from "../pages/app/Upload";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/app/Dashboard";
import Logout from "../pages/app/Logout";
import ArticleDetails, { loader } from "../components/ArticleDetails";
import Memorium from "../pages/app/Memorium";
import MemoriumDay from "../components/MemoriumDay";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<Landing />} />
      <Route path="login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="logout" element={<Logout />} />
        <Route path="upload" element={<Upload />} />

        <Route path="memorium" element={<Memorium />} />
        <Route path="memorium/:date" element={<MemoriumDay />} />
        <Route
          path="memorium/:date/:id"
          element={<ArticleDetails />}
          loader={loader}
        />
      </Route>
    </Route>
  )
);

export default router;
