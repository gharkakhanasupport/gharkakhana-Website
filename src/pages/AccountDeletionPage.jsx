import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiEnvelope, BiInfoCircle, BiCopy, BiCheck, BiShieldX } from 'react-icons/bi';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';

export function AccountDeletionPage() {
  const [copied, setCopied] = useState(false);
  const supportEmail = 'gharkakhanasupport@gmail.com';
  const subjectLine = 'Account Deletion Request – [Your Registered Phone Number]';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(supportEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <main className="bg-[#f2d4a8] min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 sm:px-12 text-center">
        <Container>
          <Reveal>
            <p className="text-brand-brown/60 text-sm font-medium tracking-widest uppercase mb-4">
              Home / Legal / Account Deletion
            </p>
            <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-brand-brown mb-6">
              Account Deletion Request
            </h1>
            <p className="text-brand-brown/80 font-inter text-lg sm:text-xl w-full">
              We're sorry to see you go. If you wish to delete your account and all associated data, follow the steps below.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Content Section */}
      <section className="pb-24 px-6 sm:px-12">
        <Container>
          <div className="w-full">
            <Reveal delay={0.1}>
              <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_12px_40px_rgba(47,42,61,0.06)] border border-brand-brown/5">
                <div className="space-y-10">
                  {/* Instructions */}
                  <div>
                    <h2 className="font-playfair text-2xl font-bold text-brand-brown mb-6 flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green/10 text-brand-green text-sm">1</span>
                      Follow these steps
                    </h2>
                    
                    <div className="space-y-6 ml-11">
                      <div className="relative group">
                        <p className="text-brand-brown/80 font-inter leading-relaxed">
                          Send an email to our support team:
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <span className="text-xl font-bold text-brand-brown tracking-tight">
                            {supportEmail}
                          </span>
                          <button
                            onClick={copyToClipboard}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-cream hover:bg-brand-beige transition-colors text-brand-greenDark text-sm font-semibold border border-brand-brown/5"
                          >
                            {copied ? <BiCheck className="text-lg" /> : <BiCopy className="text-lg" />}
                            {copied ? 'Copied!' : 'Copy Email'}
                          </button>
                        </div>
                      </div>

                      <div className="pt-2">
                        <p className="text-brand-brown/80 font-inter leading-relaxed">
                          Use the following subject line:
                        </p>
                        <div className="mt-3 inline-block">
                          <code className="bg-brand-cream/50 border border-brand-brown/10 px-4 py-2.5 rounded-xl text-brand-brown font-mono text-sm md:text-base block md:inline-block">
                            {subjectLine}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Process Info */}
                  <div className="pt-4 border-t border-brand-brown/5">
                    <h2 className="font-playfair text-2xl font-bold text-brand-brown mb-6 flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green/10 text-brand-green text-sm">2</span>
                      What happens next?
                    </h2>
                    <p className="ml-11 text-brand-brown/80 font-inter leading-relaxed">
                      Once your request is received, our team will verify your identity and process the deletion of your account. 
                      Your profile, order history, saved addresses, and all associated data will be permanently deleted 
                      within <span className="font-bold text-brand-brown">7 business days</span>.
                    </p>
                  </div>

                  {/* Warning Note */}
                  <div className="relative overflow-hidden rounded-3xl bg-error/5 border border-error/10 p-6 md:p-8">
                    <div className="flex gap-4">
                      <div className="mt-1">
                        <div className="group relative">
                          <BiInfoCircle className="text-2xl text-error" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-brand-brown text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center">
                            This includes all personal records and transactional history.
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-error mb-2 uppercase tracking-wider text-xs">Important Notice</h3>
                        <p className="text-brand-brown/90 font-inter text-sm md:text-base leading-relaxed italic">
                          This action is permanent and irreversible. Once your account is deleted, it cannot be restored.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Help Link */}
            <Reveal delay={0.2}>
              <div className="mt-12 text-center">
                <p className="text-brand-brown/60 font-inter">
                  Have questions about your data? 
                  <a href="mailto:gharkakhanasupport@gmail.com" className="ml-2 text-brand-greenDark font-bold hover:underline">
                    Talk to our Privacy Team
                  </a>
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </main>
  );
}
