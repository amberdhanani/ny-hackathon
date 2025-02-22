import { Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import TranscriptsPage from "../pages/TranscriptsPage";
import TranscriptPage from "../pages/TranscriptPage";
import NewRecordingsPage from "../pages/NewRecordingsPage";
import CustomRoute from "./CustomRoute";



const SiteRoutes = () => {
  return (
    <>
      <Routes>
        <Route
          path={"/login"}
          element={
            <CustomRoute path={"/login"}>
              <LoginPage />
            </CustomRoute>
          }
        />
        <Route
          path={"/analytics"}
          element={
            <CustomRoute path={"/analytics"}>
              <AnalyticsPage />
            </CustomRoute>
          }
        />
        <Route
          path={"/transcripts"}
          element={
            <CustomRoute path={"/transcripts"}>
              <TranscriptsPage />
            </CustomRoute>
          }
        />
        <Route
          path={"/transcript"}
          element={
            <CustomRoute path={"/transcript"}>
              <TranscriptPage />
            </CustomRoute>
          }
        />
        <Route
          path={"/new-recording"}
          element={
            <CustomRoute path={"/new-recording"}>
              <NewRecordingsPage />
            </CustomRoute>
          }
        />
        <Route
          path={"/*"}
          element={
            <CustomRoute path={"/login"}>
              <LoginPage />
            </CustomRoute>
          }
        />
      </Routes>
    </>
  );
};

export default SiteRoutes;