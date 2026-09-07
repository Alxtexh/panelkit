import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface FaqItem {
  question: string
  answer: string
}

export function FaqSection() {
  const faqItems: FaqItem[] = [
    {
      question: "How long should I meditate each day?",
      answer:
        "We recommend starting with just 5 minutes daily and gradually increasing. Consistency is more important than duration. Serenity offers meditations ranging from 1 minute to 60 minutes to fit your schedule.",
    },
    {
      question: "I've never meditated before. Is this app for beginners?",
      answer:
        "Serenity is designed for all experience levels. Our 'Meditation Basics' course is perfect for beginners, with step-by-step guidance to build your practice.",
    },
    {
      question: "Can meditation help with my anxiety?",
      answer:
        "Many studies show meditation can help reduce anxiety symptoms. Serenity offers specific programs for anxiety management with techniques backed by research.",
    },
    {
      question: "Will I be charged after the free trial?",
      answer:
        "No, we'll send you a reminder before your trial ends. You can cancel anytime in your App Store settings, and you won't be charged if you cancel before the trial period ends.",
    },
    {
      question: "Can I download meditations for offline use?",
      answer:
        "Yes, Premium and Family plan subscribers can download meditations, sleep stories, and music for offline listening—perfect for travel or areas with limited connectivity.",
    },
  ]

  return (
    <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <Badge variant="outline" className="px-3 py-1 rounded-full">
              FAQ
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">Common Questions</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Find answers to frequently asked questions about Serenity.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl py-12">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
