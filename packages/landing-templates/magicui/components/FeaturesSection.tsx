import Image from "next/image";
import { Moon, Shield, Clock, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <Badge variant="outline" className="px-3 py-1 rounded-full">
              Features
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              Mindfulness Made Simple
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Serenity offers powerful tools to help you meditate, sleep better,
              and live mindfully.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <ul className="grid gap-6">
              <li className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Moon className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-medium">Sleep Stories</h3>
                  <p className="text-muted-foreground">
                    Fall asleep faster with calming stories narrated by soothing
                    voices.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-medium">Stress Relief</h3>
                  <p className="text-muted-foreground">
                    Guided breathing exercises and meditations to reduce anxiety
                    and stress.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-medium">Daily Mindfulness</h3>
                  <p className="text-muted-foreground">
                    Short, effective meditations that fit into your busy
                    schedule.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-medium">Mood Tracking</h3>
                  <p className="text-muted-foreground">
                    Track your emotional wellbeing and see your progress over
                    time.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="flex justify-center">
            <Tabs defaultValue="tab1" className="w-full max-w-md">
              <TabsList className="grid w-full grid-cols-3 rounded-full h-12 p-1">
                <TabsTrigger value="tab1" className="rounded-full">
                  Meditate
                </TabsTrigger>
                <TabsTrigger value="tab2" className="rounded-full">
                  Sleep
                </TabsTrigger>
                <TabsTrigger value="tab3" className="rounded-full">
                  Focus
                </TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="mt-6">
                <Image
                  src="/meditation-screen.png"
                  alt="Meditation Screenshot"
                  width={300}
                  height={600}
                  className="rounded-[2.5rem] shadow-soft border border-white/20 mx-auto"
                />
              </TabsContent>
              <TabsContent value="tab2" className="mt-6">
                <Image
                  src="/meditation-screen.png"
                  alt="Sleep Screenshot"
                  width={300}
                  height={600}
                  className="rounded-[2.5rem] shadow-soft border border-white/20 mx-auto"
                />
              </TabsContent>
              <TabsContent value="tab3" className="mt-6">
                <Image
                  src="/meditation-screen.png"
                  alt="Focus Screenshot"
                  width={300}
                  height={600}
                  className="rounded-[2.5rem] shadow-soft border border-white/20 mx-auto"
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
}
