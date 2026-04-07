import { motion } from 'framer-motion';
import { BiUser, BiData, BiShieldQuarter, BiShareAlt, BiSliderAlt, BiEnvelope } from 'react-icons/bi';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';

export function PrivacyPolicyPage() {
  const sections = [
    {
      id: 1,
      title: 'Information We Collect',
      icon: BiUser,
      items: [
        'Personal details (name, email, phone, address)',
        'Payment handled securely (e.g., Razorpay)',
        'Device and usage data (with permission)'
      ]
    },
    {
      id: 2,
      title: 'How We Use Your Data',
      icon: BiData,
      items: [
        'To process orders',
        'To improve experience',
        'To communicate updates'
      ]
    },
    {
      id: 3,
      title: 'Data Protection',
      icon: BiShieldQuarter,
      items: [
        'Secure systems',
        'Trusted payment partners',
        'No unnecessary data storage'
      ]
    },
    {
      id: 4,
      title: 'Sharing Policy',
      icon: BiShareAlt,
      items: [
        'We do NOT sell your data',
        'Only shared when necessary (delivery, payment)'
      ]
    },
    {
      id: 5,
      title: 'Your Control',
      icon: BiSliderAlt,
      items: [
        'You can update or delete your data',
        'You can opt out of communications'
      ]
    },
    {
      id: 6,
      title: 'Contact for Privacy',
      icon: BiEnvelope,
      items: [
        'Reach out to us at noreplay.gkk26@gmail.com for any privacy concerns.'
      ]
    }
  ];

  return (
    <main className="bg-[#f2d4a8]">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 sm:px-12 text-center bg-[#f2d4a8]">
        <Container>
          <Reveal>
            <p className="text-brand-brown/60 text-sm font-medium tracking-widest uppercase mb-4">
              Home / Privacy Policy
            </p>
            <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-brand-brown mb-6">
              Your privacy matters to us
            </h1>
            <p className="text-brand-brown/80 font-inter text-lg sm:text-xl max-w-2xl mx-auto mb-6">
              We keep your information safe, simple, and transparent. Here’s exactly how we handle your data.
            </p>
            <div className="inline-flex flex-col sm:flex-row gap-4 items-center justify-center mt-4">
              <span className="inline-flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full text-brand-brown/80 text-sm shadow-sm">
                <BiShieldQuarter className="text-brand-green text-lg" /> We do not sell your data
              </span>
              <span className="inline-flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full text-brand-brown/80 text-sm shadow-sm">
                <span className="text-brand-green font-bold">♥</span> We respect your privacy like we respect your food
              </span>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Content Section */}
      <section className="py-20 px-6 sm:px-12">
        <Container>
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Reveal key={section.id} delay={index * 0.1}>
                  <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full border border-brand-brown/5 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
                    <div className="w-12 h-12 bg-brand-cream rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="text-2xl text-brand-green" />
                    </div>
                    <h2 className="font-playfair text-2xl font-bold text-brand-brown mb-4">
                      {section.title}
                    </h2>
                    <ul className="space-y-3">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 font-inter text-brand-brown/70 leading-relaxed text-[15px]">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-green/60 shrink-0" />
                          <span>
                            {item.includes('NOT sell') || item.includes('No unnecessary') ? (
                              <strong className="text-brand-green font-semibold">{item}</strong>
                            ) : (
                              item
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>
      
      {/* Bottom Reassurance */}
      <section className="pb-24 px-6 sm:px-12 text-center">
        <Container>
          <Reveal delay={0.3}>
            <p className="text-brand-brown/60 font-inter italic">
              No spam. No hidden tracking.
            </p>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
