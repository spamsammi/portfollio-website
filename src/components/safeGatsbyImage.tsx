import React from "react";
import { GatsbyImage, getImage, IGatsbyImageData, ImageDataLike } from "gatsby-plugin-image";

type SafeGatsbyImageProps = {
  imageData: ImageDataLike | null | undefined;
  alt: string;
  className?: string;
};

const SafeGatsbyImage: React.FC<SafeGatsbyImageProps> = ({
  imageData,
  alt,
  className = "",
}) => {
  const image = getImage(imageData as IGatsbyImageData);

  // Default fallback SVG
  const fallbackSvg = (
    <div className={className}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <rect width="40" height="40" fill="#f0f0f0" />
        <path d="M10 10L30 30M30 10L10 30" stroke="#DC143C" strokeWidth="4" />
      </svg>
    </div>
  );

  if (!image) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`🚨 GATSBY IMAGE ERROR: Image missing in production: alt="${alt}"`);
    } else {
      console.error(`⚠️ GATSBY IMAGE ERROR: Image missing in development: alt="${alt}"`);
      return (
        <div className={className}>
          {fallbackSvg}
        </div>
      );
    }
  }

  return <GatsbyImage image={image} alt={alt} className={className} />;
};

export default SafeGatsbyImage;
