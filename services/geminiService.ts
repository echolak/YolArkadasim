
import { GoogleGenAI } from "@google/genai";
import { Report, UserLocation } from "../types";

export const getAIRoadAdvice = async (
  reports: Report[], 
  query: string, 
  userLocation: UserLocation,
  destination?: string | null
) => {
  try {
    // Create instance inside the function right before calling to ensure it uses the latest API key
    // Strictly follow guidelines: Use process.env.API_KEY directly without fallbacks
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    
    const reportSummary = reports.map(r => 
      `${r.type.toUpperCase()}: ${r.description} (Konum: ${r.lat.toFixed(3)}, ${r.lng.toFixed(3)})`
    ).join('\n');

    const navigationContext = destination ? `Kullanıcı şu hedefe gitmek istiyor: ${destination}` : '';

    const response = await ai.models.generateContent({
      // Maps grounding is only supported in Gemini 2.5 series models.
      // Reference: model: 'gemini-2.5-flash'
      model: 'gemini-2.5-flash',
      contents: `
        Sen 'YolArkadaşım AI' akıllı navigasyon asistanısın. Türkiye yolları hakkında derin bilgiye sahipsin.
        
        Mevcut Konum: Lat ${userLocation.lat}, Lng ${userLocation.lng}
        ${navigationContext}

        Kullanıcılar Tarafından Bildirilen Canlı Raporlar:
        ${reportSummary}
        
        Kullanıcı Sorusu: ${query}
        
        Lütfen Google Maps verilerini ve kullanıcı raporlarını harmanlayarak:
        1. Yakındaki önemli noktaları (benzinlik, dinlenme tesisi vb.) belirt.
        2. Raporlara göre en güvenli/hızlı yol tavsiyesi ver.
        3. Varsa polis, radar veya kaza noktalarına karşı uyar.
        
        Cevabın samimi, kısa ve bir yardımcı pilot gibi olsun. Google Maps linklerini paylaşabilirsin.
      `,
      config: {
        // Correct tool configuration: googleMaps may be used with googleSearch
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: userLocation.lat,
              longitude: userLocation.lng
            }
          }
        }
      },
    });

    // Extract grounding chunks as required by instructions for search/maps grounding
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const urls = chunks
      .map((c: any) => c.maps?.uri || c.web?.uri)
      .filter(Boolean);

    let text = response.text || "Bilgi alınamadı.";
    if (urls.length > 0) {
      // Append URLs to the response as required
      text += "\n\nKaynaklar:\n" + urls.map(u => `- ${u}`).join('\n');
    }

    return text;
  } catch (error) {
    console.error("Gemini Error:", error);
    // Handle the specific error message to prompt for key selection reset
    if (error instanceof Error && error.message.includes("Requested entity was not found")) {
      return "HATA: API anahtarı yetkisi bulunamadı. Lütfen anahtarınızı kontrol edin.";
    }
    return "Yol asistanı şu an meşgul. Lütfen tekrar deneyin.";
  }
};
