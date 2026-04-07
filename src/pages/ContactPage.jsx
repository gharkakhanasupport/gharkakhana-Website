import { useEffect } from 'react';
import { BiEnvelope, BiMap, BiPhoneCall, BiTimeFive } from 'react-icons/bi';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';
import { contactDetails, contactOptions } from '../data/site';
import { useContactForm } from '../hooks/useContactForm';

const contactMethods = [
  {
    title: 'Call us',
    description: 'Prefer talking? We are just one call away.',
    action: 'Call now',
    href: 'tel:+919477564633',
    Icon: BiPhoneCall,
  },
  {
    title: 'WhatsApp',
    description: 'Quick help, real-time replies.',
    action: 'Chat on WhatsApp',
    href: 'https://wa.me/919477564633',
    Icon: BiPhoneCall,
  },
  {
    title: 'Email',
    description: 'Write to us anytime, we read everything.',
    action: 'Send email',
    href: 'mailto:noreplay.gkk26@gmail.com',
    Icon: BiEnvelope,
  },
];

function getContactInfoIcon(title) {
  if (title === 'Email') return BiEnvelope;
  if (title === 'Contact') return BiPhoneCall;
  if (title === 'Office Address') return BiMap;
  if (title === 'Business Hours') return BiTimeFive;
  return BiEnvelope;
}

function Field({ label, name, value, onChange, error, type = 'text', placeholder, as = 'input', children }) {
  const baseClass = `mt-2 w-full rounded-2xl border bg-brand-cream px-4 py-3 text-sm text-brand-brown outline-none transition placeholder:text-brand-brown/45 focus:border-brand-greenDark ${error ? 'border-error' : 'border-brand-brown/20'}`;

  return (
    <label className="block text-sm font-medium text-brand-brown">
      <span>{label}</span>
      {as === 'textarea' ? (
        <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={6} className={baseClass} />
      ) : as === 'select' ? (
        <select name={name} value={value} onChange={onChange} className={baseClass}>
          {children}
        </select>
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className={baseClass} />
      )}
      {error ? <span className="mt-2 block text-xs text-error">{error}</span> : null}
    </label>
  );
}

export function ContactPage() {
  const { values, errors, status, handleChange, handleSubmit, resetStatus } = useContactForm();

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = window.setTimeout(() => resetStatus(), 3500);
      return () => window.clearTimeout(timer);
    }
  }, [status, resetStatus]);

  return (
    <main>
      <section className="relative overflow-hidden py-8 md:py-10">
        <div className="absolute inset-0 warm-gradient" />
        <Container className="relative z-10">
          <Reveal>
            <div className="surface-panel rounded-[2.4rem] p-8 text-center md:p-12">
              <div className="text-base text-brand-brown/72">Home / Contact</div>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-brand-brown sm:text-5xl md:text-[4rem] md:leading-[1.03]" style={{ fontFamily: 'Playfair Display, serif' }}>
                Let&apos;s talk, we&apos;re listening
              </h1>
              <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-brand-brown/80 sm:text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                Whether it is a question, feedback, or just a thought, we would love to hear from you. Reach out in the way that feels
                easiest and we will respond with care.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="section-pad">
        <Container>
          <Reveal>
            <div className="grid gap-4 md:grid-cols-3">
              {contactMethods.map((method) => (
                <a
                  key={method.title}
                  href={method.href}
                  target={method.href.startsWith('http') ? '_blank' : undefined}
                  rel={method.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="surface-panel rounded-[1.7rem] p-5 transition duration-200 hover:-translate-y-1 hover:shadow-[0_20px_34px_rgba(47,42,61,0.1)] md:p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-green/14 text-[1.35rem] text-brand-greenDark">
                    <method.Icon aria-hidden="true" />
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold text-brand-brown">{method.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-brand-brown/78 md:text-base">{method.description}</p>
                  <div className="mt-4 inline-flex items-center rounded-full border border-brand-green/25 bg-brand-green/8 px-3 py-1.5 text-sm font-semibold text-brand-greenDark">
                    {method.action}
                  </div>
                </a>
              ))}
            </div>
          </Reveal>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <Reveal>
              <div className="rounded-[1.75rem] bg-brand-green p-6 text-white md:p-8">
                <h2 className="text-2xl font-semibold text-white">Contact Information</h2>
                <p className="mt-4 text-sm leading-7 text-white/90">
                  Reach out through any of these channels. You are talking to a real team that cares about helping.
                </p>

                <div className="mt-8 space-y-5">
                  {contactDetails.map((item) => {
                    const Icon = getContactInfoIcon(item.title);

                    return (
                    <div key={item.title} className="flex gap-4 rounded-2xl bg-white/10 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/14 text-[1.35rem] text-white">
                        <Icon aria-hidden="true" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{item.title}</div>
                        <div className="mt-1 text-sm leading-7 text-white/92">{item.value}</div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="rounded-[1.75rem] border border-brand-brown/15 bg-brand-cream p-6 md:p-8">
                <h2 className="text-2xl font-semibold text-brand-brown" style={{ fontFamily: 'Playfair Display, serif' }}>Send us a message</h2>
                <p className="mt-4 text-sm leading-7 text-brand-brown/80">
                  Share what is on your mind and we will respond as soon as we can.
                </p>

                <p className="mt-2 text-sm font-semibold text-brand-greenDark">We usually reply within a few hours.</p>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {['We read every message', 'No bots, real replies', 'Your feedback matters'].map((item) => (
                    <div key={item} className="rounded-xl border border-brand-brown/12 bg-white/75 px-3 py-2 text-sm font-medium text-brand-brown/85">
                      {item}
                    </div>
                  ))}
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                  <Field label="Full Name *" name="name" value={values.name} onChange={handleChange} error={errors.name} placeholder="What should we call you?" />
                  <Field label="Email Address *" name="email" value={values.email} onChange={handleChange} error={errors.email} type="email" placeholder="Where should we reply?" />
                  <Field label="Phone Number" name="phone" value={values.phone} onChange={handleChange} placeholder="Optional: share a number if you prefer a call" />
                  <Field label="Subject *" name="subject" value={values.subject} onChange={handleChange} error={errors.subject} as="select">
                    <option value="">Choose what this is about</option>
                    {contactOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Field>
                  <Field label="Message *" name="message" value={values.message} onChange={handleChange} error={errors.message} as="textarea" placeholder="Tell us what you need. We are here to listen." />

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-brand-green px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-greenDark disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {status === 'loading' ? 'Sending...' : status === 'success' ? 'Message Sent!' : status === 'error' ? 'Error! Try Again' : 'Start a Conversation'}
                  </button>

                  {status === 'success' ? <p className="text-center text-sm font-medium text-brand-greenDark">Your message was sent successfully.</p> : null}
                  {status === 'error' ? <p className="text-center text-sm font-medium text-brand-greenDark">Something went wrong. Please try again.</p> : null}
                </form>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-10">
            <div className="overflow-hidden rounded-[1.75rem] border border-brand-brown/15 bg-brand-cream shadow-soft">
              <iframe
                title="Ghar Ka Khana location"
                src="https://www.google.com/maps?q=Baruipur,+West+Bengal,+India&z=13&output=embed"
                className="h-[360px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
