# INU 교양과목 장바구니 서비스 개발 프롬프트


### 교과목 엑셀 파일 정리 및 csv 변환

> 학점당 단가, 수강가격 추가
---
### supabase에 프로젝트 및 교과목 테이블 생성

---
### supabase Project URL, Publishable Key 복사

> NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
> NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
---
### 빈 폴더를 생성하고 courses로 이름을 변경

---
### 터미널을 열고 코드 베이스 구성

> npx create-next-app@latest .
---
### 코드 수정

- readme.md 파일 내용 삭제
- next.config.ts 수정
- app/layout.tsx의 title, description 수정
---
### supabase 연결을 위한 패키지 설치

터미널에서

> npm install @supabase/supabase-js @supabase/ssr
---
### supabase 키를 환경 변수 파일에 등록

.env.local 파일을 만들고 아래 키를 등록

> NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
> NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
---
### supabase 초기화 파일 제작

프롬프트:

1. 필요한 파일
> lib/supabase/server.ts : 서버 컴포넌트용 supabase 클라이언트 (createClient)
> lib/supabase/client.ts : 클라이언트 컴포넌트용 supabase 클라이언트 (createClient)

2. 아래 패키지가 이미 설치됨
> @supabase/supabase-js
> @supabase/ssr

3. 환경변수에 supabase 키가 추가되어 있음
> NEXT_PUBLIC_SUPABASE_URL
> NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

이외 화면이나 로직은 수정하지 말고, 필요한 초기화 코드만 작성
---
### supabase 연결 확인

프롬프트:

> supabase 연결을 확인해줘
---
### clonecn skill 설치

> npx skills add hunvreus/clonecn --skill clonecn
---
### 메인페이지 메뉴 구성 (1)

프롬프트:

> supabase의 courses 테이블에 있는 '이수구분'의 항목 유일값을 상위메뉴로 하고
> '이수영역'의 항목 유일값을 하위 메뉴로 가져와서 구성해줘
> '이수구분'과 '이수영역'은 변하지 않으므로 메뉴를 구성하는 기능은 매번 테이블에서
> 데이터를 가져와 연산하지 말고 소스나 별도 파일에 값으로 보관해서 운영하자.
> 메뉴 디자인은 첨부한 이미지 디자인을 참고하고 오른쪽 영역은 아직 구현하지 말고
> 메뉴 기능만 구현해줘

첨부파일: design_ref1.jpg
---
### 메인페이지 메뉴 구성 (2)

프롬프트:

> CATEGORY 단어는 삭제하고, 핵심교양과 심화교양의 순서를 바꾸자.
> Shuffle, Open Preset 버튼도 삭제하자
---
### 오른쪽 과목 리스트 페이지 구성 (1)

프롬프트:

> 상단에는 검색창을 배치하고 기본은 교과목명으로 검색하되, '이수구분'과 '이수영역'을
> 선택하여 교과목명을 검색할 수 있도록 하자. 로직은 구현하지 말고 디자인만 하자.
> 각 교과목은 첨부한 이미지 design_ref2.jpg를 참고하여 카드 형식으로 만들고,
> supabase의 courses 테이블에 있는 교과목명, 담당교수, 시간표, 학점, 정원, 성적평가를 배치하자.
> 검색창 아래에 학문의 기초 4개씩 2줄, 그 아래에는 핵심교양 4개씩 2줄,
> 그 아래에는 심화교양 4개씩 2줄 배치하자.
> 메인 페이지에 나타나는 교과목은 랜덤으로 하자.
> 각 교과목 카드에는 오른쪽 상단에는 '자세히' 버튼,
> 카드 하단에는 '장바구니 담기' 버튼을 배치하자.

첨부파일: design_ref2.jpg
---
### 오른쪽 과목 리스트 페이지 구성 (2)

프롬프트:

> 각 교과목 카드안에 '수강가격'을 포함시키고 '자세히' 버튼을 누르면 팝업 창이 나타나서
> supabase의 courses 테이블에 있는 '이수구분'부터 '원어강의' 필드까지 내용을 가져와서 배치하자.
---
### 오른쪽 과목 리스트 페이지 구성 (3)

프롬프트:

> 각 이수구분을 나타내는 텍스트 오른쪽에 '+' 기호를 링크로 배치하고 이 기호를 누르면
> 해당 영역의 교과목을 카드 형식으로 모두 나열하는 기능을 구현하자.
> 이때 해당 영역의 교과목 카드는 4개식 6줄로 배치하고 그 다음 교과목들은 하단에 페이지를
> 배치하여 페이지 번호나 다음 페이지 버튼을 누르면 그 순서에 맞는 교과목들을 보이도록 하자.
> 이 기능은 왼쪽 메뉴에서 이수영역을 눌러도 가능하도록 구현하자.
---
### 오른쪽 과목 리스트 페이지 구성 (4)

