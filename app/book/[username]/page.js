'use client';

import Image from "next/image";
import { getBookingPageSettings } from '@/app/server.js';


export default async function Page({ params }) {
  const { uniqueName } = await params;

  const settings = await getBookingPageSettings(uniqueName);

  const businessName = settings['businessName'];
  const bgColor = settings['bgColor'];
  const logoUrl = settings['logoUrl'];

  const hexColor = bgColor.replace('#', '');

  // Parse the hex color to RGB components
  const r = parseInt(hexColor.substring(0, 2), 16) / 255;
  const g = parseInt(hexColor.substring(2, 4), 16) / 255;
  const b = parseInt(hexColor.substring(4, 6), 16) / 255;

  // Calculate luminance (perceived brightness)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // Use white text if luminance is below 0.5 (threshold can be adjusted)
  const shouldDarken = luminance < 0.5;

  // make a darker or lighter color of the bg
  const factor = shouldDarken ? 0.7 : 1.3;
  const newR = Math.min(255, Math.max(0, Math.round(r * factor)));
  const newG = Math.min(255, Math.max(0, Math.round(g * factor)));
  const newB = Math.min(255, Math.max(0, Math.round(b * factor)));

  const toHex = (c) => c.toString(16).padStart(2, '0');
  const newColor = `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;

  return (
    <div
      className="w-screen h-[100vw] px-[24px] py-[32px] grid place-items-center overflow-hidden"
      style={{ backgroundColor: newColor }}
    >
      <div
        className="w-full max-w-[400px] h-full max-h-[800px] px-[16px] py-[24px] flex [flex-flow:column_nowrap] overflow-x-hidden overflow-y-auto gap-[16px] justify-center"
        style={{ backgroundColor: bgColor }}
      >
        {
          logoUrl !== "" && <Image
            src={logoUrl}
            alt="Logo"
            width={500}
            height={300}
            priority={true}
            style={{ objectFit: 'contain' }}
          />
        }
        <h1>{businessName}</h1>
      </div>
    </div>
  );
}
