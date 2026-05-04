// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Profiler } from "react";
import type { ProfilerOnRenderCallback } from "react";

const onRenderCallback: ProfilerOnRenderCallback = (
  id, // the "id" prop of the Profiler tree that has just committed
  phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
  actualDuration, // time spent rendering the committed update
  baseDuration, // estimated time to render the entire subtree without memoization
  startTime, // when React began rendering this update
  commitTime, // when React committed this update
) => {
  // Aggregate or log results to a service
  // console.log(`${id} render time: ${actualDuration}ms`);
  // console.log(`Phase: ${phase}`);
  // console.log(`Base duration: ${baseDuration}ms`);
  // console.log(`Start time: ${startTime}ms`);
  // console.log(`Commit time: ${commitTime}ms`);
};

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <Profiler id='Navigation' onRender={onRenderCallback}>
    <App />
  </Profiler>,
  // </StrictMode>,
);
