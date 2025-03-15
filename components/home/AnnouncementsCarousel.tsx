"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useRef } from "react";
import Add from "./Add";
import { AnnouncementData } from "@/index/prisma/types";
import DeleteButton from "../Utils/DeleteButton";

const AnnouncementsCarousel = ({
  data,
  userId,
}: {
  data: AnnouncementData[];
  userId: string;
}) => {
  const autoplayPlugin = useRef(
    Autoplay({
      delay: 6000, // Adjust delay if needed
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  return (
    <Carousel
      className="w-full mb-12"
      opts={{ loop: true }}
      plugins={[autoplayPlugin.current]} // Use the ref instance
    >
      <div className="flex mt-8 text-primary mb-5 justify-center items-center gap-5">
        <Add />
      </div>
      <CarouselContent>
        {data.map((announcement) => (
          <CarouselItem key={announcement.id}>
            <div className="rounded-md w-9/12 border-2 mx-auto">
              <div className="w-full pr-4 flex justify-between bg-primary  dark:bg-muted">
                <h2 className="text-accent-foreground bg-opacity-40 rounded-md text-2xl font-bold px-4 py-2 text-white text-center">
                  {announcement.title}
                </h2>
                {announcement.authorId === userId && (
                  <DeleteButton announcement={announcement} className="" />
                )}
              </div>
              <Image
                src={
                  announcement.media[0]?.url || "/images/avatar-placeHolder.png"
                }
                alt="announcement"
                height={200}
                width={200}
                className="w-full h-[300px] md:h-[450px] object-fill  lg:object-contain"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-0 md:left-5 top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow-lg" />
      <CarouselNext className="absolute right-0 md:right-5 top-1/2 transform -translate-y-1/2p-2 rounded-full shadow-lg" />
    </Carousel>
  );
};

export default AnnouncementsCarousel;
