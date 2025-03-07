import { images } from "@/sampleData";
import Image from "next/image";

export default function ImagesGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((image) => (
        <div key={image.alt} className="flex justify-center items-center">
          <Image
            width={image.width}
            height={image.height}
            src={image.src}
            alt={image.alt}
          />
        </div>
      ))}
    </div>
  );
}
