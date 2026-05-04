import { usePlayerData } from '../context/PlayerData';

export default function CreditsMenu() {
  const { menuPanel, setMenuPanel } = usePlayerData();

  if (menuPanel !== 'credits') return null;

  return (
    <div className="menu-panel viewfinder-menu">
      <div className="viewfinder-corner top-left" />
      <div className="viewfinder-corner top-right" />
      <div className="viewfinder-corner bottom-left" />
      <div className="viewfinder-corner bottom-right" />
      <div className="viewfinder-rec">
        <span />
        INFO
      </div>
      <div className="viewfinder-time">ARCHIVE</div>
      <section className="menu-panel-content credits-panel">
        <header>
          <h2>Credits</h2>
          <button type="button" onClick={() => setMenuPanel(null)}>
            Back
          </button>
        </header>
        <p>Beyond Death</p>
        <p>This is a Demo game.</p>
        <p>Developed By Remi Korbel and Kenzyn Trimble</p>
        <p>Made with React, Three.js, and Rapier</p>
        <hr />
        <h2>Assets</h2>
        <p>Thank you to Poly Haven for textures under public domain.</p>
        <p>
          {' '}
          Sound Effect by{' '}
          <a href="https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=45475">
            freesound_community
          </a>{' '}
          from{' '}
          <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=45475">
            Pixabay
          </a>
        </p>
        <p>
          Sound Effect by{' '}
          <a href="https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=106562">
            freesound_community
          </a>{' '}
          from{' '}
          <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=106562">
            Pixabay
          </a>
        </p>
        <p>
          Sound Effect by{' '}
          <a href="https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=108295">
            freesound_community
          </a>{' '}
          from{' '}
          <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=108295">
            Pixabay
          </a>
        </p>
        <hr />
        <h2>Libraries Used</h2>
        @react-three/drei @react-three/fiber @react-three/postprocessing
        @react-three/rapier @react-three/uikit @react-three/xr r3f-perf react
        react-dom stats.js three "@eslint/js @types/node @types/react
        @types/react-dom @vitejs/plugin-react eslint eslint-plugin-react-hooks
        eslint-plugin-react-refresh globals typescript typescript-eslint vite
      </section>
    </div>
  );
}
