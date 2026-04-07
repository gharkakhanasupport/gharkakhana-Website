import { Container } from '../components/Container';
import { Button } from '../components/Button';
import { Reveal } from '../components/Reveal';

const dayChapters = [
  {
    title: 'It usually starts the same way',
    text: 'You are tired, hungry, and you want something that feels simple, warm, and familiar. Not a big decision. Just food that makes the day easier.',
    label: 'The craving',
    points: ['Tired after a long day', 'Want something comforting', 'Need a simple choice'],
  },
  {
    title: 'No noise. Just food that makes sense',
    text: 'The platform stays clean and calm so ordering does not feel like work. You see what you need, understand it quickly, and move on with confidence.',
    label: 'Discovery',
    points: ['Clean choices', 'Clear information', 'Easy to decide'],
  },
  {
    title: 'Not a restaurant. A real kitchen',
    text: 'Behind each meal is a person cooking from home. Real recipes, real routines, real care. The kind of food that feels prepared for someone, not produced for a crowd.',
    label: 'Human touch',
    points: ['Home chefs', 'Trusted kitchens', 'Made with care'],
  },
  {
    title: 'You don’t guess. You know',
    text: 'Tracking stays clear from the moment the order is placed. You know what is happening, where your food is, and when to expect it.',
    label: 'Trust',
    points: ['Live updates', 'Transparent status', 'Less uncertainty'],
  },
  {
    title: 'And it feels… right',
    text: 'When the food arrives, it should feel like the day has softened a little. Warm, familiar, and exactly what you hoped for.',
    label: 'Delivery moment',
    points: ['Warm on arrival', 'Comfort first', 'Feels familiar'],
  },
];

const feelings = [
  {
    title: 'Feels like home',
    detail: 'The taste is familiar, the portions feel thoughtful, and the meal lands like comfort instead of just convenience.',
    tag: 'Comfort',
  },
  {
    title: 'Simple and safe',
    detail: 'From ordering to delivery updates, everything feels clear enough to trust without second-guessing.',
    tag: 'Trust',
  },
  {
    title: 'Not just delivery, something more personal',
    detail: 'You can sense that a real person cooked this meal with care, not a system pushing another order.',
    tag: 'Human touch',
  },
];

function ChapterBadge({ children }) {
  return <span className="eyebrow bg-white/88">{children}</span>;
}

