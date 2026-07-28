import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT_INPUT = "qa-ai-workflow/test-cases/riffables-master.test-cases.md";
const DEFAULT_OUTPUT = "qa-ai-workflow/test-cases/exports/riffables-master.test-cases.vi.xlsx";

const COLUMN_HEADERS_VI = [
  "Phân hệ",
  "Mã ca kiểm thử",
  "Mã yêu cầu",
  "Luồng kiểm thử",
  "Loại kiểm thử",
  "Độ ưu tiên",
  "Tiền điều kiện",
  "Dữ liệu kiểm thử",
  "Các bước kiểm thử",
  "Kết quả mong đợi",
  "Có thể tự động hóa",
  "Trạng thái",
];

const ORIGINAL_HEADERS = [
  "Phân hệ",
  "ID",
  "Requirement IDs",
  "Workflow",
  "Type",
  "Priority",
  "Preconditions",
  "Test Data",
  "Test Steps",
  "Expected Result",
  "Automation Candidate",
  "Status",
];

const CONTROL_VALUE_MAP = new Map([
  ["Positive", "Tích cực"],
  ["Negative", "Tiêu cực"],
  ["Boundary", "Biên"],
  ["Security", "Bảo mật"],
  ["Smoke", "Smoke"],
  ["Functional", "Chức năng"],
  ["Regression", "Regression"],
  ["Integration", "Tích hợp"],
  ["UI", "UI"],
  ["UX", "UX"],
  ["A11Y", "Accessibility"],
  ["Accessibility", "Accessibility"],
  ["Data Integrity", "Toàn vẹn dữ liệu"],
  ["Resilience", "Khả năng phục hồi"],
  ["Configuration", "Cấu hình"],
  ["Non-functional", "Phi chức năng"],
  ["AI Validation", "Kiểm thử AI"],
  ["Search Validation", "Kiểm thử search"],
  ["API", "API"],
  ["AI UI", "UI AI"],
  ["Manual only", "Chỉ manual"],
  ["Manual/Gated", "Manual/Gated"],
  ["Manual + smoke", "Manual + smoke"],
  ["Later", "Làm sau"],
  ["Yes", "Có"],
  ["No", "Không"],
  ["Draft", "Nháp"],
]);

const PHRASES = [
  ["authenticated creator console", "console creator đã đăng nhập"],
  ["authenticated creator", "creator đã đăng nhập"],
  ["authenticated session", "session đã đăng nhập"],
  ["signed-out browser session", "phiên trình duyệt chưa đăng nhập"],
  ["signed out browser session", "phiên trình duyệt chưa đăng nhập"],
  ["signed-out user", "người dùng chưa đăng nhập"],
  ["signed out user", "người dùng chưa đăng nhập"],
  ["not authenticated", "chưa đăng nhập"],
  ["protected console data", "dữ liệu console được bảo vệ"],
  ["protected route", "route được bảo vệ"],
  ["account existence", "sự tồn tại của account"],
  ["existing organization", "organization có sẵn"],
  ["existing workspace", "workspace có sẵn"],
  ["selected tenant", "tenant đã chọn"],
  ["tenant workspace", "workspace tenant"],
  ["workspace selector", "bộ chọn workspace"],
  ["organization setup", "setup organization"],
  ["setup organization", "setup organization"],
  ["account settings", "Account Settings"],
  ["sign-in methods", "phương thức đăng nhập"],
  ["sign in methods", "phương thức đăng nhập"],
  ["forgot password", "quên mật khẩu"],
  ["change password", "đổi mật khẩu"],
  ["add a password", "thêm mật khẩu"],
  ["reset-password", "reset-password"],
  ["reset password", "reset mật khẩu"],
  ["password reset", "reset mật khẩu"],
  ["password-change", "đổi mật khẩu"],
  ["email/password", "email/password"],
  ["google sign-in", "đăng nhập Google"],
  ["google oauth", "Google OAuth"],
  ["google consent", "Google consent"],
  ["continue with google", "Continue with Google"],
  ["betterauth", "BetterAuth"],
  ["trusted origins", "trusted origins"],
  ["invalid redirecturl", "Invalid redirectURL"],
  ["valid direct email/password creator account", "account creator email/password trực tiếp hợp lệ"],
  ["valid creator email", "email creator hợp lệ"],
  ["wrong password", "mật khẩu sai"],
  ["unknown email", "email không tồn tại"],
  ["blank form", "form trống"],
  ["generic error", "lỗi generic"],
  ["safe generic validation", "validation generic an toàn"],
  ["no authenticated session is created", "không tạo session đăng nhập"],
  ["protected routes still redirect", "route được bảo vệ vẫn redirect"],
  ["open", "mở"],
  ["click", "bấm"],
  ["enter", "nhập"],
  ["verify", "kiểm tra"],
  ["wait for", "chờ"],
  ["observe", "quan sát"],
  ["inspect", "kiểm tra"],
  ["attempt to", "thử"],
  ["repeat", "lặp lại"],
  ["refresh", "refresh"],
  ["submit", "submit"],
  ["select", "chọn"],
  ["navigate to", "đi tới"],
  ["return to", "quay lại"],
  ["record", "ghi lại"],
  ["compare", "so sánh"],
  ["confirm", "xác nhận"],
  ["use", "dùng"],
  ["load", "load"],
  ["loads", "load"],
  ["loaded", "đã load"],
  ["available", "có sẵn"],
  ["visible", "hiển thị"],
  ["appears", "xuất hiện"],
  ["displayed", "hiển thị"],
  ["shows", "hiển thị"],
  ["shown", "hiển thị"],
  ["is shown", "được hiển thị"],
  ["is visible", "hiển thị"],
  ["is available", "có sẵn"],
  ["is rejected", "bị từ chối"],
  ["are rejected", "bị từ chối"],
  ["is blocked", "bị chặn"],
  ["are blocked", "bị chặn"],
  ["is created", "được tạo"],
  ["are created", "được tạo"],
  ["is not created", "không được tạo"],
  ["does not create", "không tạo"],
  ["cannot access", "không thể truy cập"],
  ["can access", "có thể truy cập"],
  ["can select", "có thể chọn"],
  ["can sign in", "có thể đăng nhập"],
  ["can sign out", "có thể đăng xuất"],
  ["sign in", "đăng nhập"],
  ["sign out", "đăng xuất"],
  ["logged in", "đã đăng nhập"],
  ["login", "login"],
  ["log in", "đăng nhập"],
  ["logout", "logout"],
  ["user", "người dùng"],
  ["creator", "creator"],
  ["operator", "operator"],
  ["visitor", "visitor"],
  ["tenant", "tenant"],
  ["workspace", "workspace"],
  ["organization", "organization"],
  ["source", "source"],
  ["sources", "sources"],
  ["content", "content"],
  ["site", "site"],
  ["public site", "public site"],
  ["published public site", "public site đã publish"],
  ["library", "library"],
  ["image", "ảnh"],
  ["images", "ảnh"],
  ["upload", "upload"],
  ["uploads", "upload"],
  ["uploaded", "đã upload"],
  ["file", "file"],
  ["files", "file"],
  ["public url", "public URL"],
  ["permanent public url", "public URL vĩnh viễn"],
  ["duplicate", "duplicate"],
  ["duplicates", "duplicate"],
  ["de-duplicate", "de-duplicate"],
  ["label", "label"],
  ["alt text", "alt text"],
  ["pagination", "pagination"],
  ["newest first", "mới nhất trước"],
  ["soft remove", "soft remove"],
  ["remove", "xóa khỏi library"],
  ["removed", "đã xóa khỏi library"],
  ["embed", "embed"],
  ["embeds", "embed"],
  ["renders", "render"],
  ["rendering", "render"],
  ["tenant-scoped", "được scope theo tenant"],
  ["cross-tenant", "cross-tenant"],
  ["tenant isolation", "tenant isolation"],
  ["another tenant", "tenant khác"],
  ["another operator", "operator khác"],
  ["unauthorized", "không có quyền"],
  ["authorized", "có quyền"],
  ["role", "role"],
  ["admin", "Admin"],
  ["viewer", "Viewer"],
  ["editor", "Editor"],
  ["manual mode", "Manual mode"],
  ["auto mode", "Auto mode"],
  ["auto crawl", "Auto crawl"],
  ["manual selection", "Manual selection"],
  ["run crawl", "Run crawl"],
  ["backfill", "Backfill"],
  ["catalog", "catalog"],
  ["video", "video"],
  ["videos", "video"],
  ["transcript", "transcript"],
  ["transcription", "transcription"],
  ["extraction", "extraction"],
  ["riff", "Riff"],
  ["riffs", "Riffs"],
  ["riffable", "Riffable"],
  ["riffables", "Riffables"],
  ["article", "article"],
  ["articles", "article"],
  ["job", "job"],
  ["jobs", "job"],
  ["queue", "queue"],
  ["queued", "queued"],
  ["processing", "processing"],
  ["ready", "ready"],
  ["failed", "failed"],
  ["no insights", "no insights"],
  ["last run", "Last run"],
  ["last error", "Last error"],
  ["pipeline", "Pipeline"],
  ["search", "search"],
  ["search input", "ô search"],
  ["search results", "kết quả search"],
  ["result", "kết quả"],
  ["results", "kết quả"],
  ["keyword", "keyword"],
  ["semantic", "semantic"],
  ["exact", "exact"],
  ["quoted", "quoted"],
  ["citation", "citation"],
  ["timestamp", "timestamp"],
  ["golden dataset", "golden dataset"],
  ["golden query", "golden query"],
  ["expected result", "kết quả mong đợi"],
  ["expected text", "text mong đợi"],
  ["test data", "dữ liệu test"],
  ["precondition", "tiền điều kiện"],
  ["preconditions", "tiền điều kiện"],
  ["test steps", "các bước test"],
  ["workflow", "luồng kiểm thử"],
  ["status", "trạng thái"],
  ["priority", "độ ưu tiên"],
  ["positive", "tích cực"],
  ["negative", "tiêu cực"],
  ["boundary", "biên"],
  ["security", "bảo mật"],
  ["functional", "chức năng"],
  ["regression", "regression"],
  ["integration", "tích hợp"],
  ["data integrity", "toàn vẹn dữ liệu"],
  ["accessibility", "accessibility"],
  ["draft", "nháp"],
  ["blocked", "blocked"],
  ["skip", "skip"],
  ["pass", "pass"],
  ["fail", "fail"],
  ["partial", "partial"],
  ["safe", "an toàn"],
  ["clear", "rõ ràng"],
  ["correct", "đúng"],
  ["valid", "hợp lệ"],
  ["invalid", "không hợp lệ"],
  ["blank", "trống"],
  ["empty", "rỗng"],
  ["missing", "thiếu"],
  ["stale", "stale"],
  ["same", "cùng"],
  ["existing", "có sẵn"],
  ["new", "mới"],
  ["first", "đầu tiên"],
  ["direct", "trực tiếp"],
  ["route", "route"],
  ["path", "path"],
  ["page", "page"],
  ["screen", "màn hình"],
  ["modal", "modal"],
  ["button", "button"],
  ["field", "field"],
  ["input", "input"],
  ["form", "form"],
  ["error", "lỗi"],
  ["message", "message"],
  ["copy", "copy"],
  ["link", "link"],
  ["email", "email"],
  ["password", "mật khẩu"],
  ["session", "session"],
  ["cookie", "cookie"],
  ["local storage", "localStorage"],
  ["session storage", "sessionStorage"],
  ["backend", "backend"],
  ["frontend", "frontend"],
  ["api", "API"],
  ["ui", "UI"],
  ["browser", "trình duyệt"],
  ["chrome", "Chrome"],
  ["desktop", "desktop"],
  ["mobile", "mobile"],
  ["keyboard", "keyboard"],
  ["focus", "focus"],
  ["heading", "heading"],
  ["landmark", "landmark"],
  ["aria", "ARIA"],
  ["target size", "target size"],
  ["show password", "Show password"],
  ["hide password", "Hide password"],
];

