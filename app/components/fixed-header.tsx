type FixedHeaderProps = {
  activeScene: number;
  onJump: (index: number) => void;
};

const items = ["Intro", "Work", "FAQ", "Contact"];

export default function FixedHeader({
  activeScene,
  onJump,
}: FixedHeaderProps) {
  return (
    <header className="relative z-30 mx-auto flex w-full max-w-7xl items-center justify-between px-6 pt-6 lg:px-10">
      <div className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
        Rubik<span className="text-white/70">.</span>
      </div>

      <nav className="menu-shell hidden md:flex">
        {items.map((item, index) => (
          <button
            key={item}
            onClick={() => onJump(index)}
            className={`menu-pill ${activeScene === index ? "is-active" : ""}`}
          >
            {item}
          </button>
        ))}
      </nav>

      <a
        href="#"
        className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#180d37] transition hover:scale-[1.02]"
      >
        Start
      </a>
    </header>
  );
}