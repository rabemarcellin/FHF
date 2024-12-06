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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<Landing />} />
      <Route path="login" element={<Login />} />
      <Route path="upload" element={<Upload />} />
    </Route>
  )
);

export default router;