프롬프트:

> 검색창에 교수명 옵션도 추가하자. 검색창은 기본 교과목명 일부를 넣으면 해당하는 교과목을
> 나열하도록 하고 옵션을 선택하면 그에 맞추어 검색하고 결과를 나열하자. 
---
### 구글 로그인 구성 (1)

프롬프트:

> 오른쪽 과목 리스트 페이지 오른쪽 상단에 로그인 링크를 만들어.
> 로그인 링크를 누르면 다른 페이지로 이동하지 않도록 해.
---
### 구글 로그인 구성 (2)

프롬프트:

> app 폴더 밑에 auth 폴더를 만들고 이 안에 page.tsx 파일을 만들어.
> 로그인 링크를 누르면 로그인 팝업이 나타나서 로그인을 할 수 있도록 하려고 해.
> auth 페이지에 로그인 디자인만 우선 구현해주면 돼.
> 메인 페이지 디자인 컨셉을 유지하면서 구현해.
> 단, 로그인과 회원가입을 구분할 필요는 없어. 필요한 건 단지 google 로그인 뿐이야.
> 로그인 창에 상단에 Mascot.jpg 이미지를 배치해.
---
### 구글 로그인 구성 (3)

supabase와 google cloud console에서 구글 인증에 필요한 설정 진행

1. supabase 접속
2. 프로젝트 메뉴에서 **[Authentication]-[Sign In / Providers]** 클릭
3. Google 클릭 후 Client IDs와 Client Secret (for OAuth) 입력을 위해
4. google cloud console에 접속하여 courses란 이름의 새 프로젝트 생성
5. courses 프로젝트로 이동한 다음, **[API 및 서비스]** 클릭
6. **[API 및 서비스]** 에 있는 **[사용자 인증 정보]** 클릭
7. **[+사용자 인증 정보 만들기]-[OAuth 클라이언트 ID]** 클릭하여 프로젝트 구성
	- 클라이언트 ID: your-google-client-id
	- 클라이언트 비밀번호: your-google-client-secret

8. supabase 창에 클라이언트 ID와 클라이언트 비밀번호를 입력
---
### 구글 로그인 구성 (4)

프롬프트:

> supabase 를 활용해서 auth 페이지에 구글 로그인을 구현하자.
> 현재 프로젝트에서 전역으로 로그인 상태를 관리하기 위해 Authcontext를 설정하자.
> supabase auth로 로그인 된 사용자를 바로 데이터베이스에 저장하기 위해 users 테이블을 생성하고, 자동으로 연동되게 하자.
> 로그인이 이루어지면 메인 페이지로 이동하자.
> 로그인이 되었으면 '로그인' 링크는 사용자 프로필을 팝오버 형태로 구현하자. 사용자 프로필 사진이 보이고, 호버 시 아래에 signout이 보이도록 하자.

- Authcontext: 특정 상태를 프로젝트 전체에서 언제든 확인 가능하도록 공유 기능. 어떤 페이지에서든 로그인 상태인가를 간편하게 확인 가능
---
### 장바구니 구현 (1)

프롬프트:

> 로그인 링크/프로필 왼쪽 옆에 '장바구니' 링크를 만들자.
---
### 장바구니 구현 (2) : 장바구니 데이터베이스 구성

프롬프트:

> supabase에 장바구니 테이블을 생성하자.

```
테이블명: cart_items
필드 구성:
- id: uuid, primary key, default gen_random_uuid()
- user_id: uuid, foreign key → auth.users(id), on delete cascade
- course_id: int8, foreign key → courses(id), on delete cascade
- added_at: timestamptz, default now()
- (user_id, course_id) 조합에 unique 제약 조건 추가 (중복 담기 방지)

RLS(Row Level Security) 정책도 함께 설정하자:
- SELECT: 본인 데이터만 조회 가능
- INSERT: 로그인한 사용자만 본인 user_id로 삽입 가능
- DELETE: 본인 데이터만 삭제 가능
```
---
### 장바구니 구현 (3) : 장바구니 전역 상태 관리

프롬프트:

> AuthContext처럼 CartContext를 만들어서 장바구니 상태를 전역으로 관리하자.

