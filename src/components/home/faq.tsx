import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'Who is eligible to apply for assistance?',
    answer:
      'Bags of Groceries Tasmania supports Tasmanian families experiencing financial hardship. This includes families facing unemployment, unexpected medical expenses, domestic difficulties, or other circumstances that have impacted their ability to afford groceries. Applications are assessed on a case-by-case basis.',
  },
  {
    question: 'How much does it cost to sponsor a bag?',
    answer:
      'You can sponsor one grocery bag for $25 or two bags for $50. 100% of your donation goes directly toward providing groceries for families in need. Payments are processed securely through Stripe.',
  },
  {
    question: 'What is included in a grocery bag?',
    answer:
      'Each grocery bag is prepared by our supermarket partner and contains a selection of essential items — including fresh produce, pantry staples, protein, and household necessities. The contents are designed to provide meaningful support to a family.',
  },
  {
    question: 'How long does it take for my application to be reviewed?',
    answer:
      'Applications are typically reviewed within 3–5 business days. You will receive an email confirmation when your application is submitted, and our team will contact you directly once a decision has been made.',
  },
  {
    question: 'Is my donation tax deductible?',
    answer:
      'Please contact us directly for information regarding tax deductibility, as this depends on current registration status. We recommend consulting your tax adviser for personalised advice.',
  },
]

export function FAQ() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about sponsoring bags and applying for
            assistance.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-0">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-base font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
