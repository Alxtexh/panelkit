'use client'

import Badge from "@/components/badge"
import Card from "@/components/card"
import Carousel from "@/components/carousel"
import SlideEffect from "@/components/slide-effect"
import Image from "next/image"

const settings = {
  badge: {
    number: 1,
    text: 'get started in seconds',
  },
  title: 'Set Up in Minutes',
  description: 'Simply add the script to your site, choose from a variety of plugins, or go for the API backend integration. Pirsch is the plug-and-play Google Analytics alternative.',
  card_1: {
    title: 'Effortless Setup',
    content: 'Pirsch offers plugins, libraries, and tutorials for the most popular CMSs, website builders, and programming languages to get you up and running in no time.',
    carousel_images: [
      'https://cdn.worldvectorlogo.com/logos/react-2.svg',
      'https://cdn.worldvectorlogo.com/logos/vue-9.svg',
      'https://cdn.worldvectorlogo.com/logos/angular-icon-1.svg',
      'https://cdn.worldvectorlogo.com/logos/nestjs.svg',
      'https://cdn.worldvectorlogo.com/logos/laravel-2.svg',
      'https://cdn.worldvectorlogo.com/logos/svelte-1.svg',
      'https://cdn.worldvectorlogo.com/logos/golang-1.svg',
      'https://cdn.worldvectorlogo.com/logos/rust.svg',
    ]
  },
  card_2: {
    title: 'Seamless Switch',
    content: 'Migrating from other web analytics solutions? Import your data from Plausible, Fathom, or Google Analytics in just a few clicks and easily continue where you left off.'
  },
  card_3: {
    title: 'No Cookie Banner',
    content: 'Say goodbye to consent banners: Pirsch works without cookies and never stores your visitors personal identifiable information.'
  },
  card_4: {
    title: 'Privacy-Friendly by Design',
    content: 'Built from the ground up with privacy in mind and with an open-source core, Pirsch offers uncompromising GDPR, CCPA, PECR, and Schrems II compliant data protection. All data is hosted on a secure server cluster in Germany.',
    image: 'https://framerusercontent.com/images/6jTglLZFhLYMIuOe7EC0QFeykU.png?scale-down-to=512',
  },
}

export default function Features1() {
  return (
    <div id='features' className="space-y-6 sm:space-y-7 md:space-y-8 lg:space-y-10 mx-auto text-center">
      {/* Badge */}
      <SlideEffect>
        <Badge number={settings.badge.number} text={settings.badge.text} />
      </SlideEffect>

      {/* Title */}
      <SlideEffect>
        <h2 className="text-2xl md:text-4xl lg:text-header capitalize font-medium leading-none text-transparent bg-clip-text bg-gradient-to-b from-black to-black/60">{settings.title}</h2>
      </SlideEffect>

      {/* Description */}
      <SlideEffect className="px-2 sm:px-10 md:px-0 w-full md:max-w-3/4 mx-auto text-sm lg:text-base">{settings.description}</SlideEffect>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* card 1 */}
        <SlideEffect direction="right" className="col-span-1 lg:col-span-3 h-full" isSpring={false}>
          <Card>
            <h3 className="text-xl md:text-title text-black font-medium">{settings.card_1.title}</h3>
            <p className="mb-4">{settings.card_1.content}</p>
            <Carousel images={settings.card_1.carousel_images} />
          </Card>
        </SlideEffect>

        {/* card 2 */}
        <SlideEffect direction="left" duration={1.3} className="col-span-1 lg:col-span-2 h-full" isSpring={false}>
          <Card>
            <h3 className="text-xl md:text-title text-black font-medium">{settings.card_2.title}</h3>
            <p>{settings.card_2.content}</p>
          </Card>
        </SlideEffect>

        {/* card 3 */}
        <SlideEffect direction="right" duration={1} className="col-span-1 lg:col-span-2 h-full" isSpring={false}>
          <Card>
            <h3 className="text-xl md:text-title text-black font-medium">{settings.card_3.title}</h3>
            <p>{settings.card_3.content}</p>
          </Card>
        </SlideEffect>

        {/* card 4 */}
        <SlideEffect direction="left" className="col-span-1 lg:col-span-3 h-full" isSpring={false}>
          <Card className="flex flex-col lg:flex-row justify-center items-center">
            <div className="space-y-3 md:space-y-5">
              <h3 className="text-xl md:text-title text-black font-medium">{settings.card_4.title}</h3>
              <p>{settings.card_4.content}</p>
            </div>

            <Image className="w-32 my-auto mx-auto" src={settings.card_4.image} alt={settings.card_4.title} width={512} height={512} />
          </Card>
        </SlideEffect>
      </div>
    </div>
  )
}