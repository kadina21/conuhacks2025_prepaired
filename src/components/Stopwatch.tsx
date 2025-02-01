import { useStopwatch } from "react-timer-hook";

function Stopwatch() {
  const { seconds, minutes, isRunning, start, pause } = useStopwatch();

  return (
    <div style={{ textAlign: "center" }}>
      <div>
        <span>{minutes}</span>:<span>{seconds}</span>
      </div>
      <p>{isRunning ? "Running" : "Not running"}</p>
      <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
    </div>
  );
}

export default Stopwatch;