```
CartContext에서 관리할 것:
- cartItems: 현재 담긴 교과목 목록 (courses 테이블 join하여 상세 정보 포함)
- cartCount: 담긴 교과목 수 (헤더 아이콘 뱃지에 표시용)
- addToCart(courseId): 장바구니에 추가, 이미 담긴 경우 토스트 메시지 표시
- removeFromCart(courseId): 장바구니에서 제거
- isInCart(courseId): 특정 교과목이 담겼는지 boolean 반환
- totalCredits: 담긴 교과목 학점 합계
- totalPrice: 담긴 교과목 수강가격 합계

로그인 상태가 아닐 때 '장바구니 담기' 버튼을 누르면
로그인 유도 메시지 모달을 보여주자.
```
---
### 장바구니 구현 (4) : 장바구니 담기 버튼 동작 수정

프롬프트:

> 메인 페이지 각 교과목 카드의 '장바구니 담기' 버튼에 기능을 연결하자.

```
- 로그인 상태가 아니면: "로그인 후 이용 가능합니다" 토스트 메시지 표시
- 이미 담긴 교과목이면: 버튼을 '담기 취소' 상태로 표시하고 누르면 제거
- 담기 성공하면: "장바구니에 담겼습니다" 토스트 메시지 표시
- 헤더의 장바구니 아이콘 뱃지 숫자 실시간 업데이트
- 버튼 상태: 담기 전(검정 배경 + '+ 장바구니 담기'), 담긴 후(파란 배경 + '✓ 담기 완료')
```
---
### 장바구니 구현 (5) : 장바구니 뱃지 수정

프롬프트:

> 장바구니 아이콘 오른쪽 상단에 담긴 교과목 수를 뱃지로 표시하자.
> 담긴 항목이 0개일 때는 뱃지를 숨기자.
---
### 장바구니 구현 (6) : 장바구니 기능 수정

프롬프트:

> 장바구니에 담긴 교과목명에 교수명도 추가하자.
> 장바구니에 담긴 교과목명을 누르면 교과목 상세 모달창을 보여주자.
> 장바구니 페이지 오른쪽에도 로그인 프로필을 추가하자.
---
### 장바구니 구현 (6) : 장바구니 페이지 구성

프롬프트:

> app/cart/page.tsx를 만들어 장바구니 페이지를 구현하자.
> 로그인하지 않은 상태로 접근하면 메인 페이지로 redirect하자.

```
레이아웃:
- 왼쪽 영역(2/3): 담긴 교과목 목록
- 오른쪽 영역(1/3): 수강 신청 요약 및 결제 버튼 (sticky)

왼쪽 교과목 목록 카드에 표시할 항목:
- 이수구분, 이수영역 뱃지
- 교과목명, 담당교수, 시간표, 학점, 수강가격
- 오른쪽에 삭제(X) 버튼

오른쪽 요약 영역:
- 담긴 교과목 수
- 총 학점 합계
- 총 수강가격 합계
- '전체 삭제' 버튼
- '수강 신청하기' 버튼 (현재는 디자인만, 기능은 추후 구현)

빈 장바구니일 때:
- "아직 담긴 교과목이 없습니다" 메시지
- '교과목 둘러보기' 버튼 → 메인 페이지로 이동

메인 페이지 디자인 컨셉을 유지하자.
```
---
### 주문내역 구현 (1) : 주문내역 페이지 구성

프롬프트:

> 메인 페이지의 장바구니 링크 왼쪽 옆에 '주문내역' 링크를 만들자.
> 로그인하지 않은 상태로 접근하면 메인 페이지로 redirect하자.
> 장바구니 페이지에도 '주문내역' 링크를 만들자.
> 모든 '주문내역'을 클릭하면 아직은 아무 동작도 하지 않도록 하자.
---
### 주문내역 구현 (2) : 주문내역 페이지 구성

프롬프트:

>  메인 페이지에서 로그인 상태가 아닐 때 '주문내역'을 클릭하면 장바구니와 같이 모달창이 나타나도록 하자.
---
### 주문내역 구현 (3) : supabase 테이블 구성

프롬프트:

> supabase에 주문내역을 저장하는 테이블을 생성하자.

