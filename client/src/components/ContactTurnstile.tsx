import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render(container: HTMLElement, options: Record<string, unknown>): string | number;
      reset(widgetId?: string | number): void;
      remove(widgetId: string | number): void;
    };
  }
}

/** Mount with the last form step, rather than before its animated container exists. */
export function ContactTurnstile({ siteKey, language, onToken, resetVersion }: {
  siteKey?: string; language: 'en' | 'th'; onToken(token: string): void; resetVersion: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    onToken(''); setFailed(false);
    if (!siteKey) return;
    let widget: string | number | null = null;
    let stopped = false;
    const started = Date.now();
    const render = () => {
      if (stopped || widget !== null || !container.current) return;
      if (!window.turnstile) {
        if (Date.now() - started > 15_000) { window.clearInterval(timer); setFailed(true); }
        return;
      }
      try {
        widget = window.turnstile.render(container.current, {
          sitekey: siteKey, action: 'contact', theme: 'light', language,
          callback: (token: string) => { if (!stopped) { onToken(token); setFailed(false); } },
          'expired-callback': () => { if (!stopped) onToken(''); },
          'timeout-callback': () => { if (!stopped) { onToken(''); setFailed(true); } },
          'error-callback': () => { if (!stopped) { onToken(''); setFailed(true); } },
        });
      } catch { setFailed(true); }
      window.clearInterval(timer);
    };
    const timer = window.setInterval(render, 250);
    render();
    return () => {
      stopped = true; window.clearInterval(timer); onToken('');
      if (widget !== null) window.turnstile?.remove(widget);
    };
  }, [siteKey, language, onToken, resetVersion, attempt]);
  return <div className="pt-2">
    <div ref={container} />
    {!siteKey && <p role="alert" className="text-sm text-red-700">{language === 'en' ? 'Security verification is unavailable. Please contact us by phone or email.' : 'ยังไม่พร้อมยืนยันความปลอดภัย กรุณาติดต่อทางโทรศัพท์หรืออีเมล'}</p>}
    {failed && <div role="alert" className="text-sm text-red-700">
      <p>{language === 'en' ? 'Security verification could not finish. Your form details are still here.' : 'ยืนยันความปลอดภัยไม่สำเร็จ ข้อมูลที่กรอกยังอยู่ครบ'}</p>
      <button type="button" className="underline" onClick={() => setAttempt(n => n + 1)}>{language === 'en' ? 'Try verification again' : 'ลองยืนยันอีกครั้ง'}</button>
    </div>}
  </div>;
}
