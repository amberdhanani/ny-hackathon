import "./App.css";
import AppBootstrap from "./AppBootstrap";
import AuthProvider from "./providers/AuthProvider";

export default function App() {
  return (
    <main>
      <AuthProvider>
        <AppBootstrap />
      </AuthProvider>
    </main>
  );
}