```
supabase에 주문내역을 저장하는 테이블을 생성하자.
 
테이블명: orders
필드 구성:
- id: uuid, primary key, default gen_random_uuid()
- user_id: uuid, foreign key → auth.users(id), on delete cascade
- ordered_at: timestamptz, default now()
- total_credits: int4  (총 신청 학점)
- total_price: int8    (총 수강가격)
- status: text, default 'completed'  (추후 토스페이먼츠 연동 시 'pending' | 'completed' | 'cancelled' 로 확장 예정)
 
테이블명: order_items
필드 구성:
- id: uuid, primary key, default gen_random_uuid()
- order_id: uuid, foreign key → orders(id), on delete cascade
- course_id: int8, foreign key → courses(id), on delete cascade
- course_name: text    (주문 시점 교과목명 스냅샷)
- professor: text      (주문 시점 교수명 스냅샷)
- credits: int4        (주문 시점 학점 스냅샷)
- price: int8          (주문 시점 수강가격 스냅샷)
 
RLS(Row Level Security) 정책도 함께 설정하자:
- orders, order_items 모두 SELECT/INSERT는 본인 데이터만 허용
- DELETE와 UPDATE는 허용하지 않음 (주문 내역은 수정/삭제 불가)
```
---
### 주문내역 구현 (4) : 수강신청 버튼 동작 구현

프롬프트:

> 장바구니 페이지(app/cart/page.tsx)의 '수강 신청하기' 버튼에 기능을 연결하자.

``` 
동작 순서:
1. 버튼 클릭 시 로딩 스피너를 표시하고 버튼을 비활성화하자.
2. supabase의 orders 테이블에 주문 레코드를 생성하자.
   - user_id: 현재 로그인 사용자 id
   - total_credits: CartContext의 totalCredits
   - total_price: CartContext의 totalPrice
   - status: 'completed'
3. 생성된 order의 id를 이용해 order_items 테이블에 장바구니 각 교과목을 일괄 삽입하자.
   - 교과목명, 교수명, 학점, 수강가격은 주문 시점 값을 스냅샷으로 저장하자.
4. 주문 저장이 완료되면 CartContext의 장바구니를 전체 비우자 (cart_items 테이블 삭제 포함).
5. "수강 신청이 완료되었습니다!" 토스트 메시지를 표시하자.
6. 1.5초 후 /orders 페이지로 자동 이동하자.
 
오류 처리:
- 저장 실패 시 "수강 신청에 실패했습니다. 다시 시도해 주세요." 토스트 메시지를 표시하자.
- orders 저장은 성공했지만 order_items 저장 실패 시, 생성된 order 레코드를 롤백(삭제)하자.
```
---
### 주문내역 구현 (5) : 주문내역 페이지 구성

프롬프트:

> app/orders/page.tsx를 만들어 주문내역 페이지를 구현하자.
> 로그인하지 않은 상태로 접근하면 메인 페이지로 redirect하자.

```
레이아웃 및 기능:
- 메인 페이지, 장바구니 페이지의 디자인 컨셉을 유지하자.
- 상단에 "수강신청 내역" 제목과 "인천대학교 교양 과목 수강신청 내역을 확인하세요." 부제목을 배치하자.
 
주문 목록:
- supabase의 orders 테이블에서 현재 로그인 사용자의 주문을 ordered_at 기준 최신순으로 조회하자.
- 주문이 없을 경우 "아직 수강신청 내역이 없습니다." 메시지와 '교과목 둘러보기' 버튼(→ 메인 페이지)을 표시하자.
 
주문 카드 구성 (주문 1건 = 카드 1개):
- 상단: 주문번호(order id 앞 8자리), 신청일시(ordered_at, 한국 시간 포맷)
- 중간: 해당 주문의 order_items를 목록으로 표시
  - 각 항목: 교과목명, 교수명, 학점, 수강가격
- 하단: 총 신청 학점, 총 수강가격 합계
- 우측 상단에 상태 뱃지 표시 (status: 'completed' → '신청완료', 추후 확장 대비)
 
헤더:
- 메인 페이지와 동일하게 왼쪽에 장바구니 링크, 오른쪽에 로그인 프로필을 배치하자.
```
---
### 주문내역 구현 (6) : 주문내역 링크 연결 및 접근 제어 통합

프롬프트:

> 기존 '주문내역' 링크에 실제 라우팅 기능을 연결하자.

```
- 메인 페이지 헤더의 '주문내역' 링크: 로그인 상태이면 /orders로 이동, 비로그인 상태이면 로그인 유도 모달 표시
- 장바구니 페이지 헤더의 '주문내역' 링크: /orders로 이동
- 장바구니 페이지에서 수강신청 완료 후 /orders로 자동 이동 시 이미 구현되어 있으면 유지하자.
 
모달 내용 (비로그인 사용자 대상):
- "로그인 후 이용 가능합니다"
- Google 로그인 버튼 또는 /auth 페이지로 이동하는 '로그인하기' 버튼
```
---
### 주문내역 구현 (7) : 주문내역 상세 모달

