'use client';

import Image from "next/image";
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";


export default function Page({ params }) {
  const { username } = params;
  const [settings, setSettings] = useState({
    bgColor: "#ffffff",
    logoUrl: "",
    businessName: "Aniekan's"
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchSettings = async () => {
      try {
        const response = await fetch(`/api/getBookSettings?username=${username}`);
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);


  const businessName = settings['businessName'];
  const bgColor = settings['bgColor'];
  const logoUrl = settings['logoUrl'];

  const hexColor = bgColor.replace('#', '');

  // Parse hex to RGB (0-255)
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);

  // Convert RGB to HSL
  const r1 = r / 255, g1 = g / 255, b1 = b / 255;
  const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1);
  let h, s, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r1) h = (g1 - b1) / d + (g1 < b1 ? 6 : 0);
    else if (max === g1) h = (b1 - r1) / d + 2;
    else h = (r1 - g1) / d + 4;
    h /= 6;
  }

  // Calculate luminance for decision (same as your original)
  const luminance = 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1;
  const shouldDarken = luminance < 0.5;

  // Adjust lightness (HSL makes this more natural)
  l = Math.max(0, Math.min(1, l * (shouldDarken ? 0.7 : 1.3)));

  // Convert HSL back to RGB
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    return t < 1 / 6 ? p + (q - p) * 6 * t
      : t < 0.5 ? q
        : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6
          : p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const newR = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const newG = Math.round(hue2rgb(p, q, h) * 255);
  const newB = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);

  // Convert to hex
  const toHex = c => c.toString(16).padStart(2, '0');
  const newColor = `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;

  return (
    <div
      className={`w-screen h-screen grid place-items-center overflow-hidden`}
      style={{ backgroundColor: newColor }}
    >
      <div
        className={`w-full max-w-[360px] h-full max-h-[650px] p-[16px] pt-[24px] flex flex-col overflow-x-hidden overflow-y-auto gap-4 rounded-[10px] [box-shadow:0_1px_3px_rgba(0,0,0,0.12),_0_10px_20px_rgba(0,0,0,0.08)] items-center ${shouldDarken ? "text-white" : "text-black"
          }`}
        style={{ backgroundColor: bgColor }}
      >
        {logoUrl !== "" && (
          <Image
            src={logoUrl}
            alt="Logo"
            width={120}
            height={60}
            priority={true}
            className="object-contain"
          />
        )}
        <h1 className="text-[32px] text-left font-bold cursor-default leading-[38.4px] tracking-[-2%]" >You're booking with <span className="whitespace-nowrap" >{businessName}</span></h1>
        <div className="w-full flex [flex-flow:column_nowrap] gap-[12px]">
          <TextField
            className="w-full"
            id="full-name"
            label="Full Name"
            variant="outlined"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: shouldDarken ? 'white' : 'black',
                  transition: 'all 0.3s ease',
                },
                '&:hover fieldset': {
                  borderColor: shouldDarken ? 'white' : 'black',
                  borderWidth: 2,
                },
                '&.Mui-focused fieldset': {
                  borderColor: shouldDarken ? 'white' : 'black',
                  boxShadow: shouldDarken
                    ? '0 0 0 2px rgba(255,255,255,0.5)'
                    : '0 0 0 2px rgba(0,0,0,0.5)',
                  borderWidth: 1,
                },
                color: shouldDarken ? 'white' : 'black',
              },
              '& .MuiInputLabel-root': {
                color: shouldDarken ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                '&.Mui-focused': {
                  color: shouldDarken ? 'white' : 'black',
                },
              },
            }}
            InputProps={{
              sx: {
                '& input': {
                  color: shouldDarken ? 'white' : 'black',
                },
              },
            }}
          />

          <TextField
            className="w-full"
            id="phone-number"
            label="Phone Number"
            variant="outlined"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: shouldDarken ? 'white' : 'black',
                  transition: 'all 0.3s ease',
                },
                '&:hover fieldset': {
                  borderColor: shouldDarken ? 'white' : 'black',
                  borderWidth: 2,
                },
                '&.Mui-focused fieldset': {
                  borderColor: shouldDarken ? 'white' : 'black',
                  boxShadow: shouldDarken
                    ? '0 0 0 2px rgba(255,255,255,0.5)'
                    : '0 0 0 2px rgba(0,0,0,0.5)',
                  borderWidth: 1,
                },
                color: shouldDarken ? 'white' : 'black',
              },
              '& .MuiInputLabel-root': {
                color: shouldDarken ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                '&.Mui-focused': {
                  color: shouldDarken ? 'white' : 'black',
                },
              },
            }}
            InputProps={{
              sx: {
                '& input': {
                  color: shouldDarken ? 'white' : 'black',
                },
              },
            }}
          />

        </div>
      </div>
    </div>
  );
}
