import { useEffect, type MouseEvent, type PointerEvent } from "react";
import { usePlayerData } from "../context/PlayerData";

export default function SafeKeypad() {
  const {
    safeKeypadOpen,
    safeKeypadCode,
    safeKeypadError,
    closeSafeKeypad,
    pressSafeKey,
    submitSafeKeypad,
  } = usePlayerData();

  useEffect(() => {
    if (!safeKeypadOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (/^\d$/.test(e.key)) pressSafeKey(e.key);
      if (e.key === "Backspace") pressSafeKey("backspace");
      if (e.key === "Enter") submitSafeKeypad();
      if (e.key === "Escape") closeSafeKeypad();
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [closeSafeKeypad, pressSafeKey, safeKeypadOpen, submitSafeKeypad]);

  if (!safeKeypadOpen) return null;

  const blockModalEvent = (
    e: MouseEvent<HTMLElement> | PointerEvent<HTMLElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const pressButton = (key: string) => (e: PointerEvent<HTMLButtonElement>) => {
    blockModalEvent(e);
    pressSafeKey(key);
  };

  const submitButton = (e: PointerEvent<HTMLButtonElement>) => {
    blockModalEvent(e);
    submitSafeKeypad();
  };

  const closeButton = (e: PointerEvent<HTMLButtonElement>) => {
    blockModalEvent(e);
    closeSafeKeypad();
  };

  return (
    <div
      className='safe-keypad-backdrop'
      onClick={blockModalEvent}
      onPointerDown={blockModalEvent}
    >
      <div
        className='safe-keypad'
        onClick={blockModalEvent}
        onPointerDown={blockModalEvent}
      >
        <h2>SAFE</h2>
        <div
          className={
            safeKeypadError
              ? "safe-keypad-display safe-keypad-display--error"
              : "safe-keypad-display"
          }
        >
          {safeKeypadCode.padEnd(4, "_")}
        </div>
        <div className='safe-keypad-grid'>
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
            <button
              key={digit}
              type='button'
              onClick={blockModalEvent}
              onPointerDown={pressButton(digit)}
            >
              {digit}
            </button>
          ))}
          <button
            type='button'
            onClick={blockModalEvent}
            onPointerDown={pressButton("clear")}
          >
            C
          </button>
          <button
            type='button'
            onClick={blockModalEvent}
            onPointerDown={pressButton("0")}
          >
            0
          </button>
          <button
            type='button'
            onClick={blockModalEvent}
            onPointerDown={submitButton}
          >
            OK
          </button>
        </div>
        <button
          className='safe-keypad-close'
          type='button'
          onClick={blockModalEvent}
          onPointerDown={closeButton}
        >
          Close
        </button>
      </div>
    </div>
  );
}
