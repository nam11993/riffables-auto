# Riffables - Bản Testcase Đã Chạy Automation

## Phạm Vi

Tài liệu này là bản tiếng Việt để QA đọc nhanh các testcase trong `riffables-master.test-cases.md` đã có trạng thái automation.

Nguồn gốc:

| Trường | Giá trị |
| --- | --- |
| File gốc | `qa-ai-workflow/test-cases/riffables-master.test-cases.md` |
| Phạm vi lọc | Các testcase có cột `Status` bắt đầu bằng `Auto` |
| Tổng số testcase trong master | `400` |
| Số testcase có automation status | `129` |
| Ngày tổng hợp | `2026-07-22` |

Quy ước status:

| Status | Ý nghĩa |
| --- | --- |
| `Auto PASS` | Automation đã chạy và kết quả đạt kỳ vọng của testcase. |
| `Auto PARTIAL PASS` | Automation mới cover được một phần, vẫn cần data/backend/manual check để kết luận đầy đủ. |
| `Auto PARTIAL` | Có bằng chứng automation một phần, nhưng chưa đủ điều kiện để pass một phần theo contract đầy đủ. |
| `Auto BLOCKED` | Automation bị chặn bởi điều kiện ngoài hệ thống, ví dụ Google OAuth. |
| `Auto EXPECTED FAIL` | Automation cố ý đánh dấu fail vì staging đang có bug/behavior chưa đúng. |
| `Auto FAIL` | Automation đã chạy và kết quả không đạt expected result của testcase. |
| `Auto SKIP` | Automation bị skip vì thiếu cấu hình hoặc fixture. |

Tổng hợp nhanh:

| Nhóm status | Số lượng |
| --- | ---: |
| PASS | 100 |
| PARTIAL PASS | 15 |
| PARTIAL | 1 |
| BLOCKED | 3 |
| EXPECTED FAIL | 5 |
| FAIL | 2 |
| SKIP | 3 |
| Tổng | 129 |

## Tổng Hợp Theo Module

| Module | Số case auto | Ghi chú |
| --- | ---: | --- |
| Auth / Account / Workspace | 23 | Login, logout, negative auth validation, password UX/a11y, signup, forgot/change password request, setup organization, workspace/account menu. |
| Source / YouTube | 32 | Source UI, OAuth boundary, connected source, catalog entry points, selected ingest entry points. |
| Ingestion | 3 | Queued, ready/transcript coverage, permanent failure/no-transcript terminal state. |
| Catalog | 9 | Metadata, exact selected ingest, search, selectability, failed retry. |
| Crawl | 3 | Progress done/total và total khớp selected input. |
| Console / Home / Sites | 15 | Core navigation, Home overview, summary modules, next-step CTA, How it works, Sites setup/lifecycle guards. |
| Search | 7 | Keyword search, exact quoted search, result limit, empty/long input boundary. |
| Public Site | 13 | Sunday public site load/search plus Baohan public-site publish/search fixture gates. |
| Site Builder / Editor | 22 | Baohan editor chrome, preview, invalid publish guard, layers/inspector, Assistant entrypoint, content edit, draft persistence expected-fail, viewport toolbar, Add library, side panels, section actions, theme, media, help tour, icon target size. |
| Accessibility | 1 | Heading structure cơ bản. |
| Onboarding | 1 | First authenticated onboarding dialog. |

## Auth / Account / Workspace

