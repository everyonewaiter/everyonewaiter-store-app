# 모두의 웨이터 매장 앱

모두의 웨이터 매장 앱은 사장님들이 운영하시는 매장에서 주문을 받고, 주문을 관리할 수 있는 앱입니다.

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

## Getting Start

### 1. 의존성 설치

```bash
npm install
```

### 2. env 파일 작성

```env
# SERVER_URL
EXPO_PUBLIC_API_SERVER_URL=https://devapi.everyonewaiter.com
EXPO_PUBLIC_SSE_SERVER_URL=https://devapi.everyonewaiter.com/v1/stores/subscribe
EXPO_PUBLIC_CDN_URL=https://cdn.everyonewaiter.com/d
```

### 3. 안드로이드 스튜디오 에뮬레이터 설치 및 설정

[안드로이드 스튜디오 에뮬레이터 EXPO 문서](https://docs.expo.dev/workflow/android-studio-emulator/)

> 에뮬레이터는 태블릿으로 설정해야 합니다.

### 4. 사전 빌드

```bash
npx expo prebuild --clean
```

### 5. 실행하기

```bash
npm run android
```

## 배포

매장 기기에 변경을 배포하는 방법은 앱 업데이트와 OTA 업데이트 두 가지다.

| 변경                                                              | 배포 방법                  |
|-------------------------------------------------------------------|----------------------------|
| 네이티브 변경 (의존성 업그레이드, 앱 설정 변경, Kscat 모듈 변경) | 앱 버전을 올려 앱 업데이트 |
| JS 코드만 수정한 변경                                             | OTA 업데이트               |

네이티브 변경이 있으면 반드시 앱 버전을 올려 앱 업데이트로 배포한다.  
OTA 업데이트는 같은 앱 버전의 매장 기기에 적용되므로 앱 버전을 올리지 않고 네이티브 변경을 OTA 업데이트로 배포하면 매장 기기에서 앱이 크래시 날 수 있다.  
이 규칙이 필요한 이유는 [ADR 0001](docs/adr/0001-runtime-version-app-version-policy.md)을 참고한다.

### 앱 업데이트

1. `app.json`의 `expo.version`, `package.json`과 `package-lock.json`의 `version`을 새 앱 버전으로 올린다.
2. production 프로필로 EAS 빌드를 실행한다.

   ```bash
   npx eas-cli build --platform android --profile production
   ```

3. 빌드한 APK를 운영 서버의 테스트 매장 기기에 설치해 확인한다.
4. 확인한 APK를 다시 빌드하지 않고 서버에 등록한다.
5. 매장 기기는 앱을 시작할 때 서버에 등록된 앱 버전이 기기의 앱 버전보다 높으면 APK를 다운로드해 설치 화면을 연다.

### OTA 업데이트

JS 코드만 수정한 변경은 앱 버전을 올리지 않고 OTA 업데이트로 배포한다.

```bash
npm run ota:production -- --message "변경 내용"
```

- `ota:production`은 production channel에 OTA 업데이트를 배포한다.  
  production 프로필로 빌드한 같은 앱 버전의 매장 기기에 적용된다.
- OTA 업데이트를 배포하면 매장 기기는 앱을 처음 새로 실행할 때 적용한다 (1.2.0부터).  
  앱을 시작할 때 새 OTA 업데이트를 최대 10초 기다리고 시간을 넘기면 기존 번들로 시작한 뒤 다음 실행 때 적용한다.  
  매장 기기는 종일 켜져 있으므로 바로 적용하려면 앱을 종료한 뒤 다시 실행한다.

#### `--environment production`이 필요한 이유

`EXPO_PUBLIC_*` 환경 변수는 번들을 만들 때 JS 코드에 값이 들어간다.  
`--environment production` 없이 `eas update`를 실행하면 로컬 `.env`(개발 서버)의 값으로 운영 번들을 만들어 매장 기기가 개발 서버로 요청한다.  
`ota:production`은 이 옵션으로 EAS 서버에 등록된 production 환경 변수를 사용한다.
