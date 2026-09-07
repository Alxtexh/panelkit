import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function DownloadSection() {
  return (
    <section
      id="download"
      className="w-full py-12 md:py-24 lg:py-32 bg-linear-to-br from-primary to-purple-600 text-white"
    >
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                Begin Your Mindfulness Journey
              </h2>
              <p className="md:text-xl opacity-90">
                Download Serenity today and take the first step toward inner
                peace.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="gap-2 rounded-full"
              >
                <Link href="#app-store">
                  <Icons.apple className="size-4" />
                  App Store
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Image
              src="/meditation-app-devices.png"
              alt="Serenity App on Multiple Devices"
              width={500}
              height={400}
              className="rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