PHRASES.push(...[
  ["logs in successfully", "đăng nhập thành công"],
  ["logs in", "đăng nhập"],
  ["lands in", "được chuyển đến"],
  ["land in", "được chuyển đến"],
  ["treated as", "được xem là"],
  ["such as", "chẳng hạn như"],
  ["according to", "theo"],
  ["at least", "ít nhất"],
  ["as a", "với vai trò"],
  ["as an", "với vai trò"],
  ["sign in", "đăng nhập"],
  ["sign out", "đăng xuất"],
  ["signed in", "đã đăng nhập"],
  ["signed out", "đã đăng xuất"],
  ["first-time", "lần đầu"],
  ["post-login", "sau đăng nhập"],
  ["is not", "không"],
  ["are not", "không"],
  ["does not", "không"],
  ["do not", "không"],
  ["must not", "không được"],
  ["should not", "không nên"],
  ["cannot be", "không thể"],
  ["can be", "có thể"],
  ["has been", "đã được"],
  ["have been", "đã được"],
  ["is available", "có sẵn"],
  ["are available", "có sẵn"],
  ["is enabled", "được bật"],
  ["is disabled", "bị tắt"],
  ["is created", "được tạo"],
  ["are created", "được tạo"],
  ["is displayed", "được hiển thị"],
  ["is exposed", "bị lộ"],
  ["is persisted", "được lưu"],
  ["is rejected", "bị từ chối"],
  ["is blocked", "bị chặn"],
  ["is required", "là bắt buộc"],
  ["remains on", "vẫn ở"],
  ["remain on", "vẫn ở"],
  ["remains gated", "vẫn bị chặn"],
  ["remain gated", "vẫn bị chặn"],
  ["is scoped to", "được giới hạn trong"],
  ["in progress", "đang xử lý"],
  ["no longer", "không còn"],
  ["rather than", "thay vì"],
  ["without requiring", "mà không yêu cầu"],
  ["for example", "ví dụ"],
  ["and/or", "và/hoặc"],
  ["that tenant", "tenant đó"],
  ["multi-tenant", "nhiều tenant"],
]);
const EXACT_TRANSLATIONS = new Map([
  ["P0: Foundation Smoke - Authentication And Source Connection", "P0: Kiểm thử nhanh nền tảng - Xác thực và kết nối nguồn"],
  ["P0: Tenant Security", "P0: Bảo mật tenant"],
  ["P0: Ingestion Pipeline", "P0: Quy trình nạp dữ liệu"],
  ["P0: Controlled Ingestion - Ingest Mode", "P0: Nạp dữ liệu có kiểm soát - Chế độ nạp"],
  ["P0: Controlled Ingestion - Catalog", "P0: Nạp dữ liệu có kiểm soát - Danh mục"],
  ["P0: Controlled Ingestion - Crawl And Processing", "P0: Nạp dữ liệu có kiểm soát - Thu thập và xử lý"],
  ["P0: AI Extraction, Citation, And Re-extraction", "P0: Trích xuất AI, trích dẫn và trích xuất lại"],
  ["P0: Search And Public Site", "P0: Tìm kiếm và trang công khai"],
  ["P1: Creator Console", "P1: Bảng điều khiển nhà sáng tạo"],
  ["P1: Theme Customization", "P1: Tùy chỉnh giao diện"],
  ["P1: Accessibility And UX", "P1: Khả năng tiếp cận và trải nghiệm người dùng"],
  ["P2: Site Builder And Onboarding Regression", "P2: Hồi quy trình tạo trang và hướng dẫn ban đầu"],
]);