| ID | Priority | Tên testcase tiếng Việt | Kết quả automation | Ghi chú đọc nhanh |
| --- | --- | --- | --- | --- |
| `TC-AUTH-001` | P0 | Đăng nhập thành công và vào đúng workspace/tenant | `Auto PASS 2026-07-16` | Kiểm tra direct email/password, chọn organization nếu cần, vào console đã authenticated. |
| `TC-AUTH-002` | P0 | Login sai thông tin bị reject an toàn | `Auto PASS 2026-07-22` | Wrong password và unknown email đều trả `Invalid email or password`, không tạo session, không leak account existence. |
| `TC-AUTH-003` | P0 | User chưa đăng nhập không được vào route bảo vệ | `Auto PASS 2026-07-16` | Mở `/sources` khi signed out và xác nhận bị gate/redirect về sign-in. |
| `TC-AUTH-004` | P1 | Đăng xuất kết thúc session | `Auto PASS 2026-07-16` | Sau sign out, mở lại route bảo vệ phải quay về sign-in. |
| `TC-AUTH-008` | P0 | Wrong password login rejection | `Auto PASS 2026-07-22` | Nhập email hợp lệ + password sai, verify lỗi generic và route bảo vệ vẫn bị chặn. |
| `TC-AUTH-009` | P1 | Blank login validation | `Auto PASS 2026-07-22` | Email blank và password blank đều giữ submit disabled, không tạo session. |
| `TC-AUTH-013` | P0 | Toggle hiện/ẩn password | `Auto PASS 2026-07-22` | `Show password` đổi field sang text, `Hide password` đổi lại masked, giữ nguyên typed value. |
| `TC-AUTH-014` | P0 | Password reveal reset khi quay lại email step | `Auto PASS 2026-07-22` | Sau khi show password, bấm `Back to email`, continue lại thì field trở về masked và `aria-pressed=false`. |
| `TC-AUTH-015` | P0 | Password toggle accessibility | `Auto PASS 2026-07-22` | Verify label Show/Hide password, keyboard Enter/Space, `aria-pressed`, target size tối thiểu 24x24 px. |
| `TC-AUTH-023` | P0 | Tạo account mới và đến màn setup organization | `Auto PASS 2026-07-16` | Signup creator mới thành công, không leak tenant khác. |
| `TC-AUTH-024` | P1 | Forgot password gửi yêu cầu reset link | `Auto PASS 2026-07-16` | Chỉ verify app hiện confirmation an toàn, chưa verify email/reset link thật. |
| `TC-AUTH-025` | P1 | User đã login yêu cầu change-password email link | `Auto PASS 2026-07-16` | Vào Account Settings, bấm Change password, verify confirmation gửi email. |
| `TC-AUTH-034` | P1 | Forgot-password unknown email không leak account tồn tại | `Auto PASS 2026-07-22` | Unknown email vẫn nhận generic confirmation, không hiện not-found/no-account copy, không tạo session. |
| `TC-AUTH-043` | P1 | Signed-out user không request được change-password từ settings | `Auto PASS 2026-07-22` | Mở `/settings` khi signed out bị gate về sign-in và không thấy Account Settings/Change password. |
| `TC-AUTH-044` | P0 | Existing creator vào được màn select organization sau login | `Auto PASS 2026-07-16` | Verify `/setup-organization`, danh sách workspace và action Select. |
| `TC-AUTH-045` | P0 | Existing creator chọn được organization có sẵn | `Auto PASS 2026-07-16` | Sau khi select organization, console load đúng tenant. |
| `TC-AUTH-046` | P1 | Setup organization validate blank và auto-generate slug | `Auto PASS 2026-07-16` | Nút tạo disabled khi blank, nhập name thì sinh slug hợp lệ. |
| `TC-AUTH-047` | P1 | Setup organization reject slug sai format | `Auto PASS 2026-07-16` | Slug uppercase/space/symbol bị reject. |
| `TC-AUTH-048` | P0 | Creator mới tạo organization và vào dashboard | `Auto PASS 2026-07-16` | Tạo organization mới thành công, vào dashboard đúng tenant. |
| `TC-AUTH-049` | P1 | Menu workspace trên Home hiện workspace và account actions | `Auto PASS 2026-07-16` | Verify danh sách workspace, Create workspace, Account settings. |
| `TC-AUTH-050` | P1 | Mở Account Settings từ menu Home workspace | `Auto PASS 2026-07-16` | Điều hướng đến `/settings`, thấy sign-in methods và Change password. |
| `TC-AUTH-051` | P1 | Modal Create workspace validate blank và slug | `Auto PASS 2026-07-16` | Validate name/slug, invalid slug disabled submit, cancel không tạo workspace. |
| `TC-AUTH-052` | P0 | Workspace mới được persist và selectable sau login | `Auto PASS 2026-07-16` | Tạo workspace, sign out/in lại, workspace mới vẫn xuất hiện và chọn được. |

## Source / YouTube