function StoryPanel({ title, text, label, points }) {
  return (
    <Reveal>
      <section className="surface-panel rounded-[2.25rem] p-6 md:p-8 lg:p-10">
        <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <div>
            <ChapterBadge>{label}</ChapterBadge>
            <h2 className="mt-5 max-w-xl text-3xl font-bold tracking-tight text-brand-brown sm:text-4xl md:text-[3.25rem] md:leading-[1.02]" style={{ fontFamily: 'Playfair Display, serif' }}>
              {title}
            </h2>
          </div>

          <div className="space-y-5">
            <p className="max-w-2xl text-base leading-8 text-brand-brown/80 sm:text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
              {text}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {points.map((point) => (
                <div key={point} className="rounded-[1.35rem] border border-brand-brown/10 bg-white/80 px-4 py-3 text-sm font-semibold text-brand-brown shadow-[0_10px_22px_rgba(47,42,61,0.05)]">
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}

export function AboutPage() {
  return (
    <main className="overflow-hidden pb-10">
      <section className="relative overflow-hidden py-6 md:py-8">
        <div className="absolute inset-0 warm-gradient" />
        <Container className="relative z-10 py-6 md:py-10">
          <Reveal>
            <div className="surface-panel rounded-[2.5rem] p-6 md:p-8 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
                <div className="max-w-3xl">
                  <ChapterBadge>Chapter 1</ChapterBadge>
                  <h1 className="mt-5 text-4xl font-bold tracking-tight text-brand-brown sm:text-5xl md:text-[4.2rem] md:leading-[1.02]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    A day with Ghar Ka Khana
                  </h1>
                  <p className="mt-5 max-w-3xl text-base leading-8 text-brand-brown/80 sm:text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                    This is not a company description. It is a small story about hunger, comfort, and the moment a meal arrives and makes the day feel easier.
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-[1.6rem] border border-brand-brown/10 bg-white/82 p-5 shadow-[0_12px_28px_rgba(47,42,61,0.06)] md:p-6">
                    <div className="text-xs uppercase tracking-[0.18em] text-brand-brown/55">The feeling</div>
                    <p className="mt-3 text-sm leading-7 text-brand-brown/78 md:text-base">
                      Warm. Familiar. Easy to trust. The whole page is built around the quiet feeling of ordering food that already feels like a relief.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                    {[
                      { label: 'Mood', value: 'Comfort' },
                      { label: 'Tone', value: 'Maa Ka Pyaar' },
                      { label: 'Promise', value: 'Home-style food' },
                    ].map((item) => (
                      <div key={item.label} className="rounded-[1.35rem] border border-brand-brown/10 bg-white/80 p-4 shadow-[0_10px_22px_rgba(47,42,61,0.05)]">
                        <div className="text-xs uppercase tracking-[0.18em] text-brand-brown/55">{item.label}</div>
                        <div className="mt-2 text-base font-semibold text-brand-brown">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="section-pad">
        <Container>
          <div className="space-y-5">
            <StoryPanel {...dayChapters[0]} />
            <StoryPanel {...dayChapters[1]} />
            <StoryPanel {...dayChapters[2]} />
          </div>
        </Container>
      </section>

      <section className="section-pad border-y border-brand-brown/10 bg-brand-cream/55">
        <Container>
          <Reveal>
            <section className="surface-panel rounded-[2.25rem] p-6 md:p-8 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
                <div>
                  <ChapterBadge>Chapter 4</ChapterBadge>
                  <h2 className="mt-5 text-3xl font-bold tracking-tight text-brand-brown sm:text-4xl md:text-[3.25rem] md:leading-[1.03]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    You don’t guess. You know
                  </h2>
                  <p className="mt-5 text-base leading-8 text-brand-brown/80 sm:text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Tracking is calm and transparent. The order status is clear, the updates are easy to read, and nothing feels hidden.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    'Live order updates',
                    'Kitchen to doorstep clarity',
                    'Simple delivery status',
                    'Less waiting in doubt',
                  ].map((item) => (
                    <div key={item} className="rounded-[1.45rem] border border-brand-brown/10 bg-white/82 p-4 shadow-[0_10px_22px_rgba(47,42,61,0.05)]">
                      <div className="h-2.5 w-2.5 rounded-full bg-brand-green" />
                      <div className="mt-3 text-sm font-semibold text-brand-brown">{item}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </Reveal>
        </Container>
      </section>

      <section className="section-pad">
        <Container>
          <Reveal>
            <section className="surface-panel rounded-[2.25rem] p-6 md:p-8 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                <div>
                  <ChapterBadge>Chapter 5</ChapterBadge>
                  <h2 className="mt-5 text-3xl font-bold tracking-tight text-brand-brown sm:text-4xl md:text-[3.25rem] md:leading-[1.03]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    And it feels… right
                  </h2>
                  <p className="mt-5 max-w-2xl text-base leading-8 text-brand-brown/80 sm:text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                    The best part is not the delivery itself. It is the pause after it arrives, when the meal feels warm enough, familiar enough, and comforting enough to settle the day.
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-[1.6rem] border border-brand-brown/10 bg-brand-green/8 p-5 md:p-6">
                    <div className="text-xs uppercase tracking-[0.18em] text-brand-brown/55">Delivery moment</div>
                    <p className="mt-2 text-sm leading-7 text-brand-brown/78 md:text-base">
                      Food that arrives with warmth, care, and the kind of familiarity that makes you exhale a little.
                    </p>
                  </div>
                  <div className="rounded-[1.6rem] border border-brand-brown/10 bg-white/82 p-5 md:p-6">
                    <div className="text-xs uppercase tracking-[0.18em] text-brand-brown/55">What users feel</div>
                    <p className="mt-2 text-sm leading-7 text-brand-brown/78 md:text-base">
                      Relief, comfort, and the sense that the meal was made for this exact moment.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </Reveal>
        </Container>
      </section>

      <section className="section-pad border-y border-brand-brown/10 bg-brand-cream/55">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <ChapterBadge>Real feelings</ChapterBadge>
              <h2 className="mt-5 text-4xl font-bold tracking-tight text-brand-brown sm:text-5xl md:text-[3.25rem] md:leading-[1.03]" style={{ fontFamily: 'Playfair Display, serif' }}>
                The kind of reactions we want
              </h2>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {feelings.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05}>
                <div className="surface-panel h-full rounded-[1.8rem] p-6 transition duration-200 hover:-translate-y-1 hover:shadow-[0_20px_36px_rgba(47,42,61,0.12)] md:p-7">
                  <div className="inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-greenDark">
                    <span className="h-2 w-2 rounded-full bg-brand-green" />
                    {item.tag}
                  </div>
                  <div className="mt-4 text-4xl leading-none text-brand-green/70">“</div>
                  <p className="mt-3 text-2xl font-bold tracking-tight text-brand-brown">{item.title}</p>
                  <p className="mt-4 text-sm leading-7 text-brand-brown/78 md:text-base">{item.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-pad">
        <Container>
          <Reveal>
            <div className="surface-panel rounded-[2.35rem] p-8 md:p-10 lg:p-12">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="max-w-2xl">
                  <ChapterBadge>Final CTA</ChapterBadge>
                  <h2 className="mt-5 text-4xl font-bold tracking-tight text-brand-brown sm:text-5xl md:text-[3.55rem] md:leading-[1.02]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Come home, one meal at a time
                  </h2>
                  <p className="mt-5 text-base leading-8 text-brand-brown/80 sm:text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                    When you are ready for something warm, familiar, and made with care, the next meal is already waiting.
                  </p>
                </div>

                <Button as="link" to="/contact" className="min-w-44 px-8 py-3.5 text-base shadow-[0_14px_28px_rgba(103,165,57,0.24)] hover:scale-[1.02] hover:shadow-[0_18px_34px_rgba(103,165,57,0.3)]">
                  Order Now
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