const WORD_TRANSLATIONS = new Map(Object.entries({
  and: "và", or: "hoặc", the: "", a: "một", an: "một", is: "là", are: "là", was: "đã", were: "đã", be: "được", been: "được", being: "đang",
  to: "để", of: "của", for: "cho", from: "từ", in: "trong", on: "trên", at: "tại", by: "bởi", with: "với", without: "không có", within: "trong phạm vi", into: "vào", through: "thông qua", under: "dưới", above: "ở trên", below: "ở dưới", across: "trên toàn bộ", between: "giữa", against: "so với", per: "mỗi",
  not: "không", no: "không", only: "chỉ", if: "nếu", when: "khi", while: "trong khi", before: "trước khi", after: "sau khi", until: "cho đến khi", unless: "trừ khi", then: "sau đó", than: "hơn", so: "vì vậy", but: "nhưng", that: "đó", this: "này", these: "các mục này", those: "các mục đó", it: "nó", its: "của nó", each: "mỗi", every: "mọi", all: "tất cả", any: "bất kỳ", both: "cả hai", another: "khác", same: "cùng", such: "như vậy", more: "thêm", least: "ít nhất", most: "nhiều nhất",
  has: "có", have: "có", had: "đã có", can: "có thể", cannot: "không thể", could: "có thể", should: "nên", must: "phải", may: "có thể", might: "có thể", will: "sẽ", would: "sẽ", does: "", do: "thực hiện", did: "đã thực hiện",
  user: "người dùng", users: "người dùng", creator: "nhà sáng tạo", creators: "nhà sáng tạo", visitor: "khách truy cập", operator: "người vận hành", member: "thành viên", viewer: "người xem", admin: "quản trị viên", owner: "chủ sở hữu", audience: "đối tượng người xem",
  source: "nguồn", sources: "các nguồn", site: "trang", sites: "các trang", public: "công khai", content: "nội dung", catalog: "danh mục", library: "thư viện", channel: "kênh", channels: "các kênh", video: "video", videos: "các video", media: "phương tiện", article: "bài viết", articles: "các bài viết", image: "hình ảnh", images: "các hình ảnh", asset: "tài nguyên", assets: "các tài nguyên", collection: "bộ sưu tập", feed: "nguồn cấp dữ liệu", podcast: "podcast",
  state: "trạng thái", states: "các trạng thái", status: "trạng thái", mode: "chế độ", type: "loại", types: "các loại", value: "giá trị", values: "các giá trị", data: "dữ liệu", metadata: "siêu dữ liệu", field: "trường", fields: "các trường", row: "dòng", rows: "các dòng", item: "mục", items: "các mục", count: "số lượng", counts: "các số lượng", total: "tổng", limit: "giới hạn", size: "kích thước", name: "tên", title: "tiêu đề", label: "nhãn", labels: "các nhãn", text: "văn bản", date: "ngày", timestamp: "mốc thời gian", path: "đường dẫn", route: "đường dẫn", routes: "các đường dẫn", context: "ngữ cảnh", scope: "phạm vi", section: "phần", sections: "các phần", area: "khu vực", detail: "chi tiết", details: "các chi tiết", summary: "tóm tắt",
  page: "trang", screen: "màn hình", modal: "hộp thoại", dialog: "hộp thoại", panel: "bảng", card: "thẻ", cards: "các thẻ", button: "nút", input: "ô nhập", form: "biểu mẫu", tab: "tab", menu: "trình đơn", sidebar: "thanh bên", toolbar: "thanh công cụ", heading: "tiêu đề", hero: "khu vực đầu trang", rail: "thanh điều hướng", canvas: "khung thiết kế", viewport: "khung nhìn", widget: "thành phần", element: "phần tử", layout: "bố cục", theme: "giao diện", style: "kiểu hiển thị", color: "màu sắc", focus: "tiêu điểm", keyboard: "bàn phím",
  editor: "trình chỉnh sửa", builder: "trình tạo", assistant: "trợ lý", console: "bảng điều khiển", dashboard: "bảng tổng quan", overview: "tổng quan", home: "trang chủ", settings: "cài đặt", account: "tài khoản", accounts: "các tài khoản", organization: "tổ chức", workspaces: "các workspace", role: "vai trò", permission: "quyền", provider: "nhà cung cấp", configuration: "cấu hình", config: "cấu hình", environment: "môi trường", domain: "tên miền", subdomain: "tên miền phụ", host: "máy chủ", service: "dịch vụ", system: "hệ thống", product: "sản phẩm", client: "máy khách", backend: "hệ thống phía máy chủ", frontend: "giao diện phía người dùng",
  authentication: "xác thực", authenticated: "đã xác thực", unauthenticated: "chưa xác thực", login: "đăng nhập", logout: "đăng xuất", session: "phiên đăng nhập", token: "mã xác thực", consent: "sự đồng ý", callback: "lệnh gọi lại", redirect: "chuyển hướng", redirected: "được chuyển hướng", origin: "nguồn gốc", storage: "bộ nhớ", password: "mật khẩu", email: "email", credential: "thông tin đăng nhập", credentials: "thông tin đăng nhập", masked: "được che", expired: "hết hạn", revoked: "bị thu hồi", protected: "được bảo vệ", restricted: "bị hạn chế", unauthorized: "không được phép", authorized: "được phép", access: "quyền truy cập", accessible: "có thể truy cập", visibility: "khả năng hiển thị", isolation: "cách ly", security: "bảo mật",
  connection: "kết nối", connected: "đã kết nối", connect: "kết nối", disconnected: "đã ngắt kết nối", selected: "đã chọn", selectable: "có thể chọn", selection: "lựa chọn", controlled: "có kiểm soát", configured: "đã cấu hình", active: "đang hoạt động", inactive: "không hoạt động", enabled: "được bật", disabled: "bị tắt", supported: "được hỗ trợ", unsupported: "không được hỗ trợ", available: "có sẵn", unavailable: "không có sẵn", present: "hiện diện", absent: "không có", existing: "hiện có", current: "hiện tại", previous: "trước đó", recent: "gần đây", latest: "mới nhất", fresh: "mới", stale: "cũ", unchanged: "không đổi", changed: "đã thay đổi", new: "mới", old: "cũ", unique: "duy nhất", duplicate: "trùng lặp",
  crawl: "thu thập dữ liệu", crawled: "đã thu thập dữ liệu", crawling: "đang thu thập dữ liệu", ingest: "nạp dữ liệu", ingested: "đã nạp dữ liệu", ingestion: "quá trình nạp dữ liệu", extraction: "trích xuất", extracted: "đã trích xuất", processing: "đang xử lý", processed: "đã xử lý", transcript: "bản ghi lời nói", transcription: "chuyển lời nói thành văn bản", insight: "thông tin chuyên sâu", insights: "các thông tin chuyên sâu", citation: "trích dẫn", quote: "đoạn trích", semantic: "ngữ nghĩa", keyword: "từ khóa", query: "truy vấn", result: "kết quả", results: "các kết quả", search: "tìm kiếm", ranking: "xếp hạng", pipeline: "quy trình xử lý", queue: "hàng đợi", queued: "đang chờ", job: "tác vụ", jobs: "các tác vụ", worker: "tiến trình xử lý", backfill: "nạp dữ liệu lịch sử", batch: "lô", schedule: "lịch", scheduled: "đã lên lịch", cancellation: "việc hủy", cancel: "hủy", retry: "thử lại", progress: "tiến độ", lifecycle: "vòng đời", observability: "khả năng giám sát", downstream: "phía sau trong quy trình",
  open: "mở", opens: "mở", opened: "đã mở", close: "đóng", start: "bắt đầu", starts: "bắt đầu", submit: "gửi", submitted: "đã gửi", save: "lưu", saved: "đã lưu", create: "tạo", creates: "tạo", created: "được tạo", add: "thêm", edit: "chỉnh sửa", edits: "các chỉnh sửa", update: "cập nhật", updates: "các cập nhật", delete: "xóa", remove: "xóa", restore: "khôi phục", discard: "hủy bỏ", select: "chọn", selecting: "đang chọn", switch: "chuyển đổi", switching: "đang chuyển đổi", toggle: "bật hoặc tắt", change: "thay đổi", changing: "đang thay đổi", refresh: "tải lại", reload: "tải lại", return: "quay lại", returns: "quay lại", back: "quay lại", continue: "tiếp tục", press: "nhấn", enter: "nhập", display: "hiển thị", displays: "hiển thị", show: "hiển thị", shows: "hiển thị", appear: "xuất hiện", appears: "xuất hiện", hide: "ẩn", hidden: "bị ẩn", load: "tải", render: "hiển thị", rendered: "đã hiển thị", visit: "truy cập", locate: "xác định", reach: "truy cập", reachable: "có thể truy cập",
  check: "kiểm tra", verify: "xác minh", verified: "đã xác minh", inspect: "kiểm tra", inspected: "đã kiểm tra", observe: "quan sát", observed: "đã quan sát", compare: "so sánh", match: "khớp", matches: "khớp", matching: "khớp", contain: "chứa", contains: "chứa", include: "bao gồm", includes: "bao gồm", expose: "làm lộ", exposes: "làm lộ", exposed: "bị lộ", preserve: "giữ nguyên", preserves: "giữ nguyên", preserved: "được giữ nguyên", persist: "duy trì", persists: "được duy trì", persisted: "được lưu", reflect: "phản ánh", reflects: "phản ánh", explain: "giải thích", explains: "giải thích", follow: "tuân theo", follows: "tuân theo", handle: "xử lý", handles: "xử lý", handled: "được xử lý", resolve: "giải quyết", reject: "từ chối", rejects: "từ chối", rejected: "bị từ chối", accept: "chấp nhận", accepts: "chấp nhận", accepted: "được chấp nhận", allow: "cho phép", allowed: "được phép", block: "chặn", blocks: "chặn", blocked: "bị chặn", require: "yêu cầu", requires: "yêu cầu", required: "bắt buộc", support: "hỗ trợ", supports: "hỗ trợ", enable: "bật", enables: "cho phép", prevent: "ngăn chặn", prevent: "ngăn chặn", refuse: "từ chối", refused: "bị từ chối",
  run: "chạy", runs: "chạy", running: "đang chạy", complete: "hoàn tất", completed: "đã hoàn tất", completion: "việc hoàn tất", succeed: "thành công", succeeds: "thành công", successful: "thành công", successfully: "thành công", fail: "không đạt", fails: "không đạt", failed: "không đạt", failure: "lỗi", pass: "đạt", partial: "một phần", pending: "đang chờ", done: "hoàn tất", ready: "sẵn sàng", attempt: "lần thử", attempted: "đã thử", simulate: "mô phỏng", simulated: "được mô phỏng", trigger: "kích hoạt", generated: "được tạo", generate: "tạo", reset: "đặt lại", reextract: "trích xuất lại", replay: "chạy lại", sync: "đồng bộ", inject: "chèn", mutate: "thay đổi dữ liệu", mutation: "thao tác thay đổi dữ liệu", bind: "liên kết", binding: "liên kết", publish: "xuất bản", published: "đã xuất bản", publishing: "việc xuất bản", unpublished: "chưa xuất bản", upload: "tải lên", embed: "nhúng",
  validation: "xác thực dữ liệu", behavior: "hành vi", policy: "chính sách", rule: "quy tắc", expected: "mong đợi", actual: "thực tế", known: "đã biết", unknown: "không xác định", valid: "hợp lệ", invalid: "không hợp lệ", correct: "đúng", wrong: "sai", safe: "an toàn", safely: "một cách an toàn", unsafe: "không an toàn", clear: "rõ ràng", clearly: "rõ ràng", explicit: "rõ ràng", explicitly: "một cách rõ ràng", exact: "chính xác", consistent: "nhất quán", consistently: "nhất quán", equivalent: "tương đương", applicable: "phù hợp", relevant: "liên quan", intended: "dự kiến", possible: "có thể", stable: "ổn định", fixed: "cố định", temporary: "tạm thời", permanent: "vĩnh viễn", transient: "tạm thời", malformed: "sai định dạng", misleading: "gây hiểu nhầm", sanitized: "đã làm sạch", malicious: "độc hại", weak: "yếu", bounded: "có giới hạn", eligible: "đủ điều kiện", applicable: "áp dụng được", approved: "được phê duyệt", agreed: "đã thống nhất", confirmed: "đã xác nhận", prepared: "đã chuẩn bị", controlled: "có kiểm soát",
  test: "kiểm thử", smoke: "kiểm thử nhanh", regression: "hồi quy", manual: "thủ công", automatic: "tự động", automation: "tự động hóa", fixture: "dữ liệu mẫu", fixtures: "các dữ liệu mẫu", dataset: "bộ dữ liệu", baseline: "mốc chuẩn", golden: "chuẩn đối chiếu", case: "trường hợp", flow: "luồng", step: "bước", steps: "các bước", scenario: "kịch bản", choice: "lựa chọn", choices: "các lựa chọn", option: "tùy chọn", options: "các tùy chọn", action: "thao tác", actions: "các thao tác", control: "điều khiển", controls: "các điều khiển", indicator: "chỉ báo", threshold: "ngưỡng", tolerance: "dung sai", response: "phản hồi", request: "yêu cầu", requests: "các yêu cầu", output: "đầu ra", feedback: "phản hồi", guidance: "hướng dẫn", tour: "hướng dẫn tham quan", tours: "các hướng dẫn tham quan", setup: "thiết lập", onboarding: "hướng dẫn ban đầu", accessibility: "khả năng tiếp cận", customization: "tùy chỉnh", curation: "biên tập", navigation: "điều hướng", creation: "việc tạo", confirmation: "xác nhận", verification: "xác minh", recovery: "khôi phục", handling: "cách xử lý", observability: "khả năng giám sát", preview: "xem trước", review: "xem xét", help: "trợ giúp", copy: "nội dung", phrase: "cụm từ", wording: "cách diễn đạt", concept: "khái niệm", design: "thiết kế", metric: "chỉ số", metrics: "các chỉ số", core: "cốt lõi", main: "chính", final: "cuối cùng", real: "thực", live: "đang hoạt động", interactive: "tương tác", static: "tĩnh", dynamic: "động", large: "lớn", small: "nhỏ", zero: "không", multiple: "nhiều", several: "một số", one: "một", two: "hai", first: "đầu tiên", last: "cuối cùng", next: "tiếp theo", order: "thứ tự", future: "tương lai", full: "đầy đủ", minimum: "tối thiểu", maximum: "tối đa", local: "cục bộ", directly: "trực tiếp", immediately: "ngay lập tức", repeatedly: "lặp lại", already: "đã", currently: "hiện tại", previously: "trước đó", newly: "mới", again: "lại", once: "một lần", instead: "thay vào đó", separately: "riêng biệt", together: "cùng nhau", according: "theo", using: "bằng cách dùng", used: "được dùng", needed: "cần thiết", remaining: "còn lại", returned: "được trả về", stored: "được lưu", applied: "được áp dụng", applies: "áp dụng", available: "có sẵn", searchable: "có thể tìm kiếm", editable: "có thể chỉnh sửa", bindable: "có thể liên kết", fused: "được kết hợp", intended: "dự kiến", clean: "sạch", disposable: "dùng một lần", lowerprivilege: "quyền thấp", cross: "chéo", server: "máy chủ", side: "phía", clientside: "phía máy khách", serverside: "phía máy chủ", entrypoint: "điểm truy cập", affordance: "dấu hiệu thao tác", drag: "kéo", undo: "hoàn tác", redo: "làm lại", alt: "văn bản thay thế", speaker: "người nói", audio: "âm thanh", phrase: "cụm từ"
}));

