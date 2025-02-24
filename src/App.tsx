import { RecoilRoot } from "recoil";
import "./App.css";
import AppBootstrap from "./AppBootstrap";
import AuthProvider from "./providers/AuthProvider";

export default function App() {
  return (
    <main>
      <RecoilRoot>
      <AuthProvider>
        <AppBootstrap />
      </AuthProvider>
      </RecoilRoot>
    </main>
  );
}