프롬프트:

> 주문내역 페이지(app/orders/page.tsx)에서 각 주문 카드를 클릭하면 기존 교과목 상세 모달(courses 테이블 기준)을 보여주자.
> 이때 나타나는 기존 교과목 상세 모달창에서는 [장바구니에 담기] 버튼을 나타내지 말자.
---
### 주문내역 구현 (8) : 주문내역 삭제

프롬프트:

> 주문내역 페이지에서 주문내역을 삭제하는 기능을 추가하자.
> 이때 supabase의 관련 테이블에서도 내역을 삭제하는 기능을 구현하자.
---
### 장바구니 토스페이먼츠 연결 (1)

프롬프트:

> 터미널에서 토스페이먼츠 SDK를 설치하자.

```Terminal
npm install @tosspayments/tosspayments-sdk
```
---
### 장바구니 토스페이먼츠 연결 (2)

프롬프트:

> `.env.local` 파일에 아래 키를 추가하자.

```env
NEXT_PUBLIC_TOSS_CLIENT_KEY=your-toss-client-key
TOSS_SECRET_KEY=your-toss-secret-key
```
---
### 장바구니 토스페이먼츠 연결 (3) - 결제 전 정보 입력 모달 구현

프롬프트:

> 장바구니 페이지의 '수강 신청하기' 버튼을 누르면
> 기존의 supabase 저장 로직 대신, 먼저 결제자 정보를 입력하는 모달창을 보여주자.

```
모달 구성:
- 제목: "결제자 정보 입력"
- 입력 필드 1: 이름 (텍스트, 필수)
- 입력 필드 2: 이메일 (이메일 타입, 필수)
- Google 계정으로 로그인된 사용자라면 이름과 이메일을 AuthContext에서 가져와 기본값으로 자동 채우자.
- 하단 버튼: '취소' 버튼과 '결제하기' 버튼
- '결제하기' 버튼을 누르면 이름·이메일 유효성 검사를 수행하고 통과 시 다음 단계로 넘어가자.
- 유효성 검사 실패 시 해당 필드 아래에 인라인 오류 메시지를 표시하자.
- 메인 페이지 디자인 컨셉을 유지하자.
```
---
### 장바구니 토스페이먼츠 연결 (4) - 토스페이먼츠 결제창 연동

프롬프트:

> 정보 입력 모달에서 '결제하기' 버튼을 누르면 토스페이먼츠 결제창을 실행하자.

```
설치된 패키지: `@tosspayments/tosspayments-sdk`
클라이언트 키: 환경변수 `NEXT_PUBLIC_TOSS_CLIENT_KEY` 사용

결제 파라미터:
- `clientKey`: `process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY`
- `customerKey`: 현재 로그인된 사용자의 supabase user id (UUID)
- `orderId`: `'INU-' + Date.now()` 형식으로 생성
- `orderName`: `'인천대학교 기초교육원 교양 교과목 결제'`
- `amount`: CartContext의 `totalPrice` (원 단위 정수)
- `customerName`: STEP 1 모달에서 입력한 이름
- `customerEmail`: STEP 1 모달에서 입력한 이메일
- `successUrl`: `${window.location.origin}/payment/success`
- `failUrl`: `${window.location.origin}/payment/fail`
```

> 결제창은 페이지 이동 방식(redirect)으로 실행하자.
> 토스페이먼츠 SDK의 `loadTossPayments`를 클라이언트 컴포넌트에서 사용하자.
---
### 장바구니 토스페이먼츠 연결 (5) - 결제 성공 처리 페이지 구현

프롬프트:

> `app/payment/success/page.tsx` 파일을 새로 만들어 결제 성공 처리 로직을 구현하자.
> 이 페이지는 토스페이먼츠가 결제 완료 후 리다이렉트하는 페이지로,
> URL 쿼리 파라미터로 `paymentKey`, `orderId`, `amount`가 전달된다.

