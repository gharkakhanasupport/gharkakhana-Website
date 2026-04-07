import { Container } from './Container';
import { Reveal } from './Reveal';

export function PageHero({ title, description, breadcrumb }) {
  return (
    <section className="warm-gradient py-16 md:py-20">
      <Container>
        <Reveal className="surface-panel mx-auto max-w-5xl border border-brand-brown/10 p-8 text-center md:p-12">
          {breadcrumb ? <div className="mb-5 text-sm font-medium text-brand-brown/70">{breadcrumb}</div> : null}
          <h1 className="text-4xl font-bold tracking-tight text-brand-brown sm:text-5xl md:text-6xl">{title}</h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-brand-brown/80 sm:text-lg">{description}</p>
        </Reveal>
      </Container>
    </section>
  );
}
