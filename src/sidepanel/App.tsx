import "./App.css";

import "@radix-ui/themes/styles.css";

import { Dashboard } from "@/components/Dashboard";
import { Theme } from "@radix-ui/themes";

export default function App() {
  return (
    <Theme radius="full">
      <Dashboard />
    </Theme>
  );
}
