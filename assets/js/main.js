/* ==========================================================================
   South of Somewhere — behaviour (no dependencies)
   Deliberately small: nav, showreel, film hover previews, lightbox, offers
   sub-nav, contact form. The native cursor and native scrolling are never touched.
   ========================================================================== */
(function () {
  "use strict";

  var STUDIO_EMAIL = "admin@southofsomewhere.studio";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  document.documentElement.classList.remove("no-js");

  /* ---------- Header + mobile nav ---------- */
  var header = $(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  var toggle = $(".nav-toggle"), links = $(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("is-open")) {
        links.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); toggle.focus();
      }
    });
  }
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Showreel: plays only while visible; still frame if motion is reduced ---------- */
  var reel = $(".showreel video");
  if (reel) {
    reel.muted = true;
    if (reduce) { reel.removeAttribute("autoplay"); reel.pause(); }
    else if ("IntersectionObserver" in window) {
      var visible = true;
      var sync = function () {
        if (visible && !document.hidden) { var p = reel.play(); if (p && p.catch) p.catch(function () {}); }
        else reel.pause();
      };
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; sync(); }, { threshold: .15 }).observe(reel);
      document.addEventListener("visibilitychange", sync);
    }
  }

  /* ---------- Hover previews: short muted loops, mouse only ----------
     Add data-preview="assets/video/x-loop.mp4" to any .thumb. No file, no preview. */
  if (finePointer && !reduce) {
    $$(".thumb[data-preview]").forEach(function (t) {
      var src = t.getAttribute("data-preview"); if (!src) return;
      var v = null;
      t.addEventListener("pointerenter", function () {
        if (!v) {
          v = document.createElement("video");
          v.className = "preview"; v.muted = true; v.loop = true; v.playsInline = true; v.preload = "auto"; v.src = src;
          t.insertBefore(v, t.querySelector(".play"));
        }
        var p = v.play(); if (p && p.catch) p.catch(function () {});
        t.classList.add("is-previewing");
      });
      t.addEventListener("pointerleave", function () { t.classList.remove("is-previewing"); if (v) v.pause(); });
    });
  }

  /* ---------- Lightbox ----------
     data-video: a file (assets/video/x.mp4), a YouTube link or a Vimeo link.
     data-ratio: the film's shape, e.g. "16 / 9" or "9 / 16", so it is never cropped. */
  var modal = $("#video-modal");
  if (modal) {
    var stage = $(".modal-stage", modal), titleEl = $(".modal-title", modal), countEl = $(".count", modal);
    var list = [], current = 0, opener = null;
    var embed = function (url) {
      var yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
      if (yt) return "https://www.youtube-nocookie.com/embed/" + yt[1] + "?autoplay=1&rel=0";
      var vm = url.match(/vimeo\.com\/(\d+)/);
      return vm ? "https://player.vimeo.com/video/" + vm[1] + "?autoplay=1" : null;
    };
    var ratioOf = function (t) {
      var r = (t.getAttribute("data-ratio") || "16 / 9").split("/");
      var n = parseFloat(r[0]) / parseFloat(r[1]);
      return { css: r.join(" / "), n: isFinite(n) && n > 0 ? n : 16 / 9 };
    };
    var message = function (text) {
      var m = document.createElement("p"); m.className = "modal-msg"; m.textContent = text; stage.appendChild(m);
    };
    var load = function (i) {
      current = (i + list.length) % list.length;
      var t = list[current], src = t.getAttribute("data-video"), title = t.getAttribute("data-title") || "", ar = ratioOf(t);
      stage.innerHTML = "";
      stage.style.setProperty("--ar", ar.css);
      modal.style.setProperty("--mw", Math.round(Math.min(1100, window.innerWidth * .92, window.innerHeight * .78 * ar.n)) + "px");
      if (!src) { message("This film is being finished. Check back soon."); }
      else if (embed(src)) {
        var f = document.createElement("iframe"); f.src = embed(src); f.title = title; f.allow = "autoplay; fullscreen; picture-in-picture"; f.allowFullscreen = true; stage.appendChild(f);
      } else {
        var v = document.createElement("video"); v.src = src; v.controls = true; v.autoplay = true; v.playsInline = true;
        v.addEventListener("error", function () { stage.innerHTML = ""; message("This film can't be played right now."); });
        stage.appendChild(v);
      }
      titleEl.textContent = title;
      countEl.textContent = list.length > 1 ? (current + 1) + " / " + list.length : "";
    };
    var thumbs = $$(".thumb[data-video]");
    var openAt = function (t) {
      opener = t;
      list = thumbs;
      $(".modal-nav", modal).hidden = list.length < 2;
      load(Math.max(0, list.indexOf(t)));
      modal.showModal();
    };
    thumbs.forEach(function (t) { t.addEventListener("click", function (e) { e.preventDefault(); openAt(t); }); });
    $$("[data-open-film]").forEach(function (b) {
      b.addEventListener("click", function () { var t = $(".thumb", b.closest(".film")); if (t) openAt(t); });
    });
    $(".modal-close", modal).addEventListener("click", function () { modal.close(); });
    $(".prev", modal).addEventListener("click", function () { load(current - 1); });
    $(".next", modal).addEventListener("click", function () { load(current + 1); });
    modal.addEventListener("click", function (e) { if (e.target === modal) modal.close(); });
    modal.addEventListener("close", function () { stage.innerHTML = ""; if (opener) opener.focus(); });
    modal.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") load(current - 1);
      if (e.key === "ArrowRight") load(current + 1);
    });
  }

  /* ---------- Offers: sub-nav follows you ---------- */
  var subLinks = $$(".subnav a");
  if (subLinks.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) subLinks.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    subLinks.forEach(function (a) { var s = $(a.getAttribute("href")); if (s) spy.observe(s); });
  }

  /* ---------- Contact form ---------- */
  var form = $("#inquiry-form");
  if (form) {
    var status = $(".form-status", form), submit = $('button[type="submit"]', form), hint = $("#brief-hint", form);
    var prompts = {
      "creative-systems": "Tell us about the brand or story, what feels unfinished, and where you'd like it to be in a year.",
      "social-first": "Which platforms, who's the audience, and is this a single campaign or an ongoing series?",
      "product-at-scale": "Roughly how many products, which channels (store, marketplace, ads), and how often do you need fresh content?",
      "other": "Tell us what you have in mind. A few lines is plenty to start."
    };
    var setPrompt = function () {
      var c = $('input[name="project_type"]:checked', form);
      if (c && hint) hint.textContent = prompts[c.getAttribute("data-key")] || "";
    };
    var wanted = new URLSearchParams(window.location.search).get("type");
    if (wanted) { var pre = $('input[name="project_type"][data-key="' + wanted + '"]', form); if (pre) pre.checked = true; }
    $$('input[name="project_type"]', form).forEach(function (r) { r.addEventListener("change", setPrompt); });
    setPrompt();

    var say = function (msg, err) { status.textContent = msg; status.classList.toggle("is-error", !!err); };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var data = new FormData(form);
      if (data.get("_gotcha")) return;
      var endpoint = form.getAttribute("data-endpoint") || "";
      var toMail = function () {
        var lines = [];
        ["name", "email", "company", "project_type", "budget", "timeline"].forEach(function (k) { if (data.get(k)) lines.push(k.replace("_", " ") + ": " + data.get(k)); });
        window.location.href = "mailto:" + STUDIO_EMAIL + "?subject=" + encodeURIComponent("Project inquiry from " + data.get("name")) + "&body=" + encodeURIComponent(lines.join("\n") + "\n\n" + data.get("brief"));
        say("Opening your email app with your inquiry ready to send.");
      };
      if (!endpoint || endpoint.indexOf("YOUR_FORM_ID") !== -1) { toMail(); return; }
      submit.disabled = true; say("Sending…");
      fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (r) { if (!r.ok) throw new Error("bad"); form.reset(); setPrompt(); say("Thank you. We'll reply within 1–2 business days."); })
        .catch(function () { say("That didn't send. Please try again, or email " + STUDIO_EMAIL + " directly.", true); })
        .then(function () { submit.disabled = false; });
    });
  }
})();