| ID | Priority | Tên testcase tiếng Việt | Kết quả automation | Ghi chú đọc nhanh |
| --- | --- | --- | --- | --- |
| `TC-SOURCE-001` | P0 | Màn Sources mở thành công và hiện các loại source supported | `Auto PASS 2026-07-17` | Verify Sources page, YouTube channel ready, các source tương lai Crawling soon. |
| `TC-SOURCE-002` | P0 | YouTube channel được chấp nhận và lưu | `Auto BLOCKED 2026-07-17` | Bị chặn tại Google OAuth automated browser trước consent. |
| `TC-SOURCE-003` | P0 | Chọn Manual mode trước khi connect YouTube channel | `Auto PARTIAL PASS 2026-07-17` | Mới cover pre-OAuth manual-mode selection, chưa complete callback. |
| `TC-SOURCE-007` | P0 | Mở workflow connect source | `Auto PASS 2026-07-17` | Verify Connect a source area, source choices, controls. |
| `TC-SOURCE-008` | P0 | Connect YouTube channel Auto mode | `Auto BLOCKED 2026-07-17` | Bị chặn tại Google OAuth automated browser trước consent. |
| `TC-SOURCE-009` | P0 | Connect YouTube channel Manual mode | `Auto PARTIAL PASS 2026-07-17` | Mới cover chọn Manual trước OAuth. |
| `TC-SOURCE-013` | P0 | Form YouTube chấp nhận handle và bắt đầu Google verification | `Auto PASS 2026-07-17` | Điền source handle, Verify with Google enable và redirect sang Google. |
| `TC-SOURCE-014` | P0 | Connected YouTube channel active và có crawl controls | `Auto PASS 2026-07-17` | Source active, Auto, có Details/Videos/Run crawl/Backfill. |
| `TC-SOURCE-015` | P0 | YouTube input blank không submit được | `Auto PASS 2026-07-17` | Verify with Google disabled khi input blank. |
| `TC-SOURCE-016` | P0 | Handle YouTube sai format phải bị reject | `Auto EXPECTED FAIL 2026-07-17` | Staging hiện vẫn enable Google verification cho value malformed. |
| `TC-SOURCE-017` | P0 | Domain source không hỗ trợ phải bị reject | `Auto EXPECTED FAIL 2026-07-17` | Staging hiện vẫn enable Google verification cho TikTok/Facebook/example. |
| `TC-SOURCE-018` | P0 | URL YouTube không phải channel phải bị reject | `Auto EXPECTED FAIL 2026-07-17` | Staging hiện vẫn enable Google verification cho watch/shorts/playlist/embed. |
| `TC-SOURCE-022` | P1 | Source type Crawling soon không thể submit active source | `Auto PASS 2026-07-17` | Click/kiểm tra các type disabled/future không start flow active. |
| `TC-SOURCE-023` | P0 | Workspace chưa có source hiện empty first-source state | `Auto PASS 2026-07-17` | Verify Connect your first source và No ingestion runs yet. |
| `TC-SOURCE-024` | P0 | Connected Auto source card hiện metadata và actions | `Auto PASS 2026-07-17` | Verify metadata, controls, pipeline cards, recent runs. |
| `TC-SOURCE-025` | P0 | Source Details modal hiện diagnostic metadata scoped đúng tenant | `Auto PASS 2026-07-17` | Details có source id/type/status/created/updated/last run/backend config. |
| `TC-SOURCE-026` | P1 | Details modal View crawled content route về content context | `Auto PASS 2026-07-17` | Điều hướng từ Details sang Content nếu CTA có sẵn. |
| `TC-SOURCE-031` | P1 | Schedule modal hiện recurring crawl cadence options | `Auto PASS 2026-07-17` | Chỉ review modal, không tạo schedule. |
| `TC-SOURCE-034` | P0 | Run crawl interactive cập nhật progress | `Auto PARTIAL 2026-07-17` | Selected-ingest thành công với 1 clip đạt `1/1`; full Run crawl multi-item vẫn cần fixture mới. |
| `TC-SOURCE-034A` | P0 | Run crawl khi không có eligible data | `Auto PARTIAL PASS 2026-07-17` | UI/action path ổn định; backend job/content count cần thêm observability. |
| `TC-SOURCE-036` | P0 | Force rerun chỉ modify lần explicit crawl tiếp theo | `Auto PARTIAL PASS 2026-07-17` | Mới verify control hiển thị/no-submit guard. |
| `TC-SOURCE-037` | P0 | Backfill form validate date và limit | `Auto PARTIAL PASS 2026-07-17` | Verify controls và edit limit, chưa submit Backfill thật. |
| `TC-SOURCE-038A` | P0 | Backfill valid request nhưng không có matching data | `Auto PARTIAL PASS 2026-07-17` | UI/action path verified, vẫn cần backend job/content count. |
| `TC-SOURCE-039` | P0 | Pipeline cards hiện queue health và recent runs | `Auto PASS 2026-07-17` | Verify Crawl/Transcribe/Extract/Embed và Recent runs. |
| `TC-SOURCE-040` | P1 | Sources Refresh cập nhật visible state không đổi config source | `Auto PASS 2026-07-17` | Refresh page/source không tạo crawl/backfill/schedule/OAuth side effect. |
| `TC-SOURCE-041` | P0 | Channel Videos panel mở được và handle empty/partial catalog | `Auto PASS 2026-07-17` | Mở panel, search/pagination empty/partial, không ingest. |
| `TC-SOURCE-042` | P0 | Catalog Refresh chỉ metadata, không ingest videos | `Auto PASS 2026-07-17` | Refresh catalog thấy row known mà không start ingest. |
| `TC-SOURCE-042A` | P0 | Catalog Refresh khi provider empty | `Auto PARTIAL PASS 2026-07-17` | UI/action path verified, cần thêm backend/content count. |
| `TC-SOURCE-043` | P1 | Search/pagination catalog không start ingestion | `Auto PASS 2026-07-17` | Search keyword, clear search, không có run mới. |
| `TC-SOURCE-044` | P0 | State của catalog row điều khiển selectability | `Auto PARTIAL PASS 2026-07-17` | Đã cover fresh/selectable, Failed selectable, Queued transition, No insights disabled; còn thiếu Processing/Riffed fixtures. |
| `TC-SOURCE-045` | P0 | Ingest selected chỉ queue đúng các video đã chọn | `Auto PASS 2026-07-20` | Chọn 2 video; video không chọn không bị ingest; run `2/2`; selected rows sau đó `No insights`, không phải generated-riffable success. |
| `TC-SOURCE-045A` | P0 | Ingest selected với 0 item/empty catalog bị block an toàn | `Auto PARTIAL PASS 2026-07-17` | UI/action path verified; cần backend job/content count để kết luận đầy đủ. |

