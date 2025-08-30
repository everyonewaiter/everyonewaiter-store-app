# 모두의 웨이터 매장 앱

모두의 웨이터 매장 앱은 사장님들이 운영하시는 매장에서 주문을 받고, 주문을 관리할 수 있는 앱입니다.<br/>

## 지원하는 기능

- 공통
    - [x] 앱 버전 확인 후 앱 업데이트하기
- 손님 테이블
    - [x] 메뉴 주문하기
    - [x] 선결제 후 메뉴 주문하기
    - [x] 주문 내역 확인하기
    - [x] 원산지 확인하기
    - [x] 직원 호출하기
- 웨이팅
    - [x] 웨이팅 등록하기
    - [x] 웨이팅 수 확인하기
- 홀 관리
    - [ ] 서빙 미완료 주문 목록 확인하기
    - [ ] 서빙 완료 주문 목록 확인하기
    - [ ] 서빙 완료 처리하기
    - [ ] 직원 호출 목록 확인하기
    - [ ] 직원 호출 처리하기
    - [ ] 웨이팅 목록 확인하기
    - [ ] 웨이팅 손님 호출하기
    - [ ] 웨이팅 완료 처리하기
    - [ ] 웨이팅 취소하기
- POS
    - [ ] 테이블 목록 확인하기
    - [ ] 테이블 주문 내역 확인하기
    - [ ] 테이블 메뉴 주문하기
    - [ ] 테이블 메뉴 주문 취소하기
    - [ ] 테이블 주문 할인하기
    - [ ] 테이블 자리 이동하기
    - [ ] 주문 결제하기
    - [ ] 주문 결제 취소하기
    - [ ] 매출 내역 확인하기

## 시작하기

1. 의존성 설치

   ```bash
   npm install
   ```

2. env 파일 작성

   ```env
   # SERVER_URL
   EXPO_PUBLIC_API_SERVER_URL=https://api.everyonewaiter.com
   EXPO_PUBLIC_SSE_SERVER_URL=https://api.everyonewaiter.com/v1/stores/subscribe
   EXPO_PUBLIC_CDN_URL=https://cdn.everyonewaiter.com/d
   
   # SENTRY
   SENTRY_DSN=
   SENTRY_AUTH_TOKEN=
   SENTRY_ENVIRONMENT=development
   ```

3. 안드로이드 스튜디오 에뮬레이터 설치 및 설정

    - [안드로이드 스튜디오 에뮬레이터 EXPO 문서](https://docs.expo.dev/workflow/android-studio-emulator/)

   > 에뮬레이터는 태블릿으로 설정해야 합니다.

4. 사전 빌드

    ```bash
    npx expo prebuild --clean
    ```

5. 실행하기

   ```bash
   npm run android
   ```
