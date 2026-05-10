import React, { useState } from 'react';

const defaultFaqs = [
  {
    question: "What is the difference between a Work Permit and Permanent Residency?",
    answer: "A <strong>Work Permit</strong> is a temporary authorization tied to a specific employer or time frame (e.g., Schengen Work Permit). <strong>Permanent Residency (PR)</strong>, like Canada Express Entry or Australia Subclass 189, grants you the right to live, work, and study anywhere in the country indefinitely, with access to healthcare and social benefits."
  },
  {
    question: "How can I improve my Canada CRS score if it is too low?",
    answer: "The most effective ways to boost your CRS score are: 1) Retaking IELTS to achieve CLB 9+ (8777), 2) Learning French (TEF exam), 3) Obtaining a Provincial Nomination (PNP) which adds 600 points, or 4) Gaining more skilled work experience. ImmiHire provides dedicated strategies for each."
  },
  {
    question: "Is German language proficiency mandatory for the Opportunity Card?",
    answer: "While high-level German is not strictly required for the visa application itself (English A2 or German A1 is often sufficient for points), knowing German significantly improves your job prospects. For the <strong>Chancenkarte</strong>, you need 6 points total, and language skills are a key contributor to this score."
  },
  {
    question: "What occupations are currently in demand for Australia?",
    answer: "Australia's 2025 migration strategy prioritizes <strong>Healthcare</strong> (Nurses, GPs), <strong>Construction/Trades</strong> (Electricians, Carpenters), <strong>Teaching</strong>, and <strong>IT/Cybersecurity</strong>. If your occupation is on the Medium and Long-term Strategic Skills List (MLTSSL), you have a higher chance of invitation."
  },
  {
    question: "How long is a US B1/B2 Visit Visa valid for?",
    answer: "For many nationalities, the US B1/B2 visa is issued for <strong>10 years</strong> as a multiple-entry visa. However, the maximum duration of stay per visit is determined by the CBP officer at the port of entry, typically up to 6 months. ImmiHire assists with DS-160 filing and interview preparation."
  },
  {
    question: "Which European countries offer the easiest work permits?",
    answer: "Currently, <strong>Poland</strong>, <strong>Lithuania</strong>, and <strong>Czech Republic</strong> have more accessible work permit routes for non-EU citizens due to labor shortages in logistics, manufacturing, and construction. Processing times can be as fast as 3-4 months."
  },
  {
    question: "Do you provide job placement services upon arrival?",
    answer: "We are an immigration legal advisory, not a recruitment agency. However, we provide extensive <strong>career readiness support</strong>. This includes revamping your resume to local standards (e.g., Europass format), optimizing your LinkedIn profile, and providing a database of verified recruiters in your destination country."
  },
  {
    question: "Can I include my family in my application?",
    answer: "Yes. For Permanent Residency programs (Canada, Australia), you can include your spouse and dependent children (usually under 22). Your spouse's education and language skills can even add valuable points to your total score."
  },
  {
    question: "Do my documents need to be attested or apostilled?",
    answer: "Almost always. For Canada, you need an <strong>ECA (Educational Credential Assessment)</strong>. For UAE or Europe, degree attestation/apostille is mandatory for visa stamping. ImmiHire handles the entire document clearing and attestation process as part of our full-service package."
  },
  {
    question: "What happens if my visa application gets rejected?",
    answer: "We operate on a strict <strong>Pre-Assessment Protocol</strong> to minimize this risk. We only take cases with a high probability of success. However, in the unlikely event of a rejection, we offer a re-filing service free of professional fees or a partial refund depending on the specific terms of your service agreement."
  }
];

const FaqAccordion = ({
  heading = "Common Questions",
  faqs = defaultFaqs
}) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const renderFaqs = faqs && faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="font-heading font-bold text-3xl text-center text-darkBlue mb-12">{heading}</h2>

        <div className="space-y-4">
          {renderFaqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                className="w-full text-left p-6 font-bold text-darkBlue flex justify-between items-center focus:outline-none hover:bg-gray-50 transition-colors"
                onClick={() => toggleFaq(index)}
              >
                {faq.question}
                <i className={`fa-solid ${openIndex === index ? 'fa-minus' : 'fa-plus'} text-primary`}></i>
              </button>
              <div
                className={`p-6 pt-0 text-gray-600 leading-relaxed bg-gray-50 text-sm ${openIndex === index ? 'block' : 'hidden'}`}
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              >
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqAccordion;