const EXTRA_WORD_TRANSLATIONS = {
  as: "như", logs: "đăng nhập", log: "đăng nhập", lands: "được chuyển đến", land: "được chuyển đến", exists: "tồn tại", exist: "tồn tại", remains: "vẫn", remain: "vẫn", stays: "vẫn ở", stay: "ở lại", becomes: "trở thành", become: "trở thành",
  get: "nhận", gets: "nhận", got: "đã nhận", build: "tạo", builds: "tạo", spend: "tiêu tốn", itself: "chính nó", avoid: "tránh", avoids: "tránh", removal: "việc xóa", simulation: "mô phỏng", seeded: "được tạo sẵn", seed: "tạo sẵn", assumed: "được giả định", mocked: "được mô phỏng", mock: "mô phỏng",
  link: "liên kết", links: "các liên kết", prompt: "lời nhắc", prompts: "các lời nhắc", list: "danh sách", lists: "liệt kê", manual: "thủ công", regression: "hồi quy", smoke: "kiểm thử nhanh", target: "mục tiêu", targets: "các mục tiêu", auth: "xác thực", gated: "bị chặn", gate: "chặn", view: "xem", views: "các chế độ xem", work: "hoạt động", works: "hoạt động", diff: "phần thay đổi", non: "không", success: "thành công", filter: "lọc", filters: "các bộ lọc", time: "thời gian", records: "các bản ghi", record: "bản ghi", riffed: "đã tạo Riff", long: "dài", file: "tệp", files: "các tệp", repeated: "lặp lại", inspector: "bảng thuộc tính", module: "mô-đun", modules: "các mô-đun", out: "ra ngoài", lower: "thấp hơn", republish: "xuất bản lại", none: "không có", recommended: "được đề xuất", recommendation: "đề xuất", recommendations: "các đề xuất", primary: "chính", moves: "chuyển", move: "chuyển", revisit: "truy cập lại", removed: "đã xóa", font: "phông chữ", tag: "thẻ", payload: "dữ liệu gửi", payloads: "các dữ liệu gửi", handler: "trình xử lý", handlers: "các trình xử lý", structure: "cấu trúc", outline: "cấu trúc", major: "chính", choose: "chọn", keys: "các khóa", key: "khóa", scrolls: "cuộn", scroll: "cuộn", previewable: "có thể xem trước", highlights: "làm nổi bật", highlight: "làm nổi bật", hover: "di chuột", templates: "các mẫu", template: "mẫu", drop: "thả", slot: "vị trí", guided: "được hướng dẫn", mixed: "bị trộn", single: "duy nhất", incomplete: "chưa đầy đủ", disappears: "biến mất", disappear: "biến mất",
  disable: "tắt", land: "được chuyển đến", linked: "được liên kết", cancelled: "đã hủy", canceled: "đã hủy", denied: "bị từ chối", deny: "từ chối", simulator: "trình mô phỏng", recoverable: "có thể khôi phục", says: "cho biết", sent: "đã gửi", submissions: "các lần gửi", submission: "lần gửi", second: "thứ hai", address: "địa chỉ", dash: "dấu gạch ngang", separated: "được phân tách", letters: "chữ cái", letter: "chữ cái", numbers: "chữ số", number: "chữ số", reads: "hiển thị", read: "đọc", capture: "ghi nhận", enforces: "bắt buộc", enforce: "bắt buộc", short: "ngắn", respects: "tuân theo", trusted: "đáng tin cậy", localhost: "máy cục bộ", engineering: "nhóm kỹ thuật", mandatory: "bắt buộc", keep: "giữ", bypassed: "được bỏ qua", bypass: "bỏ qua", private: "riêng tư", now: "hiện tại", nonexistent: "không tồn tại", some: "một số", they: "các mục đó", health: "tình trạng", away: "ra khỏi", either: "một trong hai", performed: "được thực hiện", perform: "thực hiện", ensure: "đảm bảo", reusable: "có thể tái sử dụng",
  manage: "quản lý", manages: "quản lý", management: "quản lý", own: "riêng", owns: "sở hữu", ownership: "quyền sở hữu", discovered: "được phát hiện", discover: "phát hiện", budget: "ngân sách", outputs: "các đầu ra", modifier: "tùy chọn điều chỉnh", force: "bắt buộc", rerun: "chạy lại", reruns: "các lần chạy lại", import: "nhập", duration: "thời lượng", contract: "quy ước", needs: "cần", need: "cần", set: "bộ", sets: "các bộ", cadence: "chu kỳ", recently: "gần đây", newest: "mới nhất", updates: "cập nhật", update: "cập nhật", discovered: "được phát hiện", spend: "tiêu tốn",
  generic: "chung", safe: "an toàn", clean: "sạch", pointer: "con trỏ", measurable: "có thể đo", via: "thông qua", outline: "đường viền", shadow: "bóng", box: "hộp", logical: "hợp lý", confusing: "gây nhầm lẫn", regions: "các vùng", region: "vùng", level: "cấp", group: "nhóm", groups: "các nhóm", layer: "lớp", layers: "các lớp", losing: "làm mất", own: "riêng", short: "ngắn", entry: "mục", entries: "các mục", entrypoint: "điểm truy cập",
  method: "phương thức", methods: "các phương thức", social: "mạng xã hội", disable: "tắt", enabled: "được bật", denied: "bị từ chối", cancel: "hủy", account: "tài khoản", mailbox: "hộp thư", length: "độ dài", characters: "ký tự", character: "ký tự", points: "trỏ", point: "trỏ", deployed: "đã triển khai", configures: "cấu hình", configure: "cấu hình", mandatory: "bắt buộc",
  selectedingest: "nạp mục đã chọn", multiitem: "nhiều mục", rerun: "chạy lại", fresh: "mới", eligible: "đủ điều kiện", owner: "chủ sở hữu", verification: "xác minh", private: "riêng tư", handle: "tên định danh", preparatory: "chuẩn bị", handoff: "chuyển giao", handoffs: "các lần chuyển giao", marked: "được đánh dấu", health: "tình trạng", context: "ngữ cảnh", detail: "chi tiết", details: "các chi tiết", confirmation: "xác nhận", cancelling: "việc hủy", leaves: "giữ", left: "được giữ", dismissing: "đóng", reusable: "có thể tái sử dụng",
  where: "khi", yet: "chưa", eventually: "cuối cùng", however: "tuy nhiên", otherwise: "nếu không", whether: "liệu", because: "bởi vì", therefore: "do đó", also: "cũng", even: "ngay cả", very: "rất", own: "riêng", respective: "tương ứng", respective: "tương ứng", expected: "mong đợi", exactly: "chính xác", properly: "đúng cách", fully: "đầy đủ", partly: "một phần", always: "luôn", never: "không bao giờ"
};
for (const [word, translation] of Object.entries(EXTRA_WORD_TRANSLATIONS)) {
  WORD_TRANSLATIONS.set(word, translation);
}

