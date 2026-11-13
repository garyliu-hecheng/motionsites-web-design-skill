import { useRef, useState, type PointerEvent } from 'react';
import { ArrowRight, ChevronRight, Timer } from 'lucide-react';

const wallpaperUrl =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260704_143500_a76b8e64-2c69-4683-80e7-2bb060a921d6.png&w=1280&q=85';

const options = [
  { id: 1, label: 'Sleep quality', number: '01' },
  { id: 2, label: 'Stress', number: '02' },
  { id: 3, label: 'Weight', number: '03' },
  { id: 4, label: 'Skin', number: '04' },
];

function WaveformIcon() {
  return (
    <svg width="27" height="27" viewBox="0 0 27 27" fill="none" aria-hidden="true">
      <path
        d="M4 11v5M8.75 7.5v12M13.5 4.5v18M18.25 8v11M23 11v5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function App() {
  const [selected, setSelected] = useState<number[]>([2, 4]);
  const [voiceActive, setVoiceActive] = useState(false);
  const [slideX, setSlideX] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, startOffset: 0, lastOffset: 0 });

  function toggleOption(id: number) {
    setSelected((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  }

  function maxTravel() {
    return Math.max(0, (trackRef.current?.clientWidth ?? 0) - 56);
  }

  function onThumbPointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (confirmed) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      active: true,
      startX: event.clientX,
      startOffset: slideX,
      lastOffset: slideX,
    };
  }

  function onThumbPointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (!dragRef.current.active || confirmed) return;
    const next = Math.min(
      maxTravel(),
      Math.max(0, dragRef.current.startOffset + event.clientX - dragRef.current.startX),
    );
    dragRef.current.lastOffset = next;
    setSlideX(next);
  }

  function finishDrag() {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    const max = maxTravel();
    if (max > 0 && dragRef.current.lastOffset >= max * 0.85) {
      setSlideX(max);
      setConfirmed(true);
    } else {
      setSlideX(0);
    }
  }

  return (
    <main className="stage min-h-screen bg-white px-5 py-8 font-sans">
      <div className="phone-wrap">
      <div className="phone-frame" aria-label="Vitaforge Daily wellness quiz phone preview">
        <div
          className="wallpaper"
          style={{ backgroundImage: 'url("' + wallpaperUrl + '")' }}
          aria-hidden="true"
        />
        <div className="wallpaper-overlay" aria-hidden="true" />
        <div className="dynamic-island" aria-hidden="true" />

        <div className="screen-content flex h-full flex-col px-6 pb-6 pt-14">
          <div className="liquid-glass entry header-badge mb-10 inline-flex w-fit items-center gap-2 rounded-full px-3 py-2.5">
            <Timer size={12} strokeWidth={2} className="text-white/80" aria-hidden="true" />
            <span className="text-xs font-medium text-white/90">Vitaforge Daily</span>
          </div>

          <div className="entry title-section mb-8">
            <p className="mb-3 text-sm text-white/60">Choose all that apply</p>
            <h1 className="max-w-[302px] text-[28px] font-normal leading-[1.08] tracking-[-0.045em] text-white">
              What aspects of your wellness would you like to boost?
            </h1>
          </div>

          <div className="selection-grid grid flex-1 grid-cols-2 content-center gap-3" role="group" aria-label="Wellness goals">
            {options.map((option, index) => {
              const isSelected = selected.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleOption(option.id)}
                  className={
                    'entry option-card relative flex h-[100px] flex-col justify-between rounded-[32px] p-4 text-left text-white ' +
                    (isSelected ? 'liquid-glass-selected' : 'liquid-glass')
                  }
                  style={{ animationDelay: 0.4 + index * 0.08 + 's' }}
                >
                  <span className="text-[11px] font-medium text-white/50">{option.number}</span>
                  <span className="text-base font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>

          <div className="entry voice-section relative my-6 flex flex-col items-center">
            <div className="voice-glow" aria-hidden="true" />
            <button
              type="button"
              aria-label="Voice input preview"
              aria-pressed={voiceActive}
              onClick={() => setVoiceActive((value) => !value)}
              className={
                'liquid-glass voice-button relative grid h-16 w-16 place-items-center rounded-full text-white ' +
                (voiceActive ? 'voice-active' : '')
              }
            >
              <WaveformIcon />
            </button>
            <span className="relative mt-2 text-xs text-white/70">voice</span>
          </div>

          <div className="entry slider-section">
            <div
              ref={trackRef}
              className={'liquid-glass slide-track relative h-14 w-full rounded-full ' + (confirmed ? 'is-confirmed' : '')}
              aria-label="Slide to confirm selected wellness goals"
            >
              <span className="slide-label absolute inset-0 flex items-center justify-center text-sm font-medium text-white/60">
                Done
              </span>
              <span className="absolute right-5 top-1/2 flex -translate-y-1/2 items-center">
                {[0.4, 0.5, 0.6].map((opacity) => (
                  <ChevronRight key={opacity} size={14} strokeWidth={2} color="white" opacity={opacity} aria-hidden="true" />
                ))}
              </span>
              <button
                type="button"
                aria-label={confirmed ? 'Selection confirmed' : 'Drag right to confirm'}
                aria-disabled={confirmed}
                onClick={(event) => {
                  if (event.detail === 0 && !confirmed) {
                    setSlideX(maxTravel());
                    setConfirmed(true);
                  }
                }}
                onPointerDown={onThumbPointerDown}
                onPointerMove={onThumbPointerMove}
                onPointerUp={finishDrag}
                onPointerCancel={finishDrag}
                className={'slide-thumb absolute left-[6px] top-[6px] grid h-11 w-11 place-items-center rounded-full bg-white text-gray-800 ' + (dragRef.current.active ? 'dragging' : '')}
                style={{ transform: 'translateX(' + slideX + 'px)' }}
              >
                <ArrowRight size={19} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
            <span className="sr-only" role="status" aria-live="polite">
              {confirmed ? 'Selection confirmed.' : ''}
            </span>
          </div>
        </div>
      </div>
      </div>
    </main>
  );
}

export default App;
