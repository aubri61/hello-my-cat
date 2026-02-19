import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { generatePetPrompt } from '@/lib/promptGenerator';
import type { Pet, Message } from '@/types/pet';

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { pet, message, conversationHistory } = await request.json();

    if (!pet || !message) {
      return NextResponse.json(
        { error: '반려동물 정보와 메시지가 필요합니다.' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY 환경변수가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // 프롬프트 자동 생성
    const systemPrompt = generatePetPrompt(pet as Pet, conversationHistory as Array<{ role: 'user' | 'pet', content: string }>);

    // 전체 프롬프트 구성
    const fullPrompt = `${systemPrompt}\n\n주인의 메시지: ${message}\n\n${pet.name}의 답변:`;

    // Gemini API 호출
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        temperature: 0.8,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 2048, // 토큰 수 대폭 증가 (MAX_TOKENS 오류 방지)
      },
    });

    // 응답 확인 및 디버깅
    let petResponse = '';
    
    // finishReason 확인
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      const finishReason = candidate.finishReason;
      
      console.log('Finish Reason:', finishReason);
      
      if (finishReason === 'MAX_TOKENS') {
        console.warn('응답이 토큰 제한으로 인해 잘렸습니다. maxOutputTokens를 늘려야 합니다.');
      }
      
      // candidates에서 직접 텍스트 추출
      if (candidate.content && candidate.content.parts) {
        petResponse = candidate.content.parts
          .map((part: any) => part.text || '')
          .join('')
          .trim();
      }
    }
    
    // response.text가 있으면 사용 (더 안전한 방법)
    if (!petResponse && response.text) {
      petResponse = response.text.trim();
    }

    // 응답이 비어있거나 너무 짧으면 재시도
    if (!petResponse || petResponse.length < 10) {
      console.error('응답이 비어있거나 너무 짧음:', petResponse);
      petResponse = '응답을 생성하지 못했어요. 다시 말해주실래요?';
    }

    // 디버깅 로그
    console.log('응답 길이:', petResponse.length);
    console.log('응답 내용 (처음 200자):', petResponse.substring(0, 200));
    console.log('응답 내용 (마지막 100자):', petResponse.substring(Math.max(0, petResponse.length - 100)));

    return NextResponse.json({
      response: petResponse,
    });
  } catch (error: any) {
    console.error('Gemini API 오류:', error);
    return NextResponse.json(
      { 
        error: 'AI 응답 생성 중 오류가 발생했습니다.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