WORD_TRANSLATIONS.set("terminates", "kết thúc");
WORD_TRANSLATIONS.set("terminate", "kết thúc");
WORD_TRANSLATIONS.set("dismissed", "được đóng");
WORD_TRANSLATIONS.set("dismiss", "đóng");
WORD_TRANSLATIONS.set("cached", "được lưu đệm");
WORD_TRANSLATIONS.set("cache", "bộ nhớ đệm");
WORD_TRANSLATIONS.set("belongs", "thuộc về");
WORD_TRANSLATIONS.set("belong", "thuộc về");
WORD_TRANSLATIONS.set("distinct", "riêng biệt");
WORD_TRANSLATIONS.set("multi", "nhiều");
WORD_TRANSLATIONS.set("existence", "sự tồn tại");
WORD_TRANSLATIONS.set("ending", "kết thúc");
CONTROL_VALUE_MAP.set("Smoke", "Kiểm thử nhanh");
CONTROL_VALUE_MAP.set("Regression", "Hồi quy");
CONTROL_VALUE_MAP.set("A11Y", "Khả năng tiếp cận");
CONTROL_VALUE_MAP.set("UI", "Giao diện người dùng");
CONTROL_VALUE_MAP.set("UX", "Trải nghiệm người dùng");
CONTROL_VALUE_MAP.set("Accessibility", "Khả năng tiếp cận");
CONTROL_VALUE_MAP.set("Manual only", "Chỉ thủ công");
CONTROL_VALUE_MAP.set("Manual/Gated", "Thủ công/Có điều kiện");
CONTROL_VALUE_MAP.set("Manual + smoke", "Thủ công + kiểm thử nhanh");
const MORE_WORD_TRANSLATIONS = `
re|lại
still|vẫn
sign|đăng nhập
chat|trò chuyện
default|mặc định
surface|giao diện
bound|được liên kết
up|lên
script|mã lệnh
terminal|kết thúc
use|sử dụng
icon|biểu tượng
sample|mẫu
usable|có thể sử dụng
flag|đánh dấu
forgot|quên
let|để
max|tối đa
suffix|hậu tố
call|gọi
endpoint|điểm cuối
fake|giả
inside|bên trong
reopen|mở lại
see|xem
selector|bộ chọn
variable|biến
effect|tác động
format|định dạng
stop|dừng
ask|yêu cầu
mismatch|không khớp
recurring|định kỳ
signed|đã đăng nhập
tamper|can thiệp trái phép
top|hàng đầu
unrelated|không liên quan
approve|phê duyệt
background|nền
during|trong khi
enough|đủ
event|sự kiện
find|tìm thấy
like|giống như
measure|đo
network|mạng
placeholder|nội dung giữ chỗ
platform|nền tảng
plus|cộng với
provide|cung cấp
separate|riêng biệt
space|khoảng trắng
actionable|có thể xử lý
arbitrary|tùy ý
attribution|ghi nhận nguồn
automated|được tự động hóa
badge|huy hiệu
browse|duyệt
bulk|hàng loạt
cancellable|có thể hủy
cite|trích dẫn
code|mã
communicate|thông báo
constraint|ràng buộc
crash|sự cố
decision|quyết định
enqueue|đưa vào hàng đợi
explanation|giải thích
frequency|tần suất
greater|lớn hơn
hallucinated|bịa đặt
hardcoded|được mã hóa cứng
honest|trung thực
indicate|cho biết
ineligible|không đủ điều kiện
internal|nội bộ
leave|rời khỏi
marker|dấu mốc
meet|đáp ứng
moment|thời điểm
numeric|dạng số
offline|ngoại tuyến
outside|bên ngoài
overlap|chồng lấn
populate|điền dữ liệu
rank|xếp hạng
register|đăng ký
restart|khởi động lại
retry|thử lại
reuse|tái sử dụng
silently|âm thầm
span|đoạn
special|đặc biệt
specific|cụ thể
statement|phát biểu
three|ba
timeout|hết thời gian
try|thử
unexpected|ngoài dự kiến
unexpectedly|ngoài dự kiến
unselected|chưa chọn
allowlist|danh sách cho phép
anonymous|ẩn danh
asking|yêu cầu
authenticate|xác thực
authorization|phân quyền
business|nghiệp vụ
cleanup|dọn dẹp
deletion|việc xóa
detect|phát hiện
document|ghi tài liệu
enumeration|liệt kê
exceed|vượt quá
fit|vừa vặn
generation|việc tạo
guard|bảo vệ
header|đầu trang
headline|tiêu đề chính
hit|vùng bấm
hook|điểm móc
index|lập chỉ mục
leak|làm lộ
many|nhiều
matrix|ma trận
meaningful|có ý nghĩa
modify|sửa đổi
navigate|điều hướng
occur|xảy ra
omit|bỏ qua
optional|tùy chọn
other|khác
over|vượt quá
parameter|tham số
post|sau
probe|kiểm tra thăm dò
produce|tạo ra
reversible|có thể hoàn tác
safety|an toàn
sensitive|nhạy cảm
sequence|thứ tự
symbol|ký hiệu
tampering|can thiệp trái phép
unpublish|gỡ xuất bản
uppercase|chữ hoa
word|từ
accurate|chính xác
accurately|chính xác
automatically|tự động
boundary|ranh giới
broken|bị hỏng
cap|giới hạn
central|trung tâm
claim|khẳng định
clarification|làm rõ
clickable|có thể bấm
connector|trình kết nối
corrupt|làm hỏng
coverage|độ bao phủ
declare|khai báo
different|khác nhau
early|sớm
eligibility|điều kiện
embedded|được nhúng
emit|phát ra
end|kết thúc
example|ví dụ
feature|tính năng
finish|hoàn thành
flight|đợt chạy
free|rảnh
identity|danh tính
increase|tăng
infer|suy luận
just|chỉ
larger|lớn hơn
later|sau đó
line|dòng
lowercase|chữ thường
map|ánh xạ
model|mô hình
observable|có thể quan sát
operable|có thể thao tác
original|gốc
playable|có thể phát
player|trình phát
publication|việc xuất bản
rate|tỷ lệ
recover|khôi phục
related|liên quan
replace|thay thế
report|báo cáo
resource|tài nguyên
reveal|làm lộ
revert|hoàn nguyên
setting|cài đặt
split|tách
standard|tiêu chuẩn
takeaway|ý chính
transition|chuyển trạng thái
unprocessed|chưa xử lý
useful|hữu ích
visually|trực quan
warning|cảnh báo
whitespace|khoảng trắng
alert|cảnh báo
alone|một mình
apply|áp dụng
band|dải
bio|tiểu sử
body|nội dung
branding|nhận diện thương hiệu
break|ngắt
broad|rộng
browsing|duyệt
canned|soạn sẵn
category|danh mục
conflict|xung đột
cover|bao phủ
critical|quan trọng
custom|tùy chỉnh
customizer|trình tùy chỉnh
distinguishable|có thể phân biệt
echo|phản hồi lặp
episode|tập
error|lỗi
extract|trích xuất
featured|nổi bật
filler|nội dung lấp chỗ
give|cung cấp
grandfathered|được giữ theo chính sách cũ
height|chiều cao
history|lịch sử
hyphen|dấu gạch nối
identical|giống hệt
identifiable|có thể nhận diện
ignore|bỏ qua
immediate|ngay lập tức
implementation|phần triển khai
information|thông tin
initial|ban đầu
injection|chèn dữ liệu
insert|chèn
intact|nguyên vẹn
interaction|tương tác
manifest|bản kê
manipulation|thao tác
measurement|phép đo
merge|gộp
monitor|giám sát
near|gần
oversize|quá kích thước
persistence|khả năng lưu
position|vị trí
pre|trước
preselect|chọn sẵn
prioritize|ưu tiên
propose|đề xuất
provide|cung cấp
punctuation|dấu câu
readable|dễ đọc
recommend|đề xuất
recreate|tạo lại
representative|đại diện
responsive|thích ứng
resume|tiếp tục
snippet|đoạn trích
spacing|khoảng cách
surfaced|được hiển thị
tablet|máy tính bảng
tagline|khẩu hiệu
take|thực hiện
tooling|công cụ
twice|hai lần
unfinished|chưa hoàn tất
usage|mức sử dụng
version|phiên bản
visual|trực quan
whole|toàn bộ
workflow|luồng công việc
about|về
acceptable|chấp nhận được
activate|kích hoạt
activity|hoạt động
additional|bổ sung
advance|nâng cao
agent|tác nhân
ambiguous|mơ hồ
application|ứng dụng
approach|cách tiếp cận
archive|lưu trữ
attribute|thuộc tính
availability|tính sẵn sàng
backoff|chờ tăng dần
base|cơ sở
border|đường viền
brand|thương hiệu
busy|bận
byte|byte
ceiling|giới hạn trên
checkbox|hộp kiểm
click|bấm
column|cột
consume|tiêu thụ
contrast|độ tương phản
cookie|cookie
dedicated|chuyên dụng
defaults|mặc định
delivery|phân phối
denial|từ chối
destructive|có tính phá hủy
devtools|công cụ phát triển
diagnostic|chẩn đoán
differ|khác nhau
discoverable|có thể phát hiện
establish|thiết lập
exfiltration|rò rỉ dữ liệu
exhaust|dùng hết
expiration|hết hạn
exposure|việc làm lộ
external|bên ngoài
extractable|có thể trích xuất
fallback|phương án dự phòng
feasible|khả thi
filename|tên tệp
fold|gập
forever|vĩnh viễn
four|bốn
gracefully|êm thấm
guest|khách
hex|thập lục phân
honestly|trung thực
how|cách
hybrid|kết hợp
idea|ý tưởng
identify|xác định
idle|nhàn rỗi
incorrect|không đúng
incorrectly|không đúng
increment|tăng
inert|không hoạt động
ingestable|có thể nạp
inline|nội tuyến
instruction|hướng dẫn
interface|giao diện
introduce|đưa vào
isolate|cô lập
issue|vấn đề
leading|ở đầu
lifetime|vòng đời
lock|khóa
logged|đã ghi
looser|lỏng hơn
mail|thư
make|tạo
markup|mã đánh dấu
message|thông báo
minor|nhỏ
mockable|có thể mô phỏng
nag|nhắc lặp
nav|điều hướng
navigable|có thể điều hướng
noise|nhiễu
normal|bình thường
normalize|chuẩn hóa
off|tắt
offer|cung cấp
oracle|kết quả chuẩn
ordinary|thông thường
paraphrase|diễn giải
past|trước đây
paste|dán
pattern|mẫu
phantom|ảo
pick|chọn
pickup|tiếp nhận
plausible|hợp lý
plural|số nhiều
portrait|dọc
prior|trước
process|xử lý
profile|hồ sơ
quarantine|cách ly
raw|thô
reason|lý do
rebuild|xây dựng lại
reference|tham chiếu
refusal|từ chối
rejection|việc từ chối
rely|phụ thuộc
remember|ghi nhớ
rename|đổi tên
requirement|yêu cầu
retain|giữ lại
revalidate|xác thực lại
reviewer|người xem xét
right|bên phải
root|gốc
selectability|khả năng chọn
semantically|về ngữ nghĩa
shell|khung
singular|số ít
skip|bỏ qua
smaller|nhỏ hơn
snapshot|ảnh chụp trạng thái
stack|ngăn xếp
standalone|độc lập
strictness|độ nghiêm ngặt
submit|gửi
substring|chuỗi con
supersede|thay thế
teaser|đoạn giới thiệu
tell|cho biết
track|theo dõi
trailing|ở cuối
transcribe|chuyển thành văn bản
trapping|giữ kẹt
truncate|cắt ngắn
underlying|nền tảng
understandable|dễ hiểu
unhandled|chưa xử lý
unintended|ngoài ý muốn
unnecessary|không cần thiết
validate|xác thực
versioned|có phiên bản
visibly|hiển thị rõ
wait|chờ
watch|theo dõi
whose|của ai
width|chiều rộng
wired|được nối
write|ghi
acceptance|chấp nhận
actionability|khả năng xử lý
actionably|có thể xử lý
advanced|nâng cao
affect|ảnh hưởng
ahead|phía trước
alternate|thay thế
ambiguity|sự mơ hồ
answer|câu trả lời
appropriate|phù hợp
appropriately|phù hợp
approval|phê duyệt
arrange|sắp xếp
arrive|đến
assertion|khẳng định
assign|gán
assistive|hỗ trợ
associate|liên kết
attention|chú ý
attribute|ghi nhận
audit|kiểm tra
backward|ngược
better|tốt hơn
beyond|vượt quá
blue|màu xanh
bounding|giới hạn
breakage|hỏng hóc
bug|lỗi
candidate|ứng viên
canonical|chuẩn
capable|có khả năng
cause|gây ra
checklist|danh sách kiểm
chip|thẻ nhỏ
chosen|đã chọn
class|lớp
classification|phân loại
clip|đoạn video
collapse|thu gọn
collect|thu thập
come|đến
common|phổ biến
comparison|so sánh
compatible|tương thích
condition|điều kiện
confirming|xác nhận
constrain|ràng buộc
container|vùng chứa
correction|sửa chữa
correspond|tương ứng
cron|lịch định kỳ
debug|gỡ lỗi
decimal|thập phân
deep|sâu
define|định nghĩa
demo|minh họa
derive|suy ra
describe|mô tả
desired|mong muốn
destination|đích
deviation|sai lệch
direct|hướng đến
discovery|khám phá
distinguish|phân biệt
divider|đường phân cách
doing|đang thực hiện
download|tải xuống
draft|bản nháp
drain|làm cạn
drive|thúc đẩy
due|do
elevated|nâng cao
enforcement|thực thi
equal|bằng
essential|thiết yếu
exclude|loại trừ
executable|có thể chạy
execute|thực thi
exercise|thử nghiệm
expansion|mở rộng
expectation|kỳ vọng
experience|trải nghiệm
expire|hết hạn
extension|phần mở rộng
extra|bổ sung
eyebrow|nhãn phụ
fabricate|bịa đặt
fairness|tính công bằng
false|sai
family|họ
far|xa
fetch|lấy dữ liệu
fill|điền
fire|kích hoạt
fix|sửa
float|nổi
footer|chân trang
foreign|ngoại lai
forward|tiến
further|thêm
gap|khoảng trống
global|toàn cục
go|đi
going|đang diễn ra
grant|cấp quyền
guide|hướng dẫn
hash|mã băm
head|đầu
helper|trợ giúp
hierarchy|phân cấp
honor|tuân thủ
human|con người
imply|ngụ ý
incremental|từng phần
indefinitely|vô thời hạn
indication|chỉ báo
infinite|vô hạn
inflate|phóng đại
ink|màu mực
insertion|việc chèn
intentionally|có chủ ý
intermediate|trung gian
internals|chi tiết nội bộ
interpretation|diễn giải
interval|khoảng thời gian
invalidate|làm mất hiệu lực
keep|giữ
landmark|mốc điều hướng
lab|phòng thử nghiệm
look|xem
loop|vòng lặp
manipulate|thao tác
massive|rất lớn
membership|tư cách thành viên
merely|chỉ
mislead|gây hiểu nhầm
mix|trộn
monopolize|chiếm dụng
muted|giảm nổi bật
narrow|hẹp
neutral|trung tính
newer|mới hơn
nothing|không có gì
operation|thao tác
oriented|định hướng
outcome|kết quả
overstate|phóng đại
overwrite|ghi đè
padded|được đệm
passwordless|không mật khẩu
permit|cho phép
pixel|điểm ảnh
plain|đơn giản
play|phát
playback|phát lại
playlist|danh sách phát
populate|điền dữ liệu
portion|phần
prefill|điền sẵn
prematurely|quá sớm
prepare|chuẩn bị
privacy|quyền riêng tư
promote|đưa lên
proof|bằng chứng
property|thuộc tính
prose|văn xuôi
prove|chứng minh
proxy|đại diện
publishable|có thể xuất bản
quality|chất lượng
question|câu hỏi
radius|bán kính
rapid|nhanh
raster|ảnh điểm
reachability|khả năng truy cập
reader|người đọc
readonly|chỉ đọc
reappear|xuất hiện lại
receive|nhận
recovery|khôi phục
redact|che thông tin
redesign|thiết kế lại
register|đăng ký
regress|hồi quy
relative|tương đối
relevance|mức liên quan
relocation|di chuyển
removable|có thể xóa
replacement|thay thế
resolution|độ phân giải
respect|tuân theo
respond|phản hồi
restoration|khôi phục
restriction|hạn chế
resumable|có thể tiếp tục
reveal|làm lộ
reviewable|có thể xem xét
risky|rủi ro
sanitize|làm sạch
scan|quét
scheduler|bộ lập lịch
screenshot|ảnh chụp màn hình
secondary|phụ
secret|bí mật
seek|tìm
send|gửi
separation|phân tách
serve|phục vụ
shorter|ngắn hơn
signal|tín hiệu
similar|tương tự
since|kể từ
slowly|chậm
sort|sắp xếp
spacer|khoảng đệm
specify|chỉ định
spent|đã tiêu tốn
starve|bỏ đói
stream|truyền
strictly|nghiêm ngặt
string|chuỗi
stub|giả lập
stuck|bị kẹt
subset|tập con
substitute|thay thế
sufficient|đủ
suite|bộ kiểm thử
summarize|tóm tắt
suppress|ẩn
survive|tồn tại
suspend|tạm dừng
swatch|mẫu màu
syntax|cú pháp
synthetic|tổng hợp
tabbable|có thể tab
taken|đã lấy
technology|công nghệ
temp|tạm thời
temporarily|tạm thời
term|thuật ngữ
testable|có thể kiểm thử
testcase|ca kiểm thử
textarea|vùng nhập văn bản
textbox|hộp văn bản
throttle|giới hạn tốc độ
throw|ném lỗi
tier|cấp
too|quá
trace|truy vết
trust|tin cậy
turn|lượt
unbounded|không giới hạn
unchecked|chưa chọn
underline|gạch chân
unreviewable|không thể xem xét
unsaved|chưa lưu
utility|tiện ích
variant|biến thể
variation|biến đổi
vertical|dọc
violation|vi phạm
versus|so với
warn|cảnh báo
weaken|làm yếu
welcome|chào mừng
which|mà
why|tại sao
window|cửa sổ
`.trim().split(/\r?\n/).map((line) => line.split("|"));
for (const [word, translation] of MORE_WORD_TRANSLATIONS) {
  WORD_TRANSLATIONS.set(word.toLowerCase(), translation);
}

