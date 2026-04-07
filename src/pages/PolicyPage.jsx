import { Container } from '../components/Container';
import { PageHero } from '../components/PageHero';
import { PolicySection } from '../components/PolicySection';

export function PolicyPage({ policy }) {
  return (
    <main>
      <PageHero breadcrumb={`Home / ${policy.title}`} title={policy.title} description={policy.description} />
      <section className="section-pad">
        <Container>
          <div className="grid gap-5">
            {policy.sections.map((section, index) => (
              <PolicySection key={section.heading} heading={section.heading} items={section.items} delay={index * 0.04} />
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
