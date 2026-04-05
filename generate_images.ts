import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generate(prompt, filename) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        }
      }
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        fs.writeFileSync(filename, part.inlineData.data);
        console.log(`Generated ${filename}`);
      }
    }
  } catch (e) {
    console.error(`Error generating ${filename}: `, e);
  }
}

const prompts = [
  ["A high-quality product photo of a set of circular stickers for the 'Moss Covenant' charity project. The stickers feature small green moss flowers and the motto 'Moss flowers are as small as rice, yet they learn to bloom like peonies'. Aesthetic is minimalist, eco-friendly, emerald green and white colors.", "sticker.base64"],
  ["A high-quality product photo of a premium emerald green notebook with a minimalist embossed 'Moss Covenant' logo. The logo is a stylized small flower. Soft lighting, clean background.", "notebook.base64"],
  ["A high-quality photo of a circular metal enamel badge for 'Moss Observer'. It features a vibrant green moss flower design. The badge is pinned to a white canvas fabric.", "badge.base64"],
  ["A beautiful digital certificate design for 'Moss Partner'. Elegant typography, emerald green borders, a watermark of moss flowers, professional and inspiring.", "cert.base64"]
];

async function main() {
  for (const [prompt, filename] of prompts) {
    await generate(prompt, filename);
  }
}

main();
