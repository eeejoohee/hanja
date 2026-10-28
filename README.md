# 漢 한자 놀이터

아이들이 **카드 · 퀴즈 · 매일 도장 깨기**로 한자 급수 시험을 재미있게 준비하는 웹앱이에요.
휴대폰 홈 화면에 앱으로 설치할 수 있고, 정해진 시간에 퀴즈 알림도 받을 수 있어요.

👉 **바로 가기: https://eeejoohee.github.io/hanja/**

---

## 주요 기능

| 탭 | 기능 |
|---|---|
| **오늘** | 🔥 연속 학습 일수, 이번 주 도장 달력, 오늘의 도장 깨기, 틀린 한자 복습 |
| **카드** | 테마별 한자 카드 (눌러서 뒤집으면 뜻·소리·외우는 법, 관련 낱말) |
| **퀴즈** | 테마별 4지선다 퀴즈, 맞힌 비율에 따라 별 ⭐ 최대 3개 |
| **설정** | 급수 선택, 퀴즈 알림 시간(30분 단위, 하루 최대 4번), 자동 읽어주기 |

### 매일 도장 깨기
- 하루에 한 판(4문제 이상)을 끝내면 그날 달력에 **'참'** 도장이 찍히고 연속 일수가 올라가요.
- 테마별 단계 + 최종 시험으로 구성돼요. 처음 도전하는 단계는 **카드로 먼저 익히고** 퀴즈를 풀어요.
- **80% 이상** 맞히면 단계 도장을 받고 다음 단계가 열려요.

### 틀린 한자 복습
- 어떤 퀴즈에서든 틀린 한자는 자동으로 복습 목록에 들어가요.
- **두 번 맞혀야** 목록에서 빠져요.

### 그 밖에
- 🔊 뜻과 소리를 읽어줘요 (휴대폰 기본 음성 기능 사용)
- 📱 PWA: 홈 화면에 앱처럼 설치
- 🔔 웹 푸시 알림: 고른 시간에 "火 은(는) 무슨 뜻일까요?" 알림 → 누르면 바로 퀴즈
- 🌙 다크 모드 지원
- 학습 기록은 각 기기의 브라우저에 저장돼요 (서버에 저장하지 않아요)

---

## 파일 구조

```
hanja/
├── index.html                        # 앱 화면 전체 (HTML/CSS/JS)
├── hanja-data.js                     # 한자 데이터 (급수 · 테마 · 한자 · 낱말)
├── manifest.json                     # 앱 설치 정보 (이름, 아이콘, 시작 주소)
├── sw.js                             # 앱 설치용 서비스 워커
├── icon-192.png / icon-512.png / icon-maskable-512.png
├── push/OneSignalSDKWorker.js        # 푸시 알림 수신용 서비스 워커
└── .github/workflows/daily-hanja.yml # 30분마다 알림을 보내는 GitHub Actions
```

---

## 새 급수 추가하기

`hanja-data.js` 파일만 고치면 화면 · 퀴즈 · 도장 깨기 · 알림에 모두 자동으로 반영돼요.

```js
const HANJA_LEVELS = [
  { id: "8", name: "8급", themes: [ ... ] },
  {
    id: "7",
    name: "7급",
    themes: [
      { name: "자연", items: [
        ["花", "꽃 화", "풀(艹) 아래 변하는(化) 꽃"],
        // ["한자", "훈 음", "외우는 법"]
      ] }
    ]
  }
];
```

추가한 급수는 `HANJA_COMING` 목록(준비 중 표시)에서 빼 주세요.
낱말은 `HANJA_WORDS`에 `["낱말", "읽기"]` 형식으로 넣으면 카드 아래에 나와요.

---

## 알림 설정 (OneSignal + GitHub Actions)

1. **OneSignal** 웹 앱을 만들고 Site URL을 `https://eeejoohee.github.io`로 설정해요.
2. `index.html`의 `ONESIGNAL_APP_ID`에 App ID를 넣어요.
3. 저장소 **Settings → Secrets and variables → Actions**에 비밀값 2개를 등록해요.
   - `ONESIGNAL_APP_ID` : OneSignal App ID
   - `ONESIGNAL_REST_KEY` : OneSignal REST API Key (⚠️ 코드에 절대 넣지 마세요)
4. GitHub Actions가 **매시 3분 · 33분**마다 실행돼서, 그 시각(한국시간)을 고른 사람에게만 알림을 보내요.
   - 알림 시간은 OneSignal 태그로 저장돼요: `t1 = "8@1730"` (급수@시각)
5. 테스트: **Actions → 한자 퀴즈 알림 → Run workflow** (모든 구독자에게 바로 발송)

> 하루 최대 알림 횟수(`MAX_TIMES`)는 OneSignal 요금제의 사용자당 태그 수를 넘지 않게 맞춰 주세요.
> `index.html`과 `daily-hanja.yml` 두 곳의 값이 같아야 해요.

---

## 배포

GitHub Pages (Settings → Pages → Branch: `main`, 폴더: `/ (root)`)
파일을 올리고 Commit하면 1~2분 뒤 자동으로 반영돼요.
