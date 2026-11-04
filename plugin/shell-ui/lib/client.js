window.__ModuleLoader__.load({
	id: "@surpasshither/dsh-shell-ui",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		const PACKAGE = "@surpasshither/dsh-shell-ui";
		const STORE_KEY = "dsh-shell-ui/groups/v1";
		// Categories (workspace grouping) are off by default; once enabled, "New category" and the groups appear in the sidebar.
		const ENABLED_KEY = "dsh-shell-ui/categories/v1";
		// Android client download URL (currently the community DSH Android client's GitHub releases page; change only this line when pointing it at your own repo)
		const MOBILE_URL = "/dsh/mobile";
		const PALETTE = ["#2f6bff", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#6b7280"];

		const I18N = {
			zh: {
				newGroup: "＋ New category",
				newGroupTip: "UI-only grouping; no folder is created",
				groupPrompt: "Category name (UI only, no folder created)",
				groupDefault: "Category",
				renamePrompt: "Rename category",
				renameTip: "Double-click to rename; drag to reorder",
				colorTip: "Click to change color",
				deleteTip: "Delete category (workspaces are kept)",
				deleteConfirm: (name) => "Delete category \"" + name + "\"? Workspaces are kept.",
				volumeRoot: "You can't select an entire volume. Please pick a shared folder inside it.",
				mobileLabel: "Mobile app",
				mobileTitle: "Mobile app — coming soon",
				usageLabel: "Usage & balance",
				usageTitle: "Usage & balance",
				usageRefresh: "Refresh",
				usageLoading: "Loading balance…",
				usageEmpty: "No provider with a balance API yet.",
				usageTotal: "Total",
				usageGranted: "Granted",
				usageTopped: "Topped up",
				usageUpdated: "Updated",
				usageDetail: "Details",
				usagePlatform: "Open DeepSeek Platform",
				usageClose: "Close",
				usageError: "Failed to load",
				usageConnected: "Connected",
				usageNoApi: "No balance API for this provider",
				usageUnavailable: "Balance unavailable",
				unofficial: "Unofficial",
				settingTitle: "Workspace categories",
				settingDesc: "Group workspaces in the sidebar (UI-only grouping, no folders created). Off by default.",
				tintTitle: "Background color",
				tintDesc: "Pick a light background tint for the main area (stored in this browser only).",
				labelNewSession: "New session",
				noticeShort: "DSH is in preview and still evolving. This TOS package is unofficial and not affiliated with DeepSeek. Back up important data and review permissions before use.",
				onboardingKey: "Get an API key",
				onboardingTopup: "Top up / buy credits",
				onboardingOther: "Use another model →",
				permHint:
					"No permission to open this shared folder. Grant the app user <b>dsh-user</b> " +
					"read-write access under <b>TOS Control Panel → Shared Folders → Edit → Permissions</b>. " +
					"If dsh-user is not listed (common for manual installs), run " +
					"<b>sudo /usr/local/dsh/bin/grant-share.sh &lt;path&gt; rw</b> over SSH, then retry.",
				permTip:
					"To use a shared folder as a workspace, open TOS Control Panel → Shared Folders → " +
					"select the folder → Edit → Permissions, and grant the app user dsh-user read-write access."
			},
			en: {
				newGroup: "＋ New category",
				newGroupTip: "UI-only grouping; no folder is created",
				groupPrompt: "Category name (UI only, no folder created)",
				groupDefault: "Category",
				renamePrompt: "Rename category",
				renameTip: "Double-click to rename; drag to reorder",
				colorTip: "Click to change color",
				deleteTip: "Delete category (workspaces are kept)",
				deleteConfirm: (name) => "Delete category \"" + name + "\"? Workspaces are kept.",
				volumeRoot: "You can't select an entire volume. Please pick a shared folder inside it.",
				mobileLabel: "Mobile app",
				mobileTitle: "Mobile app — coming soon",
				usageLabel: "Usage & balance",
				usageTitle: "Usage & balance",
				usageRefresh: "Refresh",
				usageLoading: "Loading balance…",
				usageEmpty: "No provider with a balance API yet.",
				usageTotal: "Total",
				usageGranted: "Granted",
				usageTopped: "Topped up",
				usageUpdated: "Updated",
				usageDetail: "Details",
				usagePlatform: "Open DeepSeek Platform",
				usageClose: "Close",
				usageError: "Failed to load",
				usageConnected: "Connected",
				usageNoApi: "No balance API for this provider",
				usageUnavailable: "Balance unavailable",
				unofficial: "Unofficial",
				settingTitle: "Workspace categories",
				settingDesc: "Group workspaces in the sidebar (UI-only grouping, no folders created). Off by default.",
				tintTitle: "Background color",
				tintDesc: "Pick a light background tint for the main area (stored in this browser only).",
				labelNewSession: "New session",
				noticeShort: "DSH is in preview and still evolving. This TOS package is unofficial and not affiliated with DeepSeek. Back up important data and review permissions before use.",
				onboardingKey: "Get an API key",
				onboardingTopup: "Top up / buy credits",
				onboardingOther: "Use another model →",
				permHint:
					"No permission to open this shared folder. Grant the app user <b>dsh-user</b> " +
					"read-write access under <b>TOS Control Panel → Shared Folders → Edit → Permissions</b>. " +
					"If dsh-user is not listed (common for manual installs), run " +
					"<b>sudo /usr/local/dsh/bin/grant-share.sh &lt;path&gt; rw</b> over SSH, then retry.",
				permTip:
					"To use a shared folder as a workspace, open TOS Control Panel → Shared Folders → " +
					"select the folder → Edit → Permissions, and grant the app user dsh-user read-write access."
			}
		};

		function uiLang() {
			// All UI is English-only for now (the zh table mirrors en so both key sets stay aligned).
			return "en";
		}

		function T(key, ...args) {
			const table = I18N[uiLang()] || I18N.en;
			const value = table[key];
			return typeof value === "function" ? value(...args) : value;
		}

		const CSS = `
/* —— Runtime state: blue loading spinner (replaces the upstream gray one) —— */
[class*="_spinner"] { color: #2f6bff !important; }
[class*="_spinnerArc"], [class*="_spinnerTrack"] { stroke: #2f6bff !important; }
[class*="_spinner_"] { border-color: rgba(47,107,255,.22) !important; }
[class*="_spinner_"]:after { background: conic-gradient(#2f6bff var(--dsh-boot-arc,72deg), transparent 0) !important; }

/* —— Shell: workspace categories —— */
/* —— Settings page: categories toggle —— */
.dsh-shell-setting { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 0; border-top: 1px solid rgba(128,128,128,.18); }
.dsh-shell-setting-title { font-size: 14px; font-weight: 500; }
.dsh-shell-setting-desc { font-size: 12px; opacity: .65; margin-top: 2px; line-height: 1.45; }
.dsh-shell-switch { flex: none; width: 38px; height: 22px; border-radius: 11px; background: rgba(128,128,128,.35); border: none; position: relative; cursor: pointer; transition: background .15s; padding: 0; }
.dsh-shell-switch[aria-checked="true"] { background: #2f6bff; }
.dsh-shell-switch span { position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; border-radius: 50%; background: #fff; transition: transform .15s; }
.dsh-shell-switch[aria-checked="true"] span { transform: translateX(16px); }

.dsh-shell-groups { display: flex; flex-direction: column; }
.dsh-shell-group {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 8px; margin: 8px 2px 2px;
  font-size: 12px; font-weight: 600; letter-spacing: .02em;
  color: #2f6bff;
  background: rgba(47, 107, 255, .10);
  border-left: 3px solid #2f6bff;
  border-radius: 6px;
  cursor: grab; user-select: none;
}
.dsh-shell-group:hover { background: rgba(47, 107, 255, .16); }
.dsh-shell-group.collapsed { background: rgba(47, 107, 255, .07); }
.dsh-shell-group .grip { opacity: .55; cursor: grab; font-size: 11px; letter-spacing: -1px; }
.dsh-shell-group .caret { display: inline-block; transition: transform .15s ease; opacity: .9; }
.dsh-shell-group.collapsed .caret { transform: rotate(-90deg); }
.dsh-shell-group .gdot {
  width: 9px; height: 9px; border-radius: 50%; flex: none;
  box-shadow: 0 0 0 2px rgba(255,255,255,.7);
}
.dsh-shell-group .gcount { margin-left: auto; opacity: .7; font-weight: 400; }
.dsh-shell-group.dragover { outline: 2px dashed #2f6bff; outline-offset: -2px; }
.dsh-shell-group.drag-source { opacity: .55; }
.dsh-shell-drop { outline: 2px dashed #2f6bff; outline-offset: -2px; background: rgba(47,107,255,.06); }
.dsh-shell-group .gdel { opacity: 0; font-weight: 400; }
.dsh-shell-group:hover .gdel { opacity: .7; }

/* New category: bottom of the list */
.dsh-shell-newgroup {
  display: flex; align-items: center; gap: 6px;
  margin: 10px 0 4px; padding: 6px 8px;
  font-size: 12px; color: var(--dsw-alias-label-tertiary, #9ca3af);
  cursor: pointer; user-select: none; border-radius: 6px;
  border: 1px dashed var(--dsw-alias-border-l2, rgba(0,0,0,.12));
}
.dsh-shell-newgroup:hover { color: #2f6bff; border-color: #2f6bff; }

/* Picker: "can't select a whole volume" note */
.dsh-shell-picker-error { color: #ef4444; font-size: 12px; margin-left: 8px; align-self: center; }

/* Picker: "no permission" hint */
.dsh-shell-perm-hint {
  margin: 0 16px 8px; padding: 8px 10px;
  background: #fff7e6; border: 1px solid #f5c26b; border-radius: 6px;
  color: #8a5300; font-size: 12px; line-height: 1.6;
}
.dsh-shell-perm-hint b { color: #8a5300; }

/* The "?" help icon in the picker */
.dsh-shell-help {
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px; margin: 0 6px;
  border: 1px solid var(--dsw-alias-border-l2, #d0d5dd); border-radius: 50%;
  color: var(--dsw-alias-label-secondary, #6b7280);
  font-size: 12px; font-weight: 700; cursor: help; user-select: none;
}
.dsh-shell-help:hover { color: #2f6bff; border-color: #2f6bff; }

/* Mobile app download entry next to Settings */
.dsh-shell-mobile {
  display: flex; align-items: center; gap: 6px;
  margin: 0 0 2px; padding: 7px 10px;
  font-size: 13px; color: var(--dsw-alias-label-secondary, #6b7280);
  text-decoration: none; border-radius: 6px;
}
.dsh-shell-mobile:hover { background: var(--dsw-alias-bg-l2, rgba(0,0,0,.05)); color: #2f6bff; }
button.dsh-shell-mobile { border: 0; background: transparent; width: 100%; text-align: left; font: inherit; cursor: pointer; }

/* —— Usage & balance —— */
.dsh-usage-mask { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,.45); display: flex; align-items: center; justify-content: center; padding: 18px; }
.dsh-usage-card { width: min(460px, 94vw); max-height: 84vh; overflow: auto; background: var(--dsw-alias-bg-l1, #fff); color: var(--dsw-alias-label-primary, #111827); border-radius: 14px; padding: 18px 20px; box-shadow: 0 20px 60px rgba(0,0,0,.28); }
.dsh-usage-head { display: flex; align-items: center; gap: 8px; }
.dsh-usage-head h3 { margin: 0; font-size: 16px; flex: 1; }
.dsh-usage-refresh { border: 1px solid var(--dsw-alias-border-l2, #e5e7eb); background: transparent; color: inherit; border-radius: 7px; padding: 5px 9px; font: inherit; font-size: 12px; cursor: pointer; }
.dsh-usage-refresh:hover { border-color: #2f6bff; color: #2f6bff; }
.dsh-usage-close { border: 0; background: transparent; color: inherit; font-size: 20px; line-height: 1; cursor: pointer; opacity: .6; padding: 0 2px; }
.dsh-usage-close:hover { opacity: 1; }
.dsh-usage-body { margin-top: 14px; font-size: 13px; }
.dsh-usage-provider { display: flex; align-items: center; gap: 10px; padding: 11px 12px; border: 1px solid var(--dsw-alias-border-l2, #e5e7eb); border-radius: 10px; cursor: pointer; margin-bottom: 8px; }
.dsh-usage-provider:hover { border-color: #2f6bff; }
.dsh-usage-provider .dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; flex: none; }
.dsh-usage-provider .dot.bad { background: #ef4444; }
.dsh-usage-provider .name { font-weight: 600; }
.dsh-usage-provider .bal { margin-left: auto; font-weight: 700; }
.dsh-usage-detail { display: grid; grid-template-columns: 1fr auto; gap: 7px 12px; margin-top: 12px; }
.dsh-usage-detail .k { color: var(--dsw-alias-label-secondary, #6b7280); }
.dsh-usage-detail .v { font-weight: 600; text-align: right; }
.dsh-usage-note { margin-top: 10px; color: var(--dsw-alias-label-secondary, #6b7280); font-size: 11.5px; }
.dsh-usage-link { display: inline-block; margin-top: 14px; color: #2f6bff; text-decoration: none; font-size: 12px; }

/* —— Running workspace: icon and name turn blue —— */
.dsh-shell-running > :first-child svg { color: #2f6bff !important; }
.dsh-shell-running > :first-child svg * { stroke: #2f6bff !important; }
.dsh-shell-running > :first-child { color: #2f6bff !important; }

/* —— Branding: hide the upstream whale/wordmark, show DSH for TOS —— */
[data-slot="sidebar.brand.mark"],
[data-slot="sidebar.brand.name"],
[data-slot="conversation.hero.brand.mark"] { display: none !important; }
.dsh-brand-mark { display: inline-flex; width: 22px; height: 22px; align-items: center; justify-content: center; color: inherit; }
.dsh-brand-name { display: inline-flex; align-items: center; gap: 6px; font-weight: 600; font-size: 15px; letter-spacing: .2px; white-space: nowrap; color: inherit; }
.dsh-brand-name em { font-style: normal; font-size: 9px; line-height: 1; padding: 2px 5px; border-radius: 999px; background: rgba(127,127,127,.18); }
.dsh-hero-mark { display: inline-flex; width: 44px; height: 44px; color: inherit; }

/* —— Hide the upstream "Preview" badge (the first-run notice explains preview status instead) —— */
[class*="previewBadge"] { display: none !important; }

/* —— Settings page: background color —— */
.dsh-shell-tints { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.dsh-shell-tint { width: 22px; height: 22px; border-radius: 50%; border: 1px solid rgba(127,127,127,.35); cursor: pointer; padding: 0; }
.dsh-shell-tint[aria-pressed="true"] { outline: 2px solid #2f6bff; outline-offset: 1px; }

/* —— First-run onboarding: DeepSeek top-up / switch-model entries —— */
.dsh-shell-onboarding { margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(127,127,127,.18); display: flex; flex-direction: column; gap: 8px; }
.dsh-shell-onboarding-links { display: flex; gap: 14px; flex-wrap: wrap; font-size: 13px; }
.dsh-shell-onboarding a { color: #2f6bff; text-decoration: none; }
.dsh-shell-onboarding a:hover { text-decoration: underline; }
.dsh-shell-onboarding-other { align-self: flex-start; background: transparent; border: 1px solid rgba(127,127,127,.35); color: inherit; border-radius: 6px; padding: 5px 10px; font-size: 12px; cursor: pointer; }

/* —— Background color: applied through theme variables (see applyTint) —— */
html[data-dsh-tint] body { background-color: var(--dsh-shell-tint) !important; }
`;

		let state = loadState();
		let observer = null;
		let timer = null;
		let interval = null;
		let draggingKey = "";
		let draggingGroupId = "";
		let dragTargetId = "";
		let groupDragActive = false;
		let suppressClickUntil = 0;

		function loadState() {
			try {
				const raw = window.localStorage.getItem(STORE_KEY);
				const parsed = raw ? JSON.parse(raw) : null;
				if (parsed && Array.isArray(parsed.groups) && parsed.assign) return parsed;
			} catch (err) {}
			return { groups: [], assign: {} };
		}

		function saveState() {
			try {
				window.localStorage.setItem(STORE_KEY, JSON.stringify(state));
			} catch (err) {}
		}

		// Single ordering: categories and ungrouped workspaces share one sequence, so a category can be dragged below a workspace.
		function ensureOrder(secs) {
			if (!Array.isArray(state.order)) state.order = [];
			const groupIds = new Set(state.groups.map((g) => g.id));
			const keys = secs.map((s) => wsKey(s));
			const keySet = new Set(keys);

			state.order = state.order.filter((item) => {
				if (!item || typeof item !== "object") return false;
				if (item.g !== undefined) return groupIds.has(item.g);
				if (item.ws !== undefined) return keySet.has(item.ws) && !state.assign[item.ws];
				return false;
			});

			state.groups.forEach((group, idx) => {
				if (!state.order.some((item) => item.g === group.id)) {
					state.order.splice(Math.min(idx, state.order.length), 0, { g: group.id });
				}
			});

			keys.forEach((key) => {
				if (state.assign[key]) return;
				if (!state.order.some((item) => item.ws === key)) state.order.push({ ws: key });
			});
		}

		function sidebar() {
			return document.querySelector('[class*="sidebarCol"]');
		}

		function listEl() {
			const sb = sidebar();
			return sb ? sb.querySelector('[role="tree"]') : null;
		}

		function sections() {
			const list = listEl();
			return list ? Array.from(list.querySelectorAll('[class*="groupSection"]')) : [];
		}

		function wsKey(section) {
			if (section.dataset && section.dataset.dshShellKey) return section.dataset.dshShellKey;
			const head = section.firstElementChild;
			const raw = (head ? head.textContent : section.textContent) || "";
			const key = raw.replace(/\s+/g, " ").trim();
			if (key && section.dataset) section.dataset.dshShellKey = key;
			return key;
		}

		function installStyles() {
			if (document.getElementById("dsh-shell-ui-style")) return;
			const style = document.createElement("style");
			style.id = "dsh-shell-ui-style";
			style.textContent = CSS;
			document.head.appendChild(style);
		}

		// ---------- Picker guard: don't allow selecting an entire volume ----------
		function pickerGuard(event) {
			const btn = event.target && event.target.closest ? event.target.closest("button") : null;
			if (!btn) return;
			const label = (btn.textContent || "").trim();
			if (label !== "Open") return;
			const dialog = btn.closest('[class*="dialog"]');
			if (!dialog) return;

			const crumbs = Array.from(dialog.querySelectorAll('button[class*="crumb"]'))
				.map((el) => (el.textContent || "").trim())
				.filter(Boolean);
			const isVolumeRoot = crumbs.length === 2 && /^Volume\d+$/.test(crumbs[1]);
			if (!isVolumeRoot) return;

			event.preventDefault();
			event.stopImmediatePropagation();

			let tip = dialog.querySelector(".dsh-shell-picker-error");
			if (!tip) {
				tip = document.createElement("span");
				tip.className = "dsh-shell-picker-error";
				const footer = dialog.querySelector('[class*="footerBar"]') || dialog;
				footer.appendChild(tip);
			}
			tip.textContent = T("volumeRoot");
			window.setTimeout(() => { try { tip.remove(); } catch (err) {} }, 4000);
		}

		// ---------- Categories ----------
		function promptNewGroup() {
			const nextIndex = state.groups.length + 1;
			const name = window.prompt(T("groupPrompt"), T("groupDefault") + nextIndex);
			if (!name || !name.trim()) return;
			state.groups.push({
				id: "g" + Date.now().toString(36),
				name: name.trim(),
				collapsed: false,
				color: PALETTE[state.groups.length % PALETTE.length]
			});
			saveState();
			render();
		}

		let dragHandlersInstalled = false;

		// Category rows use HTML5 drag and drop, handled in the document capture phase to dodge React's dragover/drop interception.
		function ensureDragHandlers() {
			if (dragHandlersInstalled) return;
			dragHandlersInstalled = true;

			function resolveTarget(event) {
				const el = document.elementFromPoint(event.clientX, event.clientY);
				if (!el || !el.closest) return null;
				return el.closest('.dsh-shell-group, [class*="groupSection"]');
			}

			function clearHover() {
				document.querySelectorAll(".dsh-shell-group.dragover, .dsh-shell-drop").forEach((n) => {
					n.classList.remove("dragover");
					n.classList.remove("dsh-shell-drop");
				});
			}

			document.addEventListener("dragover", (event) => {
				if (!draggingGroupId) return;
				event.preventDefault();
				const target = resolveTarget(event);
				document.querySelectorAll(".dsh-shell-group.dragover, .dsh-shell-drop").forEach((n) => {
					if (n !== target) {
						n.classList.remove("dragover");
						n.classList.remove("dsh-shell-drop");
					}
				});
				if (!target) return;
				if (target.dataset && target.dataset.groupId === draggingGroupId) return;
				try { event.dataTransfer.dropEffect = "move"; } catch (err) {}
				target.classList.add(target.classList.contains("dsh-shell-group") ? "dragover" : "dsh-shell-drop");
			}, true);

			document.addEventListener("drop", (event) => {
				if (!draggingGroupId) return;
				const target = resolveTarget(event);
				event.preventDefault();
				event.stopPropagation();
				clearHover();

				const groupId = draggingGroupId;
				draggingGroupId = "";
				if (!target) return;
				if (target.dataset && target.dataset.groupId === groupId) return;

				const rect = target.getBoundingClientRect();
				const after = event.clientY > rect.top + rect.height / 2;
				const from = state.order.findIndex((item) => item.g === groupId);
				const original = from >= 0 ? from : state.order.length;
				if (from >= 0) state.order.splice(from, 1);

				let targetIndex = -1;
				if (target.classList.contains("dsh-shell-group")) {
					targetIndex = state.order.findIndex((item) => item.g === target.dataset.groupId);
				} else {
					targetIndex = state.order.findIndex((item) => item.ws === wsKey(target));
				}
				if (targetIndex >= 0) {
					state.order.splice(targetIndex + (after ? 1 : 0), 0, { g: groupId });
				} else {
					state.order.splice(Math.min(original, state.order.length), 0, { g: groupId });
				}
				saveState();
				render();
			}, true);
		}

		function ensureMobileButton() {
			if (document.getElementById("dsh-shell-mobile")) return;
			const sb = sidebar();
			if (!sb) return;
			const buttons = Array.from(sb.querySelectorAll("button"));
			const settings = buttons.find((btn) => {
				const label = btn.getAttribute("aria-label") || "";
				const text = (btn.textContent || "").trim();
				return /^(Settings|\u8bbe\u7f6e)$/.test(label) || /^(Settings|\u8bbe\u7f6e)$/.test(text);
			});
			if (!settings || !settings.parentElement) return;
			const link = document.createElement("a");
			link.id = "dsh-shell-mobile";
			link.className = "dsh-shell-mobile";
			link.href = MOBILE_URL;
			link.target = "_blank";
			link.rel = "noopener noreferrer";
			link.title = T("mobileTitle");
			link.textContent = "📱 " + T("mobileLabel");
			settings.parentElement.insertBefore(link, settings);
		}

		// ---------- Usage & balance ----------
		let usageCache = null;
		let usageCacheAt = 0;

		function esc(s) {
			return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => (
				{ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
			));
		}

		function fmtMoney(info) {
			if (!info) return "—";
			const symbol = info.currency === "CNY" ? "¥" : (info.currency === "USD" ? "$" : (info.currency || "") + " ");
			return symbol + (info.total_balance != null ? info.total_balance : "0.00");
		}

		async function fetchUsage(force) {
			const now = Date.now();
			if (!force && usageCache && now - usageCacheAt < 60000) return usageCache;
			const res = await fetch("/dsh/usage", { credentials: "same-origin", cache: "no-store" });
			if (!res.ok) throw new Error("HTTP " + res.status);
			usageCache = await res.json();
			usageCacheAt = now;
			return usageCache;
		}

		// "Usage & balance" goes into the menu list on the left of the settings panel (no extra sidebar button)
		function ensureUsageMenuItem() {
			const legacy = document.getElementById("dsh-shell-usage");
			if (legacy) legacy.remove();

			const dialog = document.querySelector('[role="dialog"][data-shortcut-modal="settings"]');
			if (!dialog) return;
			const list = dialog.querySelector('[class*="_navList"]');
			if (!list || list.querySelector("#dsh-shell-usage-item")) return;
			const tpl = list.querySelector("button");
			if (!tpl) return;

			const cell = tpl.cloneNode(true);
			cell.id = "dsh-shell-usage-item";
			cell.removeAttribute("aria-current");
			cell.removeAttribute("data-modal-autofocus");
			cell.removeAttribute("data-dsh-automatic-focus");
			const activeCls = Array.from(tpl.classList).find((c) => /_active$/.test(c));
			if (activeCls) cell.classList.remove(activeCls);

			const svg = cell.querySelector("svg");
			if (svg) {
				svg.innerHTML = '<circle cx="8" cy="8" r="5.4"/><path d="M8 4.9v6.2M6.4 6.6h2.3a1.15 1.15 0 010 2.3H6.4"/>';
			}
			const label = cell.querySelector("span");
			if (label) label.textContent = T("usageLabel");
			else cell.appendChild(document.createTextNode(T("usageLabel")));

			cell.addEventListener("click", () => {
				Array.from(list.querySelectorAll("button")).forEach((b) => {
					Array.from(b.classList).forEach((c) => {
						if (/_active$/.test(c)) b.classList.remove(c);
					});
					b.removeAttribute("aria-current");
				});
				if (activeCls) cell.classList.add(activeCls);
				cell.setAttribute("aria-current", "true");
				openUsage();
			});
			list.appendChild(cell);
		}

		function closeUsage() {
			const mask = document.getElementById("dsh-usage-mask");
			if (mask) mask.remove();
		}

		function showUsageDetail(provider, fetchedAt) {
			const body = document.getElementById("dsh-usage-body");
			if (!body) return;
			const info = provider.balance && (provider.balance.balance_infos || [])[0];
			let html = '<div style="font-weight:700;font-size:15px;margin-bottom:4px">' + esc(provider.name) + "</div>";
			if (provider.ok && info) {
				html += '<div class="dsh-usage-detail">' +
					'<span class="k">' + T("usageTotal") + '</span><span class="v">' + fmtMoney(info) + "</span>" +
					'<span class="k">' + T("usageGranted") + '</span><span class="v">' + fmtMoney({ currency: info.currency, total_balance: info.granted_balance }) + "</span>" +
					'<span class="k">' + T("usageTopped") + '</span><span class="v">' + fmtMoney({ currency: info.currency, total_balance: info.topped_up_balance }) + "</span>" +
					'<span class="k">' + T("usageUpdated") + '</span><span class="v">' + esc(fetchedAt || "") + "</span>" +
					"</div>";
				html += '<a class="dsh-usage-link" href="https://platform.deepseek.com/usage" target="_blank" rel="noopener noreferrer">' + T("usagePlatform") + "</a>";
			} else {
				html += '<div class="dsh-usage-note">' + T("usageUnavailable") + " — " + esc(provider.error || "") + "</div>";
			}
			html += '<div style="margin-top:14px"><button type="button" class="dsh-usage-refresh" id="dsh-usage-back">←</button></div>';
			body.innerHTML = html;
			const back = document.getElementById("dsh-usage-back");
			if (back) back.addEventListener("click", () => renderUsageList(body, false));
		}

		async function renderUsageList(body, force) {
			body.innerHTML = '<div class="dsh-usage-note">' + T("usageLoading") + "</div>";
			try {
				const data = await fetchUsage(force);
				const providers = data.providers || [];
				if (!providers.length) {
					body.textContent = T("usageEmpty");
					return;
				}
				body.innerHTML = "";
				providers.forEach((provider) => {
					const ok = provider.ok && provider.balance && provider.balance.is_available;
					const info = provider.balance && (provider.balance.balance_infos || [])[0];
					const row = document.createElement("div");
					row.className = "dsh-usage-provider";
					row.innerHTML = '<span class="dot ' + (ok ? "" : "bad") + '"></span>' +
						'<span class="name">' + esc(provider.name) + "</span>" +
						'<span class="bal">' + (ok ? fmtMoney(info) : "—") + "</span>";
					row.addEventListener("click", () => showUsageDetail(provider, data.fetched_at));
					body.appendChild(row);
				});
				const note = document.createElement("div");
				note.className = "dsh-usage-note";
				note.textContent = T("usageUpdated") + " " + (data.fetched_at || "");
				body.appendChild(note);
			} catch (err) {
				body.innerHTML = '<div class="dsh-usage-note">' + T("usageError") + ": " + esc(err.message) + "</div>";
			}
		}

		function openUsage() {
			closeUsage();
			const mask = document.createElement("div");
			mask.className = "dsh-usage-mask";
			mask.id = "dsh-usage-mask";
			const card = document.createElement("div");
			card.className = "dsh-usage-card";
			card.innerHTML =
				'<div class="dsh-usage-head"><h3>' + T("usageTitle") + "</h3>" +
				'<button type="button" class="dsh-usage-refresh" id="dsh-usage-refresh">' + T("usageRefresh") + "</button>" +
				'<button type="button" class="dsh-usage-close" aria-label="' + T("usageClose") + '">×</button></div>' +
				'<div class="dsh-usage-body" id="dsh-usage-body"></div>';
			mask.appendChild(card);
			document.body.appendChild(mask);
			const body = card.querySelector("#dsh-usage-body");
			card.querySelector("#dsh-usage-refresh").addEventListener("click", () => renderUsageList(body, true));
			card.querySelector(".dsh-usage-close").addEventListener("click", closeUsage);
			mask.addEventListener("click", (event) => {
				if (event.target === mask) closeUsage();
			});
			renderUsageList(body, false);
		}

		function ensureNewGroupRow(list) {
			let row = list.querySelector(".dsh-shell-newgroup");
			if (!row) {
				row = document.createElement("div");
				row.className = "dsh-shell-newgroup";
				row.textContent = T("newGroup");
				row.title = T("newGroupTip");
				row.addEventListener("click", (event) => {
					event.stopPropagation();
					promptNewGroup();
				});
				list.appendChild(row);
			}
			row.style.order = "999";
			return row;
		}

		// Pointer drag: hold a category row and drag up/down to reorder (HTML5 dnd is unreliable with a real mouse, so this is hand-rolled)
		function beginGroupDrag(group, header, downEvent) {
			if (downEvent.button !== 0) return;
			const startX = downEvent.clientX;
			const startY = downEvent.clientY;
			let moved = false;
			let dragTarget = null;
			let lastX = startX;
			let lastY = startY;

			function clearHover() {
				document.querySelectorAll(".dsh-shell-group.dragover").forEach((n) => n.classList.remove("dragover"));
				document.querySelectorAll(".dsh-shell-drop").forEach((n) => n.classList.remove("dsh-shell-drop"));
			}

			function onMove(ev) {
				const dx = ev.clientX - startX;
				const dy = ev.clientY - startY;
				if (!moved && Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
				if (!moved) {
					moved = true;
					groupDragActive = true;
					header.classList.add("drag-source");
					document.body.style.cursor = "grabbing";
				}
				ev.preventDefault();
				lastX = ev.clientX;
				lastY = ev.clientY;

				clearHover();
				dragTarget = null;
				const el = document.elementFromPoint(ev.clientX, ev.clientY);
				if (!el || !el.closest) return;

				const overHeader = el.closest(".dsh-shell-group");
				if (overHeader) {
					if (overHeader === header) return;
					const rect = overHeader.getBoundingClientRect();
					overHeader.classList.add("dragover");
					dragTarget = {
						kind: "g",
						id: overHeader.dataset.groupId || "",
						after: ev.clientY > rect.top + rect.height / 2
					};
					return;
				}

				// Ungrouped workspaces can also be drop targets, so a category can be dragged below a workspace
				const section = el.closest('[class*="groupSection"]');
				if (section) {
					const key = wsKey(section);
					if (state.assign[key]) return;
					const rect = section.getBoundingClientRect();
					section.classList.add("dsh-shell-drop");
					dragTarget = {
						kind: "ws",
						key: key,
						after: ev.clientY > rect.top + rect.height / 2
					};
				}
			}

			function finish() {
				document.removeEventListener("mousemove", onMove, true);
				document.removeEventListener("mouseup", finish, true);
				document.body.style.cursor = "";
				header.classList.remove("drag-source");
				clearHover();
				groupDragActive = false;
				if (!moved) return;
				suppressClickUntil = Date.now() + 400;

				const current = state.order.findIndex((item) => item.g === group.id);
				const originalIndex = current >= 0 ? current : state.order.length;
				if (current >= 0) state.order.splice(current, 1);

				if (dragTarget) {
					let targetIndex = -1;
					if (dragTarget.kind === "g") {
						targetIndex = state.order.findIndex((item) => item.g === dragTarget.id);
					} else {
						targetIndex = state.order.findIndex((item) => item.ws === dragTarget.key);
					}
					if (targetIndex >= 0) {
						state.order.splice(targetIndex + (dragTarget.after ? 1 : 0), 0, { g: group.id });
					} else {
						state.order.push({ g: group.id });
					}
					saveState();
					dragTarget = null;
					render();
					return;
				}

				// Dropped below every row (empty list area) → move to the end
				let lastBottom = 0;
				const list = listEl();
				if (list) {
					list.querySelectorAll(".dsh-shell-group, [class*='groupSection']").forEach((node) => {
						const rect = node.getBoundingClientRect();
						if (rect.bottom > lastBottom) lastBottom = rect.bottom;
					});
				}
				if (lastY > lastBottom) {
					state.order.push({ g: group.id });
					saveState();
				} else if (current < 0) {
					state.order.push({ g: group.id });
					saveState();
				} else {
					// Dropped on an invalid spot: put it back where it was
					state.order.splice(Math.min(originalIndex, state.order.length), 0, { g: group.id });
					saveState();
				}
				render();
			}

			document.addEventListener("mousemove", onMove, true);
			document.addEventListener("mouseup", finish, true);
		}

		function makeHeader(group) {
			const header = document.createElement("div");
			header.className = "dsh-shell-group" + (group.collapsed ? " collapsed" : "");
			header.dataset.groupId = group.id;

			const grip = document.createElement("span");
			grip.className = "grip";
			grip.textContent = "⠿";

			const caret = document.createElement("span");
			caret.className = "caret";
			caret.textContent = "▾";

			const dot = document.createElement("span");
			dot.className = "gdot";
			dot.title = T("colorTip");
			dot.style.background = group.color || PALETTE[0];

			const name = document.createElement("span");
			name.className = "gname";
			name.textContent = group.name;
			name.title = T("renameTip");

			const count = document.createElement("span");
			count.className = "gcount";
			const del = document.createElement("span");
			del.className = "gdel";
			del.textContent = "✕";
			del.title = T("deleteTip");

			header.append(grip, caret, dot, name, count, del);

			header.draggable = true;
			header.addEventListener("dragstart", (event) => {
				draggingGroupId = group.id;
				suppressClickUntil = Date.now() + 500;
				header.classList.add("drag-source");
				try {
					event.stopImmediatePropagation();
					event.dataTransfer.effectAllowed = "move";
					event.dataTransfer.setData("text/plain", "group:" + group.id);
				} catch (err) {}
			}, true);
			header.addEventListener("dragend", () => {
				draggingGroupId = "";
				header.classList.remove("drag-source");
				document.querySelectorAll(".dsh-shell-group.dragover, .dsh-shell-drop").forEach((n) => {
					n.classList.remove("dragover");
					n.classList.remove("dsh-shell-drop");
				});
			}, true);

			dot.addEventListener("click", (event) => {
				event.stopPropagation();
				const index = PALETTE.indexOf(group.color);
				group.color = PALETTE[(index + 1) % PALETTE.length];
				dot.style.background = group.color;
				saveState();
			});

			name.addEventListener("dblclick", (event) => {
				event.stopPropagation();
				const next = window.prompt(T("renamePrompt"), group.name);
				if (!next || !next.trim()) return;
				group.name = next.trim();
				saveState();
				render();
			});

			header.addEventListener("click", (event) => {
				if (Date.now() < suppressClickUntil) return;
				if (event.target === del) {
					if (!window.confirm(T("deleteConfirm", group.name))) return;
					state.groups = state.groups.filter((g) => g.id !== group.id);
					Object.keys(state.assign).forEach((key) => {
						if (state.assign[key] === group.id) delete state.assign[key];
					});
					saveState();
					render();
					return;
				}
				group.collapsed = !group.collapsed;
				saveState();
				render();
			});

			// Workspace dragged into a category (the drag still starts on the native row, via HTML5 dnd)
			header.addEventListener("dragover", (event) => {
				event.preventDefault();
				try { event.dataTransfer.dropEffect = "move"; } catch (err) {}
				header.classList.add("dragover");
			});
			header.addEventListener("dragleave", () => header.classList.remove("dragover"));
			header.addEventListener("drop", (event) => {
				event.preventDefault();
				header.classList.remove("dragover");
				let key = draggingKey;
				if (!key && event.dataTransfer) key = event.dataTransfer.getData("text/plain");
				draggingKey = "";
				if (!key || key.indexOf("group:") === 0) return;
				state.assign[key] = group.id;
				saveState();
				render();
			});
			return header;
		}

		function categoriesEnabled() {
			try {
				return window.localStorage.getItem(ENABLED_KEY) === "1";
			} catch (err) {
				return false;
			}
		}

		function setCategoriesEnabled(on) {
			try {
				window.localStorage.setItem(ENABLED_KEY, on ? "1" : "0");
			} catch (err) {}
		}

		// Toggle on the settings page (off by default); the DOM slot is rendered by the upstream settings page, we only append one row
		function ensureSettingsToggle() {
			const section = document.querySelector('[data-slot="settings.section"]');
			if (!section || section.querySelector(".dsh-shell-setting")) return;
			const host = section.firstElementChild || section;
			const row = document.createElement("div");
			row.className = "dsh-shell-setting";
			row.innerHTML =
				'<div><div class="dsh-shell-setting-title">' + T("settingTitle") + "</div>" +
				'<div class="dsh-shell-setting-desc">' + T("settingDesc") + "</div></div>";
			const sw = document.createElement("button");
			sw.type = "button";
			sw.className = "dsh-shell-switch";
			sw.setAttribute("role", "switch");
			sw.setAttribute("aria-checked", categoriesEnabled() ? "true" : "false");
			sw.innerHTML = "<span></span>";
			sw.addEventListener("click", () => {
				const on = !categoriesEnabled();
				setCategoriesEnabled(on);
				sw.setAttribute("aria-checked", on ? "true" : "false");
				schedule();
			});
			row.appendChild(sw);
			host.appendChild(row);
		}

		// —— Background color ——
		const TINTS = [
			{ id: "default", zh: "Default", en: "Default", light: "", dark: "" },
			{ id: "blue", zh: "Light blue", en: "Light blue", light: "#EAF3FF", dark: "#0E1B2A" },
			{ id: "green", zh: "Light green", en: "Light green", light: "#EAF7EF", dark: "#0E1F17" },
			{ id: "purple", zh: "Lavender", en: "Lavender", light: "#F3EFFF", dark: "#171227" },
			{ id: "warm", zh: "Warm sand", en: "Warm sand", light: "#FBF3E6", dark: "#221A10" },
			{ id: "gray", zh: "Soft gray", en: "Soft gray", light: "#F3F5F7", dark: "#16181B" }
		];
		const TINT_KEY = "dsh-shell-ui/tint/v1";

		function tintId() {
			try {
				return window.localStorage.getItem(TINT_KEY) || "default";
			} catch (err) {
				return "default";
			}
		}

		function setTintId(id) {
			try {
				window.localStorage.setItem(TINT_KEY, id);
			} catch (err) {}
		}

		function surfaceIsDark() {
			const candidates = [document.body, document.documentElement];
			for (const el of candidates) {
				const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/.exec(getComputedStyle(el).backgroundColor || "");
				if (!m) continue;
				const alpha = m[4] === undefined ? 1 : parseFloat(m[4]);
				if (alpha < 0.1) continue;
				return (0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3]) / 255 < 0.5;
			}
			const text = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(getComputedStyle(document.body).color || "");
			if (text) return (0.299 * +text[1] + 0.587 * +text[2] + 0.114 * +text[3]) / 255 > 0.5;
			return false;
		}

		function applyTint() {
			const tint = TINTS.find((t) => t.id === tintId()) || TINTS[0];
			const root = document.documentElement;
			const body = document.body;
			if (tint.id === "default") {
				root.removeAttribute("data-dsh-tint");
				root.style.removeProperty("--dsh-shell-tint");
				if (body) body.style.removeProperty("--dsw-alias-bg-base");
				return;
			}
			const color = surfaceIsDark() ? tint.dark : tint.light;
			root.setAttribute("data-dsh-tint", "1");
			root.style.setProperty("--dsh-shell-tint", color);
			// DSH's frame/root backgrounds both read --dsw-alias-bg-base from body, so it has to be changed here to apply everywhere
			if (body) body.style.setProperty("--dsw-alias-bg-base", color);
		}

		function ensureTintRow() {
			const section = document.querySelector('[data-slot="settings.section"]');
			if (!section || section.querySelector(".dsh-shell-tints")) return;
			const host = section.firstElementChild || section;
			const row = document.createElement("div");
			row.className = "dsh-shell-setting";
			row.innerHTML =
				'<div><div class="dsh-shell-setting-title">' + T("tintTitle") + "</div>" +
				'<div class="dsh-shell-setting-desc">' + T("tintDesc") + "</div></div>";
			const box = document.createElement("div");
			box.className = "dsh-shell-tints";
			TINTS.forEach((tint) => {
				const dot = document.createElement("button");
				dot.type = "button";
				dot.className = "dsh-shell-tint";
				dot.title = uiLang() === "zh" ? tint.zh : tint.en;
				dot.setAttribute("aria-pressed", tintId() === tint.id ? "true" : "false");
				dot.style.background = tint.light || "transparent";
				if (tint.id === "default") dot.style.background = "repeating-linear-gradient(45deg,#ddd,#ddd 3px,#fff 3px,#fff 6px)";
				dot.addEventListener("click", () => {
					setTintId(tint.id);
					box.querySelectorAll(".dsh-shell-tint").forEach((el, i) => {
						el.setAttribute("aria-pressed", TINTS[i].id === tint.id ? "true" : "false");
					});
					applyTint();
				});
				box.appendChild(dot);
			});
			row.appendChild(box);
			host.appendChild(row);
		}

		// —— First-screen copy and onboarding ——
		function ensureComposerLabels() {
			const composer = document.querySelector('[data-slot="conversation.composer"]');
			if (!composer) return;
			composer.querySelectorAll("span").forEach((el) => {
				if (el.children.length === 0 && el.textContent === "Into the Unknown") {
					el.textContent = T("labelNewSession");
				}
			});
		}

		function ensurePreviewNotice() {
			const nodes = Array.from(document.querySelectorAll("p, div, span"));
			const target = nodes.find((el) => {
				const text = el.textContent || "";
				return text.indexOf("DeepSeek Harness 0.2 is still in preview") >= 0 && text.length < 1400 && !el.querySelector("button");
			});
			if (!target || target.dataset.dshShellNotice) return;
			target.dataset.dshShellNotice = "1";
			target.textContent = T("noticeShort");
		}

		function openModelsSettings() {
			const trigger = document.querySelector('[data-slot="settings.trigger"]') || document.querySelector('[data-slot="settings.launcher"]');
			if (trigger) trigger.click();
			window.setTimeout(() => {
				const item = Array.from(document.querySelectorAll("button, a, [role='tab'], li")).find((n) => (n.textContent || "").trim() === "Models");
				if (item) item.click();
			}, 600);
		}

		function ensureOnboardingExtras() {
			const nodes = Array.from(document.querySelectorAll("div, p, span"));
			const desc = nodes.find((el) => el.children.length === 0 && /Configure the official DeepSeek provider|\u914d\u7f6e\u5b98\u65b9 DeepSeek \u63d0\u4f9b\u5546/.test(el.textContent || ""));
			if (!desc) return;
			const box = desc.closest('[role="dialog"]') || desc.parentElement;
			if (!box || box.querySelector(".dsh-shell-onboarding")) return;
			const wrap = document.createElement("div");
			wrap.className = "dsh-shell-onboarding";
			wrap.innerHTML =
				'<div class="dsh-shell-onboarding-links">' +
				'<a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener noreferrer">' + T("onboardingKey") + "</a>" +
				'<a href="https://platform.deepseek.com/top_up" target="_blank" rel="noopener noreferrer">' + T("onboardingTopup") + "</a>" +
				"</div>" +
				'<button type="button" class="dsh-shell-onboarding-other">' + T("onboardingOther") + "</button>";
			wrap.querySelector(".dsh-shell-onboarding-other").addEventListener("click", () => {
				const later = Array.from(box.querySelectorAll("button")).find((b) => /Configure later|\u7a0d\u540e\u914d\u7f6e/.test(b.textContent || ""));
				if (later) later.click();
				window.setTimeout(openModelsSettings, 500);
			});
			desc.insertAdjacentElement("afterend", wrap);
		}

		function render() {
			// Don't rebuild nodes while a drag-sort is in progress, or the row being dragged gets replaced
			if (groupDragActive) return;

			const list = listEl();
			if (!list) return;
			if (!categoriesEnabled()) {
				list.classList.remove("dsh-shell-groups");
				Array.from(list.querySelectorAll(".dsh-shell-group, .dsh-shell-newgroup")).forEach((el) => el.remove());
				sections().forEach((section) => {
					section.style.order = "";
					section.style.display = "";
				});
				ensureMobileButton();
				ensureUsageMenuItem();
				return;
			}
			list.classList.add("dsh-shell-groups");

			const secs = sections();
			Array.from(list.querySelectorAll(".dsh-shell-group")).forEach((el) => el.remove());

			const known = new Set(secs.map((s) => wsKey(s)));
			Object.keys(state.assign).forEach((key) => {
				if (!known.has(key)) delete state.assign[key];
			});

			ensureOrder(secs);

			const sectionByKey = new Map(secs.map((s) => [wsKey(s), s]));
			const membersByGroup = new Map();
			secs.forEach((s) => {
				const gid = state.assign[wsKey(s)];
				if (!gid) return;
				if (!membersByGroup.has(gid)) membersByGroup.set(gid, []);
				membersByGroup.get(gid).push(s);
			});

			let orderNum = 10;
			const visible = new Set();

			state.order.forEach((item) => {
				if (item.ws !== undefined) {
					const section = sectionByKey.get(item.ws);
					if (!section) return;
					section.style.order = String(orderNum++);
					section.style.display = "";
					visible.add(section);
					return;
				}
				const group = state.groups.find((g) => g.id === item.g);
				if (!group) return;
				if (!group.color) group.color = PALETTE[state.groups.indexOf(group) % PALETTE.length];
				const header = makeHeader(group);
				list.appendChild(header);
				header.style.order = String(orderNum++);
				const members = membersByGroup.get(group.id) || [];
				header.querySelector(".gcount").textContent = members.length ? String(members.length) : "";
				members.forEach((section) => {
					section.style.order = String(orderNum++);
					section.style.display = group.collapsed ? "none" : "";
					visible.add(section);
				});
			});

			secs.forEach((section) => {
				if (visible.has(section)) return;
				section.style.order = String(orderNum++);
				section.style.display = "";
			});

			secs.forEach((section) => {
				const head = section.firstElementChild;
				if (head && !head.dataset.dshShellDrag) {
					head.dataset.dshShellDrag = "1";
					head.draggable = true;
					head.addEventListener("dragstart", (event) => {
						draggingKey = wsKey(section);
						try {
							event.stopImmediatePropagation();
							event.dataTransfer.effectAllowed = "move";
							event.dataTransfer.setData("text/plain", draggingKey);
						} catch (err) {}
					}, true);
					head.addEventListener("dragend", () => { draggingKey = ""; }, true);
				}
				section.classList.toggle("dsh-shell-running", !!section.querySelector('[class*="_spinner"]'));
			});

			ensureDragHandlers();
			ensureMobileButton();
			ensureUsageMenuItem();
			ensureNewGroupRow(list);
		}

		// When a shared folder lacks permissions, show guidance for granting access in the TOS Control Panel (follows the UI language)
		function ensurePermissionHint() {
			document.querySelectorAll('[class*="dialog"]').forEach((dialog) => {
				const text = dialog.innerText || "";
				const isPicker = !!dialog.querySelector('button[class*="crumb"]') || text.indexOf("Select Workspace Directory") >= 0 || text.indexOf("\u9009\u62e9\u5de5\u4f5c\u533a") >= 0;
				if (!isPicker) return;
				if (!/EACCES|permission denied/i.test(text)) return;
				if (dialog.querySelector(".dsh-shell-perm-hint")) return;
				const hint = document.createElement("div");
				hint.className = "dsh-shell-perm-hint";
				hint.innerHTML = T("permHint");
				const footer = dialog.querySelector('[class*="footerBar"]');
				if (footer && footer.parentElement) {
					// Insert inside the dialog, before the footer, so it doesn't float outside the card
					footer.parentElement.insertBefore(hint, footer);
				} else {
					dialog.appendChild(hint);
				}
			});
		}

		// Add a "?" to the picker footer: hover to see the permission steps
		function ensurePickerHelp() {
			document.querySelectorAll('[class*="dialog"]').forEach((dialog) => {
				const footer = dialog.querySelector('[class*="footerBar"]');
				if (!footer) return;
				if (!dialog.querySelector('button[class*="crumb"]')) return;
				if (footer.querySelector(".dsh-shell-help")) return;
				const help = document.createElement("span");
				help.className = "dsh-shell-help";
				help.textContent = "?";
				help.title = T("permTip");
				help.setAttribute("aria-label", T("permTip"));
				const anchor = footer.querySelector('[class*="footerGap"]');
				if (anchor) footer.insertBefore(help, anchor);
				else footer.appendChild(help);
			});
		}

		// ---------- Branding: DSH for TOS (hide the upstream whale/wordmark) ----------
								const DRAGON_MARK =
			'<svg viewBox="0 0 512 512" width="100%" height="100%" aria-hidden="true">' +
			'<defs><linearGradient id="dshGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4D6BFE"/><stop offset="1" stop-color="#8FB0FF"/></linearGradient></defs>' +
			'<path d="M392 146 C420 234 388 318 310 356 C236 392 166 358 152 298 C140 242 178 196 236 190 C288 184 326 218 328 264 C330 304 302 330 270 328 C244 326 224 304 226 280 C228 258 246 244 266 246" fill="none" stroke="url(#dshGrad)" stroke-width="40" stroke-linecap="round"/>' +
			'<path d="M392 146 L458 68 L416 190 Z" fill="url(#dshGrad)"/>' +
			'</svg>';

								const DRAGON_ICON =
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">' +
			'<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4D6BFE"/><stop offset="1" stop-color="#8FB0FF"/></linearGradient></defs>' +
			'<rect x="40" y="40" width="432" height="432" rx="108" fill="#FFFFFF"/>' +
			'<path d="M392 146 C420 234 388 318 310 356 C236 392 166 358 152 298 C140 242 178 196 236 190 C288 184 326 218 328 264 C330 304 302 330 270 328 C244 326 224 304 226 280 C228 258 246 244 266 246" fill="none" stroke="url(#g)" stroke-width="40" stroke-linecap="round"/>' +
			'<path d="M392 146 L458 68 L416 190 Z" fill="url(#g)"/>' +
			'</svg>';

		function putBrand(parent, cls, html) {
			if (!parent) return;
			let el = parent.querySelector(":scope > ." + cls);
			if (!el) {
				el = document.createElement("span");
				el.className = cls;
				parent.appendChild(el);
			}
			if (el.dataset.dshBrand !== "1") {
				el.innerHTML = html;
				el.dataset.dshBrand = "1";
			}
		}

		function paintBrand() {
			const mark = document.querySelector('[data-slot="sidebar.brand.mark"]');
			const name = document.querySelector('[data-slot="sidebar.brand.name"]');
			const hero = document.querySelector('[data-slot="conversation.hero.brand.mark"]');
			putBrand(mark && mark.parentElement, "dsh-brand-mark", DRAGON_MARK);
			putBrand(name && name.parentElement, "dsh-brand-name",
				"<span>DSH for TOS</span><em>" + T("unofficial") + "</em>");
			putBrand(hero && hero.parentElement, "dsh-hero-mark", DRAGON_MARK);
			if (document.title !== "DSH for TOS") document.title = "DSH for TOS";
			const href = "data:image/svg+xml," + encodeURIComponent(DRAGON_ICON);
			document.querySelectorAll('link[rel~="icon"]').forEach((link) => {
				if (link.href !== href) link.href = href;
			});
		}

		function schedule() {
			if (timer) window.clearTimeout(timer);
			timer = window.setTimeout(() => {
				try {
					paintBrand();
					ensurePermissionHint();
					ensurePickerHelp();
					ensureSettingsToggle();
					ensureTintRow();
					applyTint();
					ensureComposerLabels();
					ensurePreviewNotice();
					ensureOnboardingExtras();
					render();
				} catch (err) {}
			}, 150);
		}

		function start() {
			installStyles();
			document.addEventListener("click", pickerGuard, true);
			observer = new MutationObserver(schedule);
			observer.observe(document.body, { subtree: true, childList: true });
			interval = window.setInterval(schedule, 2500);
			schedule();
			return () => {
				document.removeEventListener("click", pickerGuard, true);
				if (observer) observer.disconnect();
				if (interval) window.clearInterval(interval);
				if (timer) window.clearTimeout(timer);
			};
		}

		function apply(ctx) {
			ctx.effect(() => start(), "dsh-shell-ui: sidebar shell");
		}

		exports.PACKAGE = PACKAGE;
		exports.apply = apply;
		exports.inject = [];
		exports.name = PACKAGE;
		return module.exports;
	}
});