## Ingestion / Catalog / Crawl

| ID | Priority | Tên testcase tiếng Việt | Kết quả automation | Ghi chú đọc nhanh |
| --- | --- | --- | --- | --- |
| `TC-INGEST-016` | P0 | State Queued xuất hiện sau ingest request | `Auto PASS 2026-07-17` | Sau `Ingest 1 selected`, row chuyển Queued trước khi terminal failure. |
| `TC-INGEST-018` | P0 | Ready/success state sau ingest thành công | `Auto PASS 2026-07-20` | Cover 3 clip có transcript; latest exact-selected có `3 with transcript`. |
| `TC-INGEST-020` | P0 | Permanent failure vào terminal state | `Auto PASS 2026-07-17` | Failed retry có terminal failure; no-audio content `TRANSCRIPT None yet` / `No riffables`. |
| `TC-CATALOG-001` | P0 | Catalog có metadata title và publish date | `Auto PASS 2026-07-17` | Metadata-only catalog row hiện title/date. |
| `TC-CATALOG-005` | P0 | Chỉ video được chọn mới vào pipeline | `Auto PASS 2026-07-20` | 2 video được chọn vào Queued/run `2/2`; video không chọn vẫn unselected/fresh. |
| `TC-CATALOG-010` | P0 | Catalog hiện metadata và count info | `Auto PASS 2026-07-17` | Row known visible; count có thể tạm hiện refresh state. |
| `TC-CATALOG-013` | P0 | Mở catalog sau khi channel connected | `Auto PASS 2026-07-17` | Channel catalog mở được trong đúng tenant. |
| `TC-CATALOG-014` | P0 | Catalog row hiện đúng title và publish date | `Auto PASS 2026-07-17` | Kiểm tra title/date của row known. |
| `TC-CATALOG-017` | P1 | Search catalog theo title không ingest | `Auto PASS 2026-07-17` | Search chỉ filter rows, không start pipeline. |
| `TC-CATALOG-018` | P0 | Not ingested video selectable | `Auto PASS 2026-07-17` | Fresh row enabled và CTA thành `Ingest 1 selected`; rerun cần clip fresh mới. |
| `TC-CATALOG-019` | P0 | Queued/Processing/Riffed videos bị disabled | `Auto PARTIAL PASS 2026-07-17` | Đã cover No insights disabled; còn thiếu Queued, Processing, Riffed fixtures. |
| `TC-CATALOG-020` | P0 | Failed video có thể retry selection | `Auto PASS 2026-07-17` | Failed row được select, queued, rồi terminal failure. |
| `TC-CRAWL-002` | P0 | Progress hiện done/total | `Auto PASS 2026-07-20` | Selected-ingest progress đạt `2/2`; có intermediate Transcribing/Extracting. |
| `TC-CRAWL-010` | P0 | Progress total khớp số video expected | `Auto PASS 2026-07-20` | Selected total khớp final `2/2`. |
| `TC-CRAWL-013` | P0 | Progress total khớp selected input | `Auto PASS 2026-07-20` | Chọn 2 rows -> CTA `Ingest 2 selected` -> Recent run `2/2`. |

