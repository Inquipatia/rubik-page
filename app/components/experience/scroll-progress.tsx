type ScrollProgressProps = {
  progress: number;
};

export default function ScrollProgress({
  progress,
}: ScrollProgressProps) {
  return (
    <div className="scroll-progress-wrap">
      <div className="scroll-progress-track">
        <div
          className="scroll-progress-fill"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </div>
  );
}