```
동작 순서:
1. URL 쿼리 파라미터에서 `paymentKey`, `orderId`, `amount`를 읽는다.
2. 서버 API Route(`/api/payment/confirm`)를 호출하여 토스페이먼츠 결제 승인을 요청한다.
   - 요청 바디: `{ paymentKey, orderId, amount }`
3. 결제 승인 성공 시 아래 로직을 순서대로 실행한다:
   a. supabase의 `orders` 테이블에 주문 레코드를 생성한다.
	- `user_id`: 현재 로그인 사용자 id
	- `total_credits`: CartContext의 `totalCredits`
	- `total_price`: 결제 승인된 `amount`
	- `status`: `'completed'`
   b. 생성된 `order.id`로 `order_items` 테이블에 장바구니 각 교과목을 일괄 삽입한다.
   c. CartContext의 장바구니를 전체 비운다 (`cart_items` 테이블 삭제 포함).
   d. "수강 신청이 완료되었습니다!" 토스트 메시지를 표시한다.
   e. 1.5초 후 `/orders` 페이지로 자동 이동한다.
4. 페이지 로딩 중에는 "결제를 처리하고 있습니다..." 스피너를 중앙에 표시한다.
5. 오류 발생 시 "결제 처리에 실패했습니다. 기초교육원으로 문의해주세요." 메시지를 표시한다.
```
---
### 장바구니 토스페이먼츠 연결 (6) - 결제 승인 API Route 구현(결제 금액 위조를 방지)

프롬프트:

> `app/api/payment/confirm/route.ts` 파일을 만들어 토스페이먼츠 결제 승인 API를 구현하자.

```
- HTTP Method: POST
- 요청 바디: `{ paymentKey: string, orderId: string, amount: number }`
- 토스페이먼츠 결제 승인 API 엔드포인트: `https://api.tosspayments.com/v1/payments/confirm`
- 인증 방식: Basic 인증
- `TOSS_SECRET_KEY` 환경변수 값을 `secretKey + ':'` 형식으로 Base64 인코딩하여 Authorization 헤더에 `Basic {인코딩값}` 형태로 전달
- 성공 시 토스페이먼츠 응답을 그대로 JSON으로 반환 (status 200)
- 실패 시 오류 메시지와 함께 status 400 반환
- `TOSS_SECRET_KEY`는 서버 환경변수로만 사용하고 클라이언트에 절대 노출하지 말자.
```
---
### 장바구니 토스페이먼츠 연결 (7) - 결제 실패 처리 페이지 구현

프롬프트:

> `app/payment/fail/page.tsx` 파일을 새로 만들어 결제 실패 처리 화면을 구현하자.
> 이 페이지는 토스페이먼츠가 결제 실패 또는 취소 후 리다이렉트하는 페이지로,
> URL 쿼리 파라미터로 `code`, `message`, `orderId`가 전달된다.

```
화면 구성:
- 브라우저 상단 가운데에서 슬라이드 다운으로 나타나는 알림 메시지 (토스트 형식):
- 내용: "결제에 실패했습니다: {message}"
- 색상: 빨간색 계열
- 3초 후 자동으로 사라짐
- 알림 메시지 표시 후 자동으로 `/cart` 페이지로 이동하자.
- 이동 전 "잠시 후 장바구니로 돌아갑니다..." 안내 문구를 화면 중앙에 표시하자.
- 메인 페이지 디자인 컨셉을 유지하자.
```
---
### 장바구니 토스페이먼츠 연결 (8) - orders 테이블 status 컬럼 및 toss_payment_key 컬럼 추가

프롬프트:

> supabase의 `orders` 테이블에 토스페이먼츠 연동을 위한 컬럼을 추가하자.

```
추가할 컬럼:
- `toss_payment_key`: text, nullable (토스페이먼츠 paymentKey 저장용)
- `toss_order_id`: text, nullable (토스페이먼츠 orderId 저장용)

기존 `status` 컬럼의 default 값을 `'pending'`으로 변경하고, 결제 승인 성공 후 `app/payment/success/page.tsx`에서 orders 레코드 생성 시 아래 필드도 함께 저장하도록 수정하자:
- `toss_payment_key`: 토스페이먼츠에서 전달받은 `paymentKey`
- `toss_order_id`: 토스페이먼츠에서 전달받은 `orderId`
- `status`: `'completed'`
```
---
### 관리자 페이지 (1) - 관리자 메뉴 버튼 배치

프롬프트:
 
> 왼쪽 사이드바 메뉴 맨 하단에 관리자 메뉴 버튼을 작게 배치하자.
> 버튼 디자인은 기존 메뉴보다 작고 흐릿하게(opacity 낮게) 처리하고, 텍스트는 '관리자'로만 표시하자.
> 이 버튼을 클릭하면 비밀번호 입력 모달이 나타나도록 하자.
---
### 관리자 페이지 (2) - 비밀번호 인증 모달 구현

프롬프트:

> 관리자 버튼 클릭 시 나타나는 비밀번호 입력 모달을 구현하자.

```
모달 구성:
- 제목: "관리자 인증"
- 설명: "관리자 비밀번호를 입력하세요."
- 입력 필드: 비밀번호 (type="password")
- 하단 버튼: '취소' 버튼과 '확인' 버튼
 