## Public Site / Search

| ID | Priority | Tên testcase tiếng Việt | Kết quả automation | Ghi chú đọc nhanh |
| --- | --- | --- | --- | --- |
| `TC-SEARCH-001` | P0 | Keyword search trả kết quả liên quan | `Auto PASS 2026-07-21` | Search `K-pop` trên Sunday public site trả kết quả `Fancams are an engine of K-pop virality`. |
| `TC-SEARCH-004` | P0 | Exact wording được ưu tiên hơn kết quả semantic yếu hơn | `Auto PASS 2026-07-21` | Query quoted exact phrase đưa title exact lên kết quả đầu tiên. |
| `TC-SEARCH-006` | P0 | Số lượng kết quả không vượt configured maximum | `Auto PASS 2026-07-21` | Tổng declared result của query `K-pop` nằm trong max automation `60`. |
| `TC-SEARCH-011` | P0 | Keyword search trả insight match | `Auto PASS 2026-07-21` | Verify keyword `K-pop` trả đúng insight/card kỳ vọng trong tenant Sunday. |
| `TC-SEARCH-013` | P0 | Exact quoted search ưu tiên exact wording | `Auto PASS 2026-07-21` | Query `"Fancams are an engine of K-pop virality"` trả exact title làm first riffable result. |
| `TC-SEARCH-015` | P1 | Empty/whitespace search input được xử lý an toàn | `Auto PASS 2026-07-21` | Empty query hiện guidance, whitespace query hiện no-match/safe state, không crash. |
| `TC-SEARCH-016` | P1 | Long search input được xử lý an toàn | `Auto PASS 2026-07-21` | Long repeated `K-pop` query không crash, không hiện internal error/stack trace. |
| `TC-PUBLIC-001` | P0 | Public site load đúng audience interface của tenant | `Auto PASS 2026-07-21` | `https://sunday.apps.riffables.com/` load và refresh được, có context `Sunday Okay`. |
| `TC-PUBLIC-002` | P0 | Unknown/incorrect tenant URL không lộ data tenant khác | `Auto SKIP 2026-07-21` | Đã có automation hook, nhưng cần `PUBLIC_TENANT_B_URL` và `PUBLIC_TENANT_B_UNIQUE_TEXT`. |
| `TC-PUBLIC-003` | P0 | Public site hiển thị searchable insight library | `Auto PASS 2026-07-21` | `/library` có nhiều riff/source cards; `/search?q=K-pop` trả matching cards. |
| `TC-PUBLIC-005` | P0 | Citation mở source media tại timestamp đúng | `Auto SKIP 2026-07-21` | Detail có quote/source text nhưng chưa có clickable media timestamp affordance để verify. |
| `TC-PUBLIC-007` | P0 | Insight cards hiển thị mandatory fields ổn định | `Auto PASS 2026-07-21` | Card có source label, riff sequence, title, summary/snippet trước và sau search. |
| `TC-PUBLIC-009` | P0 | Published public site load được | `Auto PASS 2026-07-21` | Case cũ hết skip vì đã có Sunday `PUBLIC_SITE_URL`. |
| `TC-PUBLIC-010` | P0 | Invalid/unpublished public URL không lộ content | `Auto PASS 2026-07-21` | Invalid path trả `No published site was found here`, không render library cards. |
| `TC-PUBLIC-011` | P0 | Public insight card có required fields | `Auto PASS 2026-07-21` | Nhiều cards trên `/library` có field chính ổn định. |
| `TC-PUBLIC-014` | P0 | Public labels dùng data thật của creator/tenant | `Auto EXPECTED FAIL 2026-07-21` | Trang Sunday vẫn hiện placeholder/demo copy: `Sample Studio`, `demo show`, `Package preview`. |
| `TC-PUBLIC-016` | P0 | Public labels tenant-scoped | `Auto SKIP 2026-07-21` | Cần Tenant B public URL và unique label fixture để verify đầy đủ. |
| `TC-PUBLIC-022` | P0 | Baohan public site load sau khi publish từ editor | `Auto PASS 2026-07-21` | Đã publish và mở được `https://baohan.apps.riffables.com/`, không còn `NOT FOUND`. |
| `TC-PUBLIC-023` | P0 | Baohan public library/search dùng đúng content Baohan | `Auto FAIL 2026-07-21` | Search `test` trên public Baohan trả `No matches`, chưa thấy content Baohan published/searchable. |
| `TC-PUBLIC-024` | P0 | Baohan public site không lộ fixture Sunday | `Auto PARTIAL PASS 2026-07-21` | Public root không thấy `Sunday Okay`; chưa chạy đủ Sunday-only query list. |

