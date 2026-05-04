export default function LoadingScreen() {
  return (
    <div className="viewfinder-menu loading-screen">
      <div className="viewfinder-corner top-left" />
      <div className="viewfinder-corner top-right" />
      <div className="viewfinder-corner bottom-left" />
      <div className="viewfinder-corner bottom-right" />
      <div className="viewfinder-rec">
        <span />
        LOAD
      </div>
      <div className="loading-screen-content">
        <img src="/assets/BeyondDeathLongTransparent.png" alt="Beyond Death" />
        <div className="loading-bar">
          <span />
        </div>
      </div>
    </div>
  );
}
