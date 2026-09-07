'use client'

import Badge from "@/components/badge"
import Card from "@/components/card"
import SlideEffect from "@/components/slide-effect"
import Image from "next/image"

const settings = {
  badge: {
    number: 3,
    text: 'ADVANCED ANALYTICS',
  },
  title: 'Dive Into the Details',
  description: 'See beyond clicks with the power of events, A/B testing, and tag-based segmentation, drill down into single sessions, or track your performance with flexible conversion goals.',
  card_1: {
    title: 'Analyze Funnels',
    content: 'Effectively visualize and fully understand user journeys in a matter of seconds.',
    image: 'https://framerusercontent.com/images/3FWbibttHBsnge8Td2JRVbNo.svg'
  },
  card_2: {
    title: 'Explore Sessions',
    content: 'Learn more about individual user journeys with in-depth session summaries.',
    image: 'https://framerusercontent.com/images/eaFbEnL3er77EwtTIiUEMgYTLnQ.svg'
  },
  card_3: {
    title: 'Segment Visitors',
    content: 'Leverage your data with tags for A/B testing or segmentation and channel attribution.',
    image: 'https://framerusercontent.com/images/82g4S0XdXlaUWPtoLMLmaJhP1yc.svg'
  },
}

export default function Features3() {
  return (
    <div className="space-y-6 sm:space-y-7 md:space-y-8 lg:space-y-10 mx-auto text-center">
      {/* Badge */}
      <SlideEffect>
        <Badge number={settings.badge.number} text={settings.badge.text} />
      </SlideEffect>

      {/* Title */}
      <SlideEffect>
        <h2 className="text-2xl md:text-4xl lg:text-header capitalize text-transparent bg-clip-text bg-gradient-to-b from-black to-black/60 font-medium leading-normal">{settings.title}</h2>
      </SlideEffect>

      {/* Description */}
      <SlideEffect className="px-2 sm:px-10 md:px-0 w-full md:max-w-3/4 mx-auto text-sm lg:text-base">{settings.description}</SlideEffect>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* card 1 */}
        <SlideEffect direction="top" className="col-span-1 h-full" isSpring={false}>
          <Card>
            <h3 className="text-xl md:text-title text-black font-medium">{settings.card_1.title}</h3>
            <p className="mb-4">{settings.card_1.content}</p>
            <Image src={settings.card_1.image} alt={settings.card_1.title} width={512} height={512} />
          </Card>
        </SlideEffect>

        {/* card 2 */}
        <SlideEffect direction="top" delay={0.2} className="col-span-1 h-full" isSpring={false}>
          <Card>
            <h3 className="text-xl md:text-title text-black font-medium">{settings.card_2.title}</h3>
            <p>{settings.card_2.content}</p>
            <Image src={settings.card_2.image} alt={settings.card_1.title} width={512} height={512} />
          </Card>
        </SlideEffect>

        {/* card 3 */}
        <SlideEffect direction="top" delay={0.3} className="col-span-1 h-full" isSpring={false}>
          <Card>
            <h3 className="text-xl md:text-title text-black font-medium">{settings.card_3.title}</h3>
            <p>{settings.card_3.content}</p>
            <Image src={settings.card_3.image} alt={settings.card_1.title} width={512} height={512} />
          </Card>
        </SlideEffect>
      </div>
    </div>
  )
}