## Site Editor / Publish / Baohan

| ID | Priority | Tên testcase tiếng Việt | Kết quả automation | Ghi chú đọc nhanh |
| --- | --- | --- | --- | --- |
| `TC-CONSOLE-041` | P0 | Màn Sites tạo/quản lý site Baohan | `Auto PASS 2026-07-21` | Site thật đã được tạo/publish; `/sites` hiện `Manage & publish`. |
| `TC-CONSOLE-042` | P0 | Sites list/status tenant-scoped | `Auto PASS 2026-07-21` | `/sites` manage/publish state load đúng Baohan, không lộ fixture Sunday. |
| `TC-CONSOLE-043` | P0 | Mở editor giữ đúng context Baohan | `Auto PASS 2026-07-21` | Click entrypoint từ `/sites`, vào `/sites/editor`, không redirect auth, refresh vẫn load editor. |
| `TC-CONSOLE-044` | P0 | Unpublish Baohan site | `Auto PASS 2026-07-22` | `/sites` có nút `Unpublish`; automation confirm modal, site chuyển `Offline`, public URL trả `NOT FOUND`/không có published site. |
| `TC-CONSOLE-045` | P0 | Republish Baohan unpublished site | `Auto PASS 2026-07-22` | Mở editor từ state offline, click `Publish`, confirm domain `baohan`, site live lại đúng URL `https://baohan.apps.riffables.com/`. |
| `TC-CONSOLE-046` | P1 | Discard draft changes trong editor | `Auto PASS 2026-07-22` | Vào `Open editor`, tạo draft change bằng `Duplicate section`, thấy nút `Discard`, confirm `Discard changes` thì draft revert về live snapshot và public URL vẫn live. |
| `TC-CONSOLE-047` | P1 | Delete current site rồi recreate từ Template | `Auto PASS 2026-07-22` | Cancel delete giữ site live; confirm `Delete site` xóa current site, URL cũ trả no published site, sau đó dùng Template/editor publish lại `baohan`. |
| `TC-CONSOLE-048` | P0 | Role thấp không được mutate lifecycle | `Auto BLOCKED 2026-07-22` | Đây là case security hợp lệ; cần account Baohan role thấp hoặc API fixture để chạy auto. |
| `TC-BUILDER-020` | P0 | Baohan editor load đủ editor chrome | `Auto PASS 2026-07-21` | Verify Page sections, Section settings, Preview, Publish, Design, Media, Assistant, refresh. |
| `TC-BUILDER-021` | P0 | Manual text edit update selected field | `Auto PASS 2026-07-22` | Chọn Hero section, field text editable nhận marker QA, `Discard` xuất hiện và cleanup được draft. |
| `TC-BUILDER-022` | P0 | Draft edit save và persist sau reload | `Auto EXPECTED FAIL 2026-07-22` | Editor nhận field edit trước reload nhưng sau reload value revert về `A library of conversations`; đây là bug hiện tại được đánh expected fail. |
| `TC-BUILDER-023` | P0 | Preview mở được trước publish | `Auto PARTIAL PASS 2026-07-21` | Preview mở được, chưa test draft marker vs live site vì cần mutation/public URL. |
| `TC-BUILDER-024` | P0 | Publish Baohan site với subdomain | `Auto PASS 2026-07-21` | Publish subdomain `baohan`, live URL load được. |
| `TC-BUILDER-025` | P0 | Invalid publish subdomain bị block | `Auto PARTIAL PASS 2026-07-21` | Đã test value có space/special char; cần mở rộng thêm boundary values. |
| `TC-BUILDER-026` | P1 | Chọn section từ layers panel | `Auto PASS 2026-07-21` | Click một section thật, inspector vẫn hiển thị. |
| `TC-BUILDER-027` | P1 | Inspector tabs sau khi chọn section | `Auto PARTIAL PASS 2026-07-21` | Đã thấy `content/data/theme`; hover/focus highlight cần selector sâu hơn. |
| `TC-BUILDER-029` | P0 | Catalog binding chỉ dùng Riffables của Baohan | `Auto FAIL 2026-07-21` | Public site vẫn hiện placeholder `Sample Studio`/`Local sample`, search `test` không ra content Baohan. |
| `TC-BUILDER-030` | P0 | Assistant không auto-publish/mutate live site | `Auto PARTIAL PASS 2026-07-21` | Entry point Assistant mở được; prompt-level AI safety vẫn manual/gated. |
| `TC-BUILDER-031` | P1 | Toolbar viewport không tạo draft | `Auto PASS 2026-07-22` | Click `Tablet`, `Mobile`, `Desktop`, `Fit View`, `Free Drag Mode`; editor vẫn ổn định, không xuất hiện `Discard`, rồi tắt lại `Free Drag Mode` để cleanup state. |
| `TC-BUILDER-032` | P1 | Add panel hiển thị section/element library | `Auto PASS 2026-07-22` | `Add` mở danh sách sections và elements: Hero, CTA, Content Cards, Heading, Text, Image, Collection... mà không mutate draft. |
| `TC-BUILDER-033` | P1 | Design/Media/Assistant panels | `Auto PASS 2026-07-22` | Design quay về page sections, Media có Upload/empty library, Assistant có diff-preview copy và `Send` disabled khi chưa nhập. |
| `TC-BUILDER-034` | P0 | Duplicate/Undo/Redo/Delete/Discard section | `Auto PASS 2026-07-22` | Duplicate tạo draft, Undo/Redo đổi đúng state, Delete section đưa count về baseline, Discard cleanup sạch draft. |
| `TC-BUILDER-035` | P1 | Icon buttons đạt target size tối thiểu | `Auto PASS 2026-07-22` | Đo toolbar, rail, help, duplicate/delete section controls; không có button nào dưới 24x24px. |
| `TC-BUILDER-036` | P0 | Content tab hiển thị field editable | `Auto PASS 2026-07-22` | Chọn Hero section và verify Content tab có inputs/textareas/selects cho Eyebrow, Headline, Tagline, CTA... |
| `TC-BUILDER-037` | P1 | Data tab hướng dẫn binding source | `Auto PASS 2026-07-22` | Data tab hiển thị workflow add Collection/pick Source/bind field và source thật `riffables`, `riffs`, `articles`. |
| `TC-BUILDER-038` | P1 | Theme tab có style controls hợp lệ | `Auto PASS 2026-07-22` | Verify color swatch/text field, spacing, font controls; không expose arbitrary style editor. |
| `TC-BUILDER-039` | P1 | Theme edit tạo draft và discard cleanup | `Auto PASS 2026-07-22` | Sửa tạm `Page background`, thấy `Discard`, confirm cleanup draft thành công. |
| `TC-BUILDER-040` | P1 | Media panel upload constraints | `Auto PASS 2026-07-22` | Media panel có Upload/empty state; file input accept PNG/JPEG/WebP/GIF và multiple upload. |
| `TC-BUILDER-041` | P1 | Assistant prompt enable Send | `Auto PASS 2026-07-22` | Empty prompt thì `Send` disabled; nhập prompt thì `Send` enabled, chưa tạo draft khi chưa gửi. |
| `TC-BUILDER-042` | P1 | Help tour editor mở và điều hướng được | `Auto PASS 2026-07-22` | Help tour mở step `1 of 6`, Next sang `2 of 6`, Back về `1 of 6`, đóng được. |