WORD_TRANSLATIONS.set("sign-in", "đăng nhập");
WORD_TRANSLATIONS.set("signin", "đăng nhập");
WORD_TRANSLATIONS.set("sign-out", "đăng xuất");
WORD_TRANSLATIONS.set("signout", "đăng xuất");
WORD_TRANSLATIONS.set("sign-up", "đăng ký");
WORD_TRANSLATIONS.set("signup", "đăng ký");
WORD_TRANSLATIONS.set("tenant's", "của tenant");
WORD_TRANSLATIONS.set("account's", "của tài khoản");
WORD_TRANSLATIONS.set("source's", "của nguồn");
WORD_TRANSLATIONS.set("product's", "của sản phẩm");
WORD_TRANSLATIONS.set("baohan's", "của Baohan");
WORD_TRANSLATIONS.set("workspace", "không gian làm việc");
WORD_TRANSLATIONS.set("staging", "môi trường thử nghiệm");
WORD_TRANSLATIONS.set("auto", "tự động");
WORD_TRANSLATIONS.set("ui", "giao diện người dùng");
WORD_TRANSLATIONS.set("ux", "trải nghiệm người dùng");

const FINAL_WORD_TRANSLATIONS = new Map([
  ["flagged", "được đánh dấu"], ["seen", "đã xem"], ["app", "ứng dụng"], ["found", "được tìm thấy"],
  ["overlapping", "chồng lấn"], ["retried", "đã thử lại"], ["modified", "đã sửa đổi"], ["omitted", "bị bỏ qua"],
  ["capped", "bị giới hạn"], ["emitted", "được phát ra"], ["inferred", "được suy luận"], ["a's", "của A"],
  ["became", "trở thành"], ["chose", "đã chọn"], ["env", "môi trường"], ["escaped", "đã thoát"],
  ["made", "được tạo"], ["skipped", "bị bỏ qua"], ["submitting", "đang gửi"], ["their", "của họ"],
  ["automating", "tự động hóa"], ["autosave", "tự động lưu"], ["decorative", "trang trí"], ["deeper", "sâu hơn"],
  ["dev", "phát triển"], ["downloadable", "có thể tải xuống"], ["expecting", "đang mong đợi"], ["formatting", "định dạng"],
  ["implied", "được ngụ ý"], ["kept", "được giữ"], ["labelled", "được gắn nhãn"], ["mapped", "được ánh xạ"],
  ["marks", "đánh dấu"], ["masks", "che"], ["nagged", "bị nhắc lặp"], ["nagging", "nhắc lặp"],
  ["older", "cũ hơn"], ["proven", "đã được chứng minh"], ["represented", "được biểu diễn"], ["reprocessed", "được xử lý lại"],
  ["reservation", "đặt trước"], ["reserved", "được dành riêng"], ["reversibly", "có thể hoàn tác"], ["speedrun", "Speedrun"],
  ["stopped", "đã dừng"], ["thrown", "được ném ra"], ["tool", "công cụ"], ["truncation", "việc cắt ngắn"],
  ["vs", "so với"], ["weaker", "yếu hơn"],
  ["blo", "bị chặn"], ["cha", "thay đổi"], ["chan", "kênh"], ["cur", "hiện tại"], ["gener", "được tạo"],
  ["keyboar", "bàn phím"], ["mea", "có thể đo"], ["misleadin", "gây hiểu nhầm"], ["po", "chính sách"],
  ["rea", "có thể đọc"], ["req", "yêu cầu"], ["sur", "giao diện"], ["tena", "tenant"], ["val", "xác thực dữ liệu"]
]);
for (const [word, translation] of FINAL_WORD_TRANSLATIONS) {
  WORD_TRANSLATIONS.set(word, translation);
}
const TECHNICAL_TERMS = new Set([
  "p0", "p1", "p2", "qa", "ai", "api", "url", "id", "html", "css", "json", "rss", "csv", "javascript", "oauth", "google", "youtube", "betterauth", "riffables", "riffable", "riff", "riffs", "baohan", "sunday", "chrome", "github", "markdown", "excel", "playwright", "aria", "seo", "email", "tenant", "slug", "cta", "px", "pass", "fail", "blocked", "skip", "partial", "spotify", "webp", "mib", "blog", "dom", "prd", "http", "https", "uri", "png", "jpeg", "gif", "b", "s", "h", "x", "f", "t"
]);
const PHRASE_REPLACEMENTS = PHRASES
  .sort((a, b) => b[0].length - a[0].length)
  .map(([from, to]) => [new RegExp(`\\b${escapeRegExp(from)}\\b`, "gi"), to]);

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const value = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
    args[key] = value;
  }
  return args;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function splitMarkdownRow(line) {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  const cells = [];
  let current = "";
  let escaped = false;
  for (const char of trimmed) {
    if (char === "\\" && !escaped) {
      escaped = true;
      current += char;
      continue;
    }
    if (char === "|" && !escaped) {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
    escaped = false;
  }
  cells.push(current.trim());
  return cells;
}

function decodeEntities(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function cleanMarkdownCell(cell) {
  return decodeEntities(cell)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)")
    .replace(/<\/?[^>]+>/g, "")
    .replace(/\*\*/g, "")
    .replace(/\\\|/g, "|")
    .trim();
}

function stripBackticks(text) {
  return text.replace(/`([^`]+)`/g, "$1");
}

function protectLiterals(text) {
  const literals = [];
  const protectedText = text.replace(/`[^`]+`|https?:\/\/[^\s)]+|TC-[A-Z0-9-]+-\d+[A-Z]?|REQ-[A-Z0-9-]+-\d+/g, (match) => {
    const token = `__LITERAL_${literals.length}__`;
    literals.push(match);
    return token;
  });
  return { protectedText, literals };
}

