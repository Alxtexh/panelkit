import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { CheckIcon } from '@heroicons/react/24/outline';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'rooms' });
  return {
    title: `${t('title')} | Can Serena`,
    description: t('description'),
  };
}

const roomData = [
  {
    key: 'garden',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=600&q=80',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&q=80',
    ],
    price: '€350',
    amenityKeys: ['gardenView', 'rainfallShower', 'kingBed', 'terracottaFloors'],
  },
  {
    key: 'terrace',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=600&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80',
    ],
    price: '€550',
    amenityKeys: ['privateTerrace', 'freestandingBathtub', 'mountainViews', 'sittingArea'],
  },
  {
    key: 'master',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&q=80',
    ],
    price: '€850',
    amenityKeys: ['privatePool', 'butlerService', 'outdoorDining', 'separateLivingRoom'],
  },
];

export default async function RoomsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('rooms');

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px]">
        <Image
          src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1920&q=80"
          alt={t('title')}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <span className="inline-block text-sm tracking-[0.3em] uppercase text-white/70 mb-4">
              {t('subtitle')}
            </span>
            <h1 className="text-display text-white mb-4">{t('title')}</h1>
            <p className="text-xl text-white/80 max-w-2xl">{t('subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="section-padding bg-white">
        <div className="container-narrow mx-auto text-center">
          <p className="text-2xl md:text-3xl font-serif font-light leading-relaxed text-stone-700">
            {t('description')}
          </p>
        </div>
      </section>

      {/* Room Types */}
      <section className="bg-sand-50">
        {roomData.map((room, index) => (
          <div
            key={room.key}
            className={`section-padding ${index % 2 === 1 ? 'bg-white' : ''}`}
          >
            <div className="container-wide mx-auto">
              <div className={`grid lg:grid-cols-2 gap-12 items-center`}>
                {/* Image */}
                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={room.image}
                      alt={t(`types.${room.key}.title`)}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {room.gallery.map((img, i) => (
                      <div key={i} className="relative aspect-[3/2] overflow-hidden">
                        <Image
                          src={img}
                          alt=""
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <span className="inline-block text-sm tracking-[0.3em] uppercase text-stone-500 mb-4">
                    {t(`types.${room.key}.size`)}
                  </span>
                  <h2 className="text-headline mb-6">{t(`types.${room.key}.title`)}</h2>
                  <p className="text-body-large mb-8">
                    {t(`types.${room.key}.description`)}
                  </p>

                  <ul className="grid grid-cols-2 gap-3 mb-8">
                    {room.amenityKeys.map((amenityKey) => (
                      <li key={amenityKey} className="flex items-center gap-2 text-stone-600">
                        <CheckIcon className="w-5 h-5 text-olive-500" />
                        {t(`amenityList.${amenityKey}`)}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-6 border-t border-stone-200">
                    <div>
                      <span className="text-sm text-stone-500">{t('from')}</span>
                      <p className="text-2xl font-serif">{room.price}<span className="text-base text-stone-500">{t('perNight')}</span></p>
                    </div>
                    <button className="btn-primary">{t('bookNow')}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Amenities Note */}
      <section className="section-padding bg-stone-900 text-white">
        <div className="container-narrow mx-auto text-center">
          <h2 className="text-headline text-white mb-6">{t('inEveryRoom')}</h2>
          <p className="text-xl text-white/70 leading-relaxed">
            {t('amenities')}
          </p>
        </div>
      </section>
    </>
  );
}