## Console / Home / A11Y / Onboarding

| ID | Priority | Tên testcase tiếng Việt | Kết quả automation | Ghi chú đọc nhanh |
| --- | --- | --- | --- | --- |
| `TC-CONSOLE-003` | P1 | Các workflow creator chính truy cập được | `Auto PASS 2026-07-16` | Navigate dashboard/Sources/Content/Site/Builder nếu có. |
| `TC-CONSOLE-009` | P1 | Refresh route vẫn giữ đúng section hiện tại | `Auto PASS 2026-07-16` | Nav state/page title/main content ổn định sau refresh. |
| `TC-CONSOLE-011` | P1 | Top-level console navigation | `Auto PASS 2026-07-16` | Home, Sources, Content, Sites load đúng tenant, không redirect auth. |
| `TC-CONSOLE-023` | P1 | Home Overview hiện 4 summary modules cơ bản | `Auto PASS 2026-07-16` | Sources, Riffs, Articles, Site module visible. |
| `TC-CONSOLE-024` | P1 | Home Overview summary modules điều hướng đúng trang | `Auto PASS 2026-07-16` | Click module -> `/sources`, `/content`, `/sites` đúng tenant. |
| `TC-CONSOLE-025` | P1 | Home Next step CTA route đến Sources workflow | `Auto PASS 2026-07-16` | CTA Open sources/recommendation đưa đến `/sources`. |
| `TC-CONSOLE-026` | P2 | Home How it works hiện đúng core workflow | `Auto PASS 2026-07-16` | 3 bước: connect source, extract ideas, publish library/site. |
| `TC-A11Y-005` | P1 | Mỗi screen có heading structure hợp lý | `Auto PASS 2026-07-16` | Kiểm tra h1/heading order cơ bản. |
| `TC-ONBOARD-007` | P1 | Lần authenticated đầu tiên hỏi user mới/cũ | `Auto PASS 2026-07-16` | Onboarding consent dialog có choice cho new/returning user. |

