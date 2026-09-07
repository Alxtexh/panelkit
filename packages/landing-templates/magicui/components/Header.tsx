import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Icons.logo className="size-8" />
          <span className="text-xl font-medium">Serenity</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Testimonials
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden md:flex rounded-full"
          >
            <Link href="#contact">Contact</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="hidden md:flex rounded-full gap-2"
          >
            <Link href="#download">
              <Icons.apple className="size-4" />
              Download on App Store
            </Link>
          </Button>
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="sr-only">
                <DrawerTitle>Menu</DrawerTitle>
                <DrawerDescription>
                  Navigate through the application.
                </DrawerDescription>
              </DrawerHeader>
              <nav className="flex flex-col items-start gap-4 p-4">
                <Link
                  href="#features"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#testimonials"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Testimonials
                </Link>
                <Link
                  href="#pricing"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="#faq"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
                <Link
                  href="#contact"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </nav>
              <DrawerFooter>
                <Button asChild size="sm" className="w-full">
                  <Link href="#download">
                    <Icons.apple className="mr-2 h-4 w-4" />
                    Download on App Store
                  </Link>
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}
