import { useEffect, useState } from 'react';
import { usePlayerData } from '../context/PlayerData';

type PreviewPhase = 'full' | 'dock' | 'exit';

export default function PhotoHud() {
  const { takingImage, capturedImage, photoJournal } = usePlayerData();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [phase, setPhase] = useState<PreviewPhase>('full');
  const [journalOpen, setJournalOpen] = useState(false);

  useEffect(() => {
    if (!capturedImage) return;
    setPreviewImage(capturedImage);
    setPhase('full');

    const dockTimer = window.setTimeout(() => setPhase('dock'), 900);
    const exitTimer = window.setTimeout(() => setPhase('exit'), 4200);
    const clearTimer = window.setTimeout(() => {
      setPreviewImage(null);
      setPhase('full');
    }, 5000);

    return () => {
      window.clearTimeout(dockTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(clearTimer);
    };
  }, [capturedImage]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'j') {
        setJournalOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="photo-hud" aria-live="polite">
      <div
        className={
          takingImage ? 'photo-flash photo-flash--active' : 'photo-flash'
        }
      />

      {previewImage && (
        <img
          className={`photo-preview photo-preview--${phase}`}
          src={previewImage}
          alt="Latest camera capture"
        />
      )}

      <button
        className="photo-journal-toggle"
        type="button"
        onClick={() => setJournalOpen((open) => !open)}
      >
        Journal {photoJournal.length}
      </button>

      <aside
        className={
          journalOpen ? 'photo-journal photo-journal--open' : 'photo-journal'
        }
      >
        <h2>Photo Journal</h2>
        {photoJournal.length === 0 ? (
          <p>Take some pictures, it might reveal some secrets</p>
        ) : (
          <div className="photo-journal-grid">
            {photoJournal.map((image, index) => (
              <img
                key={`${image.slice(-16)}-${index}`}
                src={image}
                alt={`Journal capture ${index + 1}`}
              />
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}