인증 로직:
- 비밀번호가 'rlchrydbrdnjs' 이면 /admin 페이지로 이동
- 틀리면 "비밀번호가 올바르지 않습니다." 인라인 오류 메시지 표시
- 비밀번호는 소스 코드에 상수로 고정하고 환경변수나 DB에 저장하지 않는다.
- 메인 페이지 디자인 컨셉을 유지하자.
```

> 참고: 비밀번호 'rlchrydbrdnjs'은 '기초교육원'을 영어로 타이핑한 값이다.
---
### 관리자 페이지 (3) - 관리자 페이지 접근 제어

프롬프트:

> app/admin/layout.tsx를 만들어 /admin 경로 전체에 접근 제어를 적용하자.

```
- 세션 스토리지(sessionStorage)에 'adminAuth' 키가 'true'로 저장되어 있어야만 /admin 하위 페이지에 접근 가능하다.
- 인증 없이 /admin 경로로 직접 접근하면 메인 페이지(/)로 redirect한다.
- 비밀번호 인증 성공 시 sessionStorage에 'adminAuth': 'true'를 저장하고 /admin으로 이동한다.
- 관리자 페이지 내에 '로그아웃' 버튼을 두어 sessionStorage를 초기화하고 메인 페이지로 이동하도록 한다.
```
---
### 관리자 페이지 (4) - 관리자 페이지 레이아웃

프롬프트:

> app/admin/page.tsx를 만들어 관리자 대시보드 메인 페이지를 구현하자.

```
레이아웃:
- 상단 헤더: "기초교육원 관리자" 타이틀, 오른쪽에 '메인으로 돌아가기' 링크와 '로그아웃' 버튼
- 왼쪽 관리자 사이드바 메뉴:
	- 대시보드
	- 교과목 관리
	- 수강신청 내역 조회
	- 회원 관리
	- 정산 및 매출 현황
- 오른쪽 콘텐츠 영역: 선택된 메뉴에 따라 내용을 표시
 
메인 페이지 디자인 컨셉을 유지하되, 관리자 영역임을 구분할 수 있도록
상단 헤더에 짙은 배경색(예: 남색 계열)을 사용하자.
```
---
### 관리자 페이지 (5) - 관리자 페이지 기능 구성

프롬프트:

> 관리자 대시보드(app/admin/page.tsx)에 주요 현황 요약 카드를 구성하자.
> 마지막 접속 시간을 실제 이전 접속 시간으로 기록하자.

```
요약 카드 항목:
- 전체 교과목 수: supabase courses 테이블 count
- 전체 회원 수: supabase users 테이블 count
- 오늘 수강신청 건수: orders 테이블에서 오늘 날짜 기준 count
- 이번 달 총 매출: orders 테이블에서 이번 달 total_price 합계
 
각 카드는 아이콘, 지표명, 숫자값을 표시하고 숫자는 실시간으로 supabase에서 조회한다.
```
---
### 관리자 페이지 (6) - 교과목 관리

프롬프트:

> app/admin/courses/page.tsx를 만들어 교과목 관리 페이지를 구현하자.

```
기능 구성:
1. 교과목 목록 테이블 표시
   - 컬럼: 교과목명, 담당교수, 이수구분, 이수영역, 학점, 수강가격, 정원, 수강인원(cart_items 기준)
   - 검색: 교과목명 또는 교수명으로 필터링
   - 정렬: 이수구분, 이수영역 기준 정렬 가능
 
2. 교과목 추가 버튼
   - '+ 교과목 추가' 버튼 클릭 시 모달 팝업
   - courses 테이블의 모든 필드를 입력할 수 있는 폼 제공
   - 저장 시 supabase courses 테이블에 insert
 
3. 교과목 수정
   - 테이블 각 행의 '수정' 버튼 클릭 시 해당 교과목 정보가 채워진 수정 모달 팝업
   - 저장 시 supabase courses 테이블 update
 
4. 교과목 삭제
   - 테이블 각 행의 '삭제' 버튼 클릭 시 확인 모달 표시 후 삭제
   - 삭제 전 해당 교과목이 cart_items 또는 order_items에 참조되어 있으면 경고 표시