function restoreLiterals(text, literals) {
  return literals.reduce((acc, literal, index) => acc.replaceAll(`__LITERAL_${index}__`, literal), text);
}

function translateControlList(value) {
  return value
    .split(/,\s*|\s*\/\s*/)
    .map((part) => CONTROL_VALUE_MAP.get(part.trim()) ?? translateText(part.trim()))
    .join(", ");
}

function translateAutomationCandidate(value) {
  const normalized = value.trim();
  if (CONTROL_VALUE_MAP.has(normalized)) return CONTROL_VALUE_MAP.get(normalized);
  return translateText(normalized);
}

function translateStatus(value) {
  const normalized = value.trim();
  if (normalized === "Draft") return "Bản nháp";
  if (normalized === "Later") return "Làm sau";

  const autoStatus = normalized.match(/^(Auto (?:PARTIAL PASS|EXPECTED FAIL|PASS|PARTIAL|BLOCKED|FAIL|SKIP))(.*)$/);
  if (autoStatus) {
    const [, prefix, rest] = autoStatus;
    const separator = rest.indexOf(":");
    if (separator < 0) return `${prefix}${rest}`;
    const metadata = rest.slice(0, separator);
    const description = rest.slice(separator + 1).trim();
    return `${prefix}${metadata}: ${translateText(description)}`;
  }
  return translateText(normalized);
}

function translateWord(word) {
  const lower = word.toLowerCase();
  if (WORD_TRANSLATIONS.has(lower)) return WORD_TRANSLATIONS.get(lower);
  if (TECHNICAL_TERMS.has(lower)) return word;

  const collapsed = lower.replaceAll("-", "");
  if (WORD_TRANSLATIONS.has(collapsed)) return WORD_TRANSLATIONS.get(collapsed);

  if (lower.includes("-")) {
    return lower
      .split("-")
      .map((part) => translateWord(part))
      .join(" ");
  }

  const candidates = [];
  if (lower.endsWith("ies") && lower.length > 4) candidates.push(`${lower.slice(0, -3)}y`);
  if (lower.endsWith("ing") && lower.length > 5) {
    candidates.push(lower.slice(0, -3), `${lower.slice(0, -3)}e`);
  }
  if (lower.endsWith("ed") && lower.length > 4) {
    candidates.push(lower.slice(0, -2), `${lower.slice(0, -1)}`);
  }
  if (lower.endsWith("es") && lower.length > 4) candidates.push(lower.slice(0, -2));
  if (lower.endsWith("s") && lower.length > 3) candidates.push(lower.slice(0, -1));
  if (lower.endsWith("ly") && lower.length > 4) candidates.push(lower.slice(0, -2));

  for (const candidate of candidates) {
    if (WORD_TRANSLATIONS.has(candidate)) return WORD_TRANSLATIONS.get(candidate);
  }
  return word;
}

const VIETNAMESE_ASCII_WORDS = new Set([
  "an", "ban", "bao", "bo", "buoc", "cac", "chi", "cho", "co", "cua", "da", "danh", "de", "dieu", "do", "du", "dung", "duoc", "giao", "ghi", "gian", "hai", "he", "hien", "khi", "khai", "khong", "khu", "la", "loai", "luong", "minh", "moi", "mong", "mot", "muc", "nay", "nen", "neu", "nhanh", "nhap", "nhu", "noi", "phan", "phi", "qua", "quan", "quay", "quy", "ra", "roi", "sai", "sau", "tai", "tao", "tham", "thanh", "thao", "thay", "theo", "thi", "tin", "trang", "trong", "truy", "tu", "vao", "vai", "ve", "vi", "voi", "xem", "xuat"
]);

function protectTranslatedPhrase(replacement, translatedLiterals) {
  return replacement.replace(/\p{L}+/gu, (word) => {
    const lower = word.toLowerCase();
    if (/[^\x00-\x7F]/.test(word) || VIETNAMESE_ASCII_WORDS.has(lower)) {
      const token = `__VI_${translatedLiterals.length}__`;
      translatedLiterals.push(word);
      return token;
    }
    return word;
  });
}

