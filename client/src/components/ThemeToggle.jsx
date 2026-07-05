import { useTheme } from "../context/ThemeContext.jsx";
import { IconMoon, IconSun, IconSystem } from "./Icons.jsx";

const modes = [
  ["light", IconSun, "Light"],
  ["dark", IconMoon, "Dark"],
  ["system", IconSystem, "System"]
];

export default function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  return (
    <div className="theme-toggle" role="group" aria-label="Theme">
      {modes.map(([mode, Icon, label]) => (
        <button
          key={mode}
          type="button"
          className={`theme-toggle-btn${preference === mode ? " is-active" : ""}`}
          onClick={() => setPreference(mode)}
          aria-pressed={preference === mode}
          title={`${label} theme`}
        >
          <Icon />
          <span className="sr-only">{label}</span>
        </button>
      ))}
    </div>
  );
}
