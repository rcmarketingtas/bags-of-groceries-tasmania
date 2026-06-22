import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'Who can apply for assistance?',
    answer:
      'Anyone in Tasmania who is doing it tough. We\u2019re not here to judge. If your family is struggling to put food on the table right now, just put in an application and we\u2019ll have a look. Things like job loss, unexpected bills, or a rough patch in life are all totally valid.',
  },
  {
    question: 'How much does it cost?',
    answer:
      'It\'s $50 per bag. You can buy as many as you like, each one goes to a different family. Your $50 covers the cost of the groceries and running the program.',
  },
  {
    question: 'What\u2019s in a grocery bag?',
    answer:
      'Each bag includes fresh protein (chicken, seasonal cuts, or canned alternatives), pantry staples like rice, pasta and bread, fresh fruit and vegetables, and basic meal essentials like milk, sauce and legumes. Enough to support a small household for several days.',
  },
  {
    question: 'How long will my application take?',
    answer:
      'We try to get back to everyone within a few days. You\u2019ll get a confirmation email straight away when you apply, and we\u2019ll reach out once we\u2019ve had a chance to review it.',
  },
  {
    question: 'Can I apply if I\u2019m not in Launceston?',
    answer:
      'Yes, we\u2019re based in Launceston but we want to help families right across Tassie. Apply no matter where you are and we\u2019ll do our best to help.',
  },
]

export function FAQ() {
  return (
    <section className="bg-[#FDFAF7] py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Common Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            If you can&apos;t find what you&apos;re after, just flick us a message.
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