function restoreTranslatedPhrases(text, translatedLiterals) {
  return translatedLiterals.reduce((result, value, index) => result.replaceAll(`__VI_${index}__`, value), text);
}
function asciiWords(value) {
  return String(value ?? "").match(/(?<!\p{L})[A-Za-z][A-Za-z'-]*(?!\p{L})/gu) ?? [];
}

function translatedAsciiVocabulary() {
  const vocabulary = new Set(VIETNAMESE_ASCII_WORDS);
  const translatedValues = [
    ...WORD_TRANSLATIONS.values(),
    ...PHRASES.map(([, translation]) => translation),
    ...EXACT_TRANSLATIONS.values(),
    ...CONTROL_VALUE_MAP.values(),
    ...COLUMN_HEADERS_VI,
  ];
  for (const value of translatedValues) {
    for (const word of asciiWords(value)) vocabulary.add(word.toLowerCase());
  }
  return vocabulary;
}

function isTechnicalWord(word) {
  const lower = word.toLowerCase();
  if (TECHNICAL_TERMS.has(lower)) return true;
  if (lower.endsWith("s") && TECHNICAL_TERMS.has(lower.slice(0, -1))) return true;
  if (/^[A-Z]{2,8}$/.test(word)) return true;
  return false;
}

function findUntranslatedWords(values) {
  const allowedVietnamese = translatedAsciiVocabulary();
  const findings = new Map();
  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    const row = values[rowIndex];
    for (let columnIndex = 0; columnIndex < row.length; columnIndex += 1) {
      const raw = String(row[columnIndex] ?? "");
      const text = raw
        .replace(/`[^`]+`/g, " ")
        .replace(/https?:\/\/\S+/g, " ")
        .replace(/(?:TC|REQ)-[A-Z0-9-]+/g, " ")
        .replace(/__\w+_\d+__/g, " ");
      for (const word of asciiWords(text)) {
        const lower = word.toLowerCase();
        if (allowedVietnamese.has(lower) || isTechnicalWord(word)) continue;
        const current = findings.get(lower) ?? { word, count: 0, testcase: row[1], column: columnIndex, example: raw.slice(0, 220) };
        current.count += 1;
        findings.set(lower, current);
      }
    }
  }
  return [...findings.values()].sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
}
function translateEnglishWords(text) {
  return text
    .split(/(__LITERAL_\d+__|__VI_\d+__)/g)
    .map((segment) => {
      if (/^__(?:LITERAL|VI)_\d+__$/.test(segment)) return segment;
      return segment.replace(/(?<!\p{L})[A-Za-z][A-Za-z'-]*(?!\p{L})/gu, translateWord);
    })
    .join("");
}

function translateText(value) {
  if (!value) return "";
  const normalized = value.trim();
  if (EXACT_TRANSLATIONS.has(normalized)) return EXACT_TRANSLATIONS.get(normalized);

  const { protectedText, literals } = protectLiterals(value);
  const translatedLiterals = [];
  let text = protectedText;
  for (const [regex, replacement] of PHRASE_REPLACEMENTS) {
    text = text.replace(regex, () => protectTranslatedPhrase(replacement, translatedLiterals));
  }
  text = translateEnglishWords(text)
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
  text = restoreTranslatedPhrases(text, translatedLiterals);
  return restoreLiterals(text, literals);
}

function translateRow(row) {
  return [
    translateText(row.module),
    stripBackticks(row.id),
    stripBackticks(row.requirementIds),
    translateText(row.workflow),
    translateControlList(row.type),
    row.priority,
    translateText(row.preconditions),
    translateText(row.testData),
    translateText(row.testSteps),
    translateText(row.expectedResult),
    translateAutomationCandidate(row.automationCandidate),
    translateStatus(row.status),
  ];
}

function parseTestCases(markdown) {
  const rows = [];
  let module = "";
  for (const line of markdown.split(/\r?\n/)) {
    const section = line.match(/^##\s+(.+)$/);
    if (section) {
      module = section[1].trim();
      continue;
    }
    if (!line.startsWith("| `TC-")) continue;
    const cells = splitMarkdownRow(line).map(cleanMarkdownCell);
    if (cells.length < 11) continue;
    rows.push({
      module,
      id: cells[0],
      requirementIds: cells[1],
      workflow: cells[2],
      type: cells[3],
      priority: cells[4],
      preconditions: cells[5],
      testData: cells[6],
      testSteps: cells[7],
      expectedResult: cells[8],
      automationCandidate: cells[9],
      status: cells[10],
    });
  }
  return rows;
}

function countBy(rows, key) {
  const counts = new Map();
  for (const row of rows) {
    const value = row[key] || "";
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => String(a[0]).localeCompare(String(b[0])));
}

function statusGroup(status) {
  if (status.startsWith("Auto PASS")) return "Auto PASS";
  if (status.startsWith("Auto PARTIAL PASS")) return "Auto PARTIAL PASS";
  if (status.startsWith("Auto PARTIAL")) return "Auto PARTIAL";
  if (status.startsWith("Auto BLOCKED")) return "Auto BLOCKED";
  if (status.startsWith("Auto EXPECTED FAIL")) return "Auto EXPECTED FAIL";
  if (status.startsWith("Auto FAIL")) return "Auto FAIL";
  if (status.startsWith("Auto SKIP")) return "Auto SKIP";
  return status || "Blank";
}

function colName(index) {
  let n = index + 1;
  let name = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    name = String.fromCharCode(65 + rem) + name;
    n = Math.floor((n - 1) / 26);
  }
  return name;
}

function rangeAddress(rowCount, colCount) {
  return `A1:${colName(colCount - 1)}${rowCount}`;
}

function makeSafeTableName(name) {
  return name.replace(/[^A-Za-z0-9_]/g, "_").replace(/^([^A-Za-z_])/, "_$1").slice(0, 240);
}

async function loadArtifactTool(nodeModulesPath) {
  const modulePath = path.join(nodeModulesPath, "@oai", "artifact-tool", "dist", "artifact_tool.mjs");
  try {
    await fs.access(modulePath);
  } catch {
    throw new Error(`Cannot load @oai/artifact-tool from ${modulePath}`);
  }
  return import(pathToFileURL(modulePath).href);
}

function writeSheet(sheet, values, tableName) {
  const rowCount = values.length;
  const colCount = values[0].length;
  sheet.getRangeByIndexes(0, 0, rowCount, colCount).values = values;
  const used = sheet.getRangeByIndexes(0, 0, rowCount, colCount);
  used.format = {
    font: { name: "Arial", size: 10, color: "#111827" },
    wrapText: true,
  };
  const header = sheet.getRangeByIndexes(0, 0, 1, colCount);
  header.format = {
    fill: "#1F4E79",
    font: { name: "Arial", bold: true, color: "#FFFFFF" },
    wrapText: true,
  };
  used.format.borders = { preset: "all", style: "thin", color: "#D9E2F3" };
  sheet.freezePanes.freezeRows(1);
  sheet.freezePanes.freezeColumns(2);
  sheet.showGridLines = false;
  sheet.tables.add(rangeAddress(rowCount, colCount), true, makeSafeTableName(tableName));
}

function setColumnWidths(sheet, widthsPx) {
  widthsPx.forEach((widthPx, index) => {
    sheet.getRangeByIndexes(0, index, 1, 1).format.columnWidthPx = widthPx;
  });
}

async function main() {
  const args = parseArgs(process.argv);
  const input = args.input ?? DEFAULT_INPUT;
  const output = args.output ?? DEFAULT_OUTPUT;
  const nodeModulesPath = args["artifact-node-modules"] ?? process.env.CODEX_NODE_MODULES;
  if (!nodeModulesPath) {
    throw new Error("Missing --artifact-node-modules or CODEX_NODE_MODULES.");
  }

  const { SpreadsheetFile, Workbook } = await loadArtifactTool(nodeModulesPath);
  const markdown = await fs.readFile(input, "utf8");
  const rows = parseTestCases(markdown);
  if (!rows.length) {
    throw new Error(`No testcase rows were found in ${input}`);
  }

  const workbook = Workbook.create();
  const summary = workbook.worksheets.add("Tổng quan");
  const viSheet = workbook.worksheets.add("Ca kiểm thử");
  const notes = workbook.worksheets.add("Ghi chú");

  const viValues = [COLUMN_HEADERS_VI, ...rows.map(translateRow)];
  const untranslatedWords = findUntranslatedWords(viValues);
  if (untranslatedWords.length) {
    throw new Error(`Untranslated English remains (${untranslatedWords.length} unique words):\n${untranslatedWords.map((item) => item.word).join("|")}`);
  }

  writeSheet(viSheet, viValues, "TestcasesVI");
  setColumnWidths(viSheet, [160, 110, 180, 260, 130, 90, 300, 300, 420, 420, 150, 220]);


  const statusCounts = countBy(rows.map((row) => ({ ...row, statusGroup: statusGroup(row.status) })), "statusGroup");
  const priorityCounts = countBy(rows, "priority");
  const moduleCounts = countBy(rows, "module");

  const summaryValues = [
    ["Riffables - Bộ ca kiểm thử tiếng Việt", ""],
    ["Tệp Markdown nguồn", input],
    ["Tệp Excel đầu ra", output],
    ["Tổng ca kiểm thử", rows.length],
    ["Ngày xuất", new Date().toISOString().slice(0, 10)],
    ["Lệnh chạy lại", "pnpm export:testcases:vi"],
    ["", ""],
    ["Theo độ ưu tiên", "Số lượng"],
    ...priorityCounts.map(([key, count]) => [key, count]),
    ["", ""],
    ["Theo trạng thái", "Số lượng"],
    ...statusCounts.map(([key, count]) => [translateStatus(key), count]),
    ["", ""],
    ["Theo phân hệ", "Số lượng"],
    ...moduleCounts.map(([key, count]) => [translateText(key), count]),
  ];
  summary.getRangeByIndexes(0, 0, summaryValues.length, 2).values = summaryValues;
  summary.getRange("A1:B1").merge();
  summary.getRange("A1:B1").format = {
    fill: "#0F172A",
    font: { name: "Arial", bold: true, color: "#FFFFFF", size: 14 },
  };
  summary.getRangeByIndexes(1, 0, summaryValues.length - 1, 2).format = {
    font: { name: "Arial", size: 10, color: "#111827" },
    wrapText: true,
  };
  summary.getRangeByIndexes(0, 0, summaryValues.length, 2).format.borders = {
    preset: "all",
    style: "thin",
    color: "#D9E2F3",
  };
  summary.getRange("A8:B8").format = { fill: "#EAF2F8", font: { bold: true } };
  const statusStart = 9 + priorityCounts.length + 1;
  summary.getRange(`A${statusStart}:B${statusStart}`).format = { fill: "#EAF2F8", font: { bold: true } };
  const moduleStart = statusStart + statusCounts.length + 2;
  summary.getRange(`A${moduleStart}:B${moduleStart}`).format = { fill: "#EAF2F8", font: { bold: true } };
  summary.getRange("A:B").format.autofitColumns();
  summary.showGridLines = false;

  const noteValues = [
    ["Quy ước", "Chi tiết"],
    ["Phạm vi", "Bảng tính này được tạo từ tệp ca kiểm thử Markdown tổng hiện tại."],
    ["Dịch tiếng Việt", "Toàn bộ mô tả, tiền điều kiện, dữ liệu test, bước test, kết quả mong đợi, loại và trạng thái được dịch sang tiếng Việt; chỉ giữ nguyên mã, URL, tên sản phẩm và literal kỹ thuật."],
    ["Giữ nguyên literal", "Mã ca kiểm thử, mã yêu cầu, URL, đường dẫn, bộ chọn, điểm cuối và nhãn UI trong dấu backtick được giữ nguyên để QA đối chiếu đúng kết quả chuẩn."],
    ["Cập nhật sau này", "Khi tệp ca kiểm thử Markdown thay đổi, chạy lại `pnpm export:testcases:vi` để xuất tệp Excel mới."],
  ];
  writeSheet(notes, noteValues, "TranslationNotes");
  setColumnWidths(notes, [180, 760]);

  const outputDir = path.dirname(output);
  await fs.mkdir(outputDir, { recursive: true });

  const xlsx = await SpreadsheetFile.exportXlsx(workbook);
  await xlsx.save(output);
  await fs.rm(`${output}.inspect.ndjson`, { force: true });

  console.log(`Exported ${rows.length} testcases to ${output}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});




