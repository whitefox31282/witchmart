export default function ContactSupport() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="wm-hero-title text-3xl font-semibold" data-testid="text-contact-title">
          Contact / Support
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground" data-testid="text-contact-subtitle">
          Contact form (prototype) and support channels. Add real email/social links when ready.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-sm lg:col-span-2">
          <div className="text-sm font-semibold" data-testid="text-contact-form-title">
            Send a message
          </div>

          <div className="mt-4 grid gap-3">
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold" data-testid="text-label-contact-name">
                Name
              </span>
              <input
                className="wm-focus-ring rounded-xl border bg-background px-3 py-2 text-sm shadow-sm"
                placeholder="Your name"
                data-testid="input-contact-name"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold" data-testid="text-label-contact-email">
                Email
              </span>
              <input
                className="wm-focus-ring rounded-xl border bg-background px-3 py-2 text-sm shadow-sm"
                placeholder="you@domain.com"
                data-testid="input-contact-email"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold" data-testid="text-label-contact-message">
                Message
              </span>
              <textarea
                className="wm-focus-ring min-h-32 rounded-xl border bg-background px-3 py-2 text-sm shadow-sm"
                placeholder="How can we help?"
                data-testid="input-contact-message"
              />
            </label>

            <button
              className="wm-focus-ring inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-95"
              data-testid="button-contact-submit"
              onClick={() => alert("Prototype: message sent (no data sent).")}
            >
              Send (prototype)
            </button>
          </div>
        </div>

        <aside className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="text-sm font-semibold" data-testid="text-contact-support-title">
            Support info
          </div>
          <p className="mt-2 text-sm text-muted-foreground" data-testid="text-contact-support-body">
            Placeholder: support@witchmart.org • community Discord • social links
          </p>

          <div className="mt-4 rounded-xl border bg-background/60 p-4 text-xs text-muted-foreground" data-testid="text-contact-disclaimer">
            Disclaimer: this is a front-end prototype and does not send email yet.
          </div>
        </aside>
      </section>
    </div>
  );
}
