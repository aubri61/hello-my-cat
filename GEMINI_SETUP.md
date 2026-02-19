# Gemini AI 설정 가이드

## 환경변수 설정

1. **Gemini API 키 발급받기**
   - [Google AI Studio](https://ai.google.dev/)에 접속
   - 로그인 후 "API 키 가져오기" 클릭
   - 새 API 키 생성 또는 기존 키 사용

2. **환경변수 파일 생성**
   - 프로젝트 루트에 `.env.local` 파일 생성
   - 다음 내용 추가:
   ```
   GEMINI_API_KEY=여기에_발급받은_API_키_입력
   ```

3. **패키지 설치**
   ```bash
   npm install
   ```

## 사용 모델

현재 `gemini-2.5-flash` 모델을 사용하고 있습니다. 
다른 모델로 변경하려면 `app/api/chat/route.ts` 파일의 `model` 값을 수정하세요.

사용 가능한 모델:
- `gemini-2.5-flash` (권장, 빠르고 경제적)
- `gemini-2.5-pro` (더 강력하지만 느리고 비쌈)
- `gemini-3-flash-preview` (최신 모델)

## 프롬프트 자동 생성 기능

`lib/promptGenerator.ts` 파일의 `generatePetPrompt` 함수가 반려동물의 정보를 바탕으로 자동으로 프롬프트를 생성합니다.

프롬프트에는 다음 정보가 포함됩니다:
- 반려동물의 이름, 종류, 성격
- 무지개 다리 설정 설명
- 반려동물의 추억들
- 최근 대화 히스토리

## 문제 해결

### API 키 오류
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 환경변수 이름이 `GEMINI_API_KEY`인지 확인
- Next.js 개발 서버를 재시작 (`npm run dev`)

### 응답 생성 실패
- API 키가 유효한지 확인
- 네트워크 연결 확인
- 브라우저 콘솔에서 오류 메시지 확인
