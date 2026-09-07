'use client'

import Badge from "@/components/badge"
import Card from "@/components/card"
import SlideEffect from "@/components/slide-effect"
import Spinner from "@/components/spinner"
import TextRevealEffect from "@/components/text-reveal-effect"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const settings = {
  badge: {
    number: 4,
    text: 'SMART TEAMWORK',
  },
  title: 'Empower People With Data',
  description: 'Reduce friction and enhance productivity by getting the right information to the right people with minimal effort, enabling them to thrive and excel.',
  card_1: {
    title: 'Easily Manage Teams and Sites',
    content: "Work happens in teams. That's why Pirsch enables collaboration right from the start: Simply invite team members or clients via email, assign them roles, and give them access to the dashboards they need to excel. All people, sites and custom themes in one place.",
    CTA: {
      content: 'Start 30-day Free Trial',
      href: '/login'
    },
    labels: [
      'my-site.com',
      'example.com',
      'my-saas.ai',
      'my-blog.com',
      'potfolio.me',
      'new-site.com',
      'client-site.io',
    ],
    avatars: [
      'https://avatar.iran.liara.run/public/38',
      'https://avatar.iran.liara.run/public/40',
      'https://avatar.iran.liara.run/public/22',
      'https://avatar.iran.liara.run/public/6',
      'https://avatar.iran.liara.run/public/12',
      'https://avatar.iran.liara.run/public/37',
      'https://avatar.iran.liara.run/public/35'
    ]
  },
  card_2: {
    title: 'Receive Automatic Email Reports',
    content: 'Keep colleagues, customers, or partners in the loop with automatic email reports. Regularly receive a concise summary of the latest activities with just one click.',
  },
  card_3: {
    title: 'Share Dashboards With Anybody',
    content: 'Working with external partners? Create unique access links to securely grant access to dashboards or make them public on your personal subdomain.',
  },
}

export default function Features4() {
  return (
    <div className="space-y-6 sm:space-y-7 md:space-y-8 lg:space-y-10 mx-auto text-center">
      {/* Badge */}
      <SlideEffect>
        <Badge number={settings.badge.number} text={settings.badge.text} />
      </SlideEffect>

      {/* Title */}
      <TextRevealEffect className="text-2xl md:text-4xl lg:text-header text-transparent bg-clip-text bg-gradient-to-b from-black to-black/60 font-medium leading-normal">{settings.title}</TextRevealEffect>

      {/* Description */}
      <SlideEffect className="px-2 sm:px-10 md:px-0 w-full md:max-w-3/4 mx-auto text-sm lg:text-base">{settings.description}</SlideEffect>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* card 1 */}
        <SlideEffect direction="top" className="grid-cols-1 lg:col-span-2 h-full" isSpring={false}>
          <Card className="flex flex-col lg:flex-row justify-center items-center">
            <div className="space-y-3 md:space-y-5 flex-1">
              <h3 className="text-xl md:text-title text-black font-medium">{settings.card_1.title}</h3>
              <p className="mb-8 lg:mb-16">{settings.card_1.content}</p>
              <Link href={settings.card_1.CTA.href}>
                <Button className="bg-accent">{settings.card_1.CTA.content}</Button>
              </Link>
            </div>

            <Spinner labels={settings.card_1.labels} avatars={settings.card_1.avatars} />
          </Card>
        </SlideEffect>

        {/* card 2 */}
        <SlideEffect direction="right" className="col-span-1 h-full" isSpring={false}>
          <Card>
            <h3 className="text-xl md:text-title text-black font-medium">{settings.card_2.title}</h3>
            <p>{settings.card_2.content}</p>
          </Card>
        </SlideEffect>

        {/* card 3 */}
        <SlideEffect direction="left" delay={0.2} className="col-span-1 h-full" isSpring={false}>
          <Card>
            <h3 className="text-xl md:text-title text-black font-medium">{settings.card_3.title}</h3>
            <p>{settings.card_3.content}</p>
          </Card>
        </SlideEffect>
      </div>
    </div>
  )
}