## Các Điểm Cần Lưu Ý Khi QA Review

1. `TC-SOURCE-045` và `TC-CATALOG-005` đã pass về exact selected/unselected: chỉ item được chọn vào pipeline, item không chọn không bị ingest nhầm.
2. `No insights` sau khi ingest không phải bug của 2 case trên. Nó chỉ nói rằng video đã xử lý xong nhưng không tạo riffable/insight. Nếu muốn test AI tạo insight thành công, cần testcase/fixture riêng có expected `Riffed` hoặc generated insight.
3. Google OAuth hiện là boundary lớn nhất: các case full connect Auto/Manual vẫn bị blocked nếu không có manual consent, storage state, hoặc staging bypass.
4. Các case partial về crawl/backfill/catalog cần thêm backend observability hoặc fixture có state `Processing`, `Riffed`, long-running crawl, large/backfill.
5. Các `EXPECTED FAIL` là bug/behavior hiện tại của staging về validation input source: automation đang ghi nhận để dev fix sau.
6. Public site batch đã chuyển `TC-PUBLIC-009` từ skip sang pass nhờ URL Sunday thật.
7. `TC-PUBLIC-014` đang expected-fail vì public page còn hiện placeholder/demo labels; đây là gap cần dev/product xác nhận hoặc fix.
8. `TC-PUBLIC-005`, `TC-PUBLIC-002`, `TC-PUBLIC-016` chưa pass vì thiếu clickable citation timestamp hoặc Tenant B public fixture.