> 교과목 리스트를 20개씩 나열하고 다른 목록은 하단에 페이지로 구성해서 탐색하도록 하자.
```
---
### 관리자 페이지 (7) - 수강신청 내역 조회

프롬프트:

> app/admin/orders/page.tsx를 만들어 전체 수강신청 내역을 조회하는 페이지를 구현하자.

```
기능 구성:
1. 전체 주문 목록 테이블
   - 컬럼: 주문번호(앞 8자리), 신청자명, 신청일시, 총 학점, 총 금액, 상태(status)
   - supabase orders 테이블에서 users 테이블을 join하여 신청자명(display_name) 표시
   - ordered_at 기준 최신순 정렬
 
2. 필터 기능
   - 기간 필터: 시작일 ~ 종료일 선택
   - 상태 필터: 전체 / 완료(completed) / 취소(cancelled)
   - 신청자명 검색
 
3. 주문 상세 보기
   - 각 행 클릭 시 해당 주문의 order_items 목록을 펼쳐서 표시
   - order_items의 교과목명, 교수명, 학점, 수강가격 표시
 
4. 주문 상태 변경
   - 각 주문 행에 '상태 변경' 드롭다운 제공 (completed ↔ cancelled)
   - 변경 시 supabase orders 테이블 status 컬럼 update
 
5. 엑셀 다운로드
   - '엑셀 다운로드' 버튼 클릭 시 조회된 주문 목록을 CSV 형식으로 다운로드
```
---
### 관리자 페이지 (8) - 회원 관리

프롬프트:

> app/admin/users/page.tsx를 만들어 회원 관리 페이지를 구현하자.

```
기능 구성:
1. 전체 회원 목록 테이블
   - 컬럼: 이름(display_name), 이메일, 가입일시, 수강신청 횟수, 총 결제금액
   - supabase users 테이블과 orders 테이블을 join하여 통계 표시
 
2. 회원 검색
   - 이름 또는 이메일로 검색
 
3. 회원 상세 보기
   - 각 행 클릭 시 해당 회원의 수강신청 내역을 모달로 표시
   - 주문번호, 신청일시, 교과목 목록, 금액 표시
```
---
### 관리자 페이지 (9) - 정산 및 매출 현황

프롬프트:

> app/admin/stats/page.tsx를 만들어 정산 및 매출 현황 페이지를 구현하자.

```
기능 구성:
1. 기간별 매출 요약
   - 오늘 / 이번 주 / 이번 달 / 전체 매출 합계 카드로 표시
 
2. 월별 매출 차트
   - 최근 6개월 또는 12개월 기준 월별 총 매출 합계를 막대 차트로 시각화
   - chart.js 또는 recharts 사용
 
3. 이수구분별 수강신청 현황
   - 학문의 기초 / 핵심교양 / 심화교양 별로 신청 건수 및 매출 비율을 파이 차트로 표시
 
4. 인기 교과목 TOP 10
   - order_items 기준으로 가장 많이 신청된 교과목 상위 10개를 테이블로 표시
   - 컬럼: 순위, 교과목명, 담당교수, 신청 횟수, 총 수강가격 합계
 
5. 정산 데이터 다운로드
   - '정산 데이터 다운로드' 버튼 클릭 시 기간 선택 모달 표시
   - 선택 기간의 orders + order_items 데이터를 CSV로 다운로드
```
---
### 관리자 페이지 (10) - 관리자 페이지 공통 사항

.env.local에 SUPABASE_SERVICE_ROLE_KEY로 등록한다.
service_role 키는 절대 클라이언트에 노출하지 않는다.

프롬프트:

```
- 모든 관리자 페이지는 sessionStorage 'adminAuth' 인증을 통과한 경우에만 접근 가능하다.
- supabase RLS(Row Level Security) 정책은 일반 사용자 기준으로 설정되어 있으므로, 관리자 페이지의 조회/수정/삭제는 supabase의 service_role 키를 사용하는 서버 API Route(app/api/admin/...)를 통해서만 처리한다.
- 관리자 페이지의 모든 데이터 변경 작업(추가/수정/삭제)은 반드시 확인 모달을 거친다.
- 메인 페이지의 전반적인 디자인 컨셉(폰트, 색상 시스템)을 유지하되,
  관리자 전용 색상 포인트(예: 인디고 계열)를 사용하여 일반 사용자 화면과 구분한다.
```
---
### 깃허브에 커밋하기

프롬프트:

> 현재 연결된 깃허브 계정 정보를 알려줘.

1. 깃허브 저장소 만들기
2. 깃허브에 코드베이스 업로드하기

```
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/Kyonam/inu_courses.git
git push -u origin main

깃허브에 업로드해줘.
```
---
### Vercel에서 배포하기

배포시 .env.local 파일에 있는 환경 변수를 반드시 등록해야 함