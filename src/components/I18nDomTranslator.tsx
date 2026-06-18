import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const originalText = new WeakMap<Text, string>();
const translatedAttributes = ["placeholder", "title", "aria-label"] as const;
const originalAttributeKeys: Record<(typeof translatedAttributes)[number], string> = {
  placeholder: "i18nOriginalPlaceholder",
  title: "i18nOriginalTitle",
  "aria-label": "i18nOriginalAriaLabel",
};

function clean(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function stripDecorations(value: string) {
  return clean(
    value
      .replace(/[←→✨♡⭐✓✕+−]/g, "")
      .replace(/[🛒🗑✅❌📋🚚💵🔍📦📧📞📍⏰🗺️🔐🔒]/g, ""),
  );
}

function translateWithFallback(t: (key: string) => string, value: string) {
  const normalized = clean(value);
  if (!normalized) return value;

  const decorated = stripDecorations(normalized);
  const candidates = [normalized, decorated];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const exact = t(candidate);
    if (exact !== candidate) return value.replace(normalized, exact);
  }

  if (normalized.startsWith("By ")) {
    return value.replace("By ", "بواسطة ");
  }

  if (normalized.startsWith("by ")) {
    return value.replace("by ", "بواسطة ");
  }

  if (normalized.startsWith("Category: ")) {
    return value.replace("Category: ", "التصنيف: ");
  }

  if (normalized.startsWith("Phone: ")) {
    return value.replace("Phone: ", "الهاتف: ");
  }

  if (normalized.startsWith("Email: ")) {
    return value.replace("Email: ", "البريد الإلكتروني: ");
  }

  const foundMatch = normalized.match(/^Found (\d+) results? for "(.+)"$/);
  if (foundMatch) {
    return `تم العثور على ${foundMatch[1]} نتيجة عن "${foundMatch[2]}"`;
  }

  const addFreeShippingMatch = normalized.match(/^Add (.+) EGP for free shipping$/);
  if (addFreeShippingMatch) {
    return `أضيفي ${addFreeShippingMatch[1]} جنيه للحصول على شحن مجاني`;
  }

  const stockMatch = normalized.match(/^(\d+) in stock$/);
  if (stockMatch) {
    return `${stockMatch[1]} متوفر`;
  }

  const itemsMatch = normalized.match(/^(\d+)\+? items$/);
  if (itemsMatch) {
    return `${itemsMatch[1]}+ عنصر`;
  }

  const relatedMatch = normalized.match(/^Related in (.+)$/);
  if (relatedMatch) {
    return `مرتبط بتصنيف ${relatedMatch[1]}`;
  }

  const logoutMatch = normalized.match(/^Logout \((.+)\)$/);
  if (logoutMatch) {
    return `تسجيل الخروج (${logoutMatch[1]})`;
  }

  const materialFavouriteMatch = normalized.match(/^Favourite (.+)$/);
  if (materialFavouriteMatch) {
    return `إضافة ${materialFavouriteMatch[1]} للمفضلة`;
  }

  return value
    .replace(/\bEGP\b/g, "جنيه")
    .replace(/\bProducts\b/g, "منتجات")
    .replace(/\bProduct\b/g, "منتج")
    .replace(/\bMaterials\b/g, "خامات")
    .replace(/\bMaterial\b/g, "خامة")
    .replace(/\bReviews\b/g, "تقييمات")
    .replace(/\breviews\b/g, "تقييمات")
    .replace(/\bRating\b/g, "تقييم")
    .replace(/\bFree\b/g, "مجاني")
    .replace(/\bTotal\b/g, "الإجمالي")
    .replace(/\bAdded!\b/g, "تمت الإضافة!")
    .replace(/\bAdded to Cart!\b/g, "تمت الإضافة للسلة!");
}

function shouldSkip(node: Node) {
  const parent = node.parentElement;
  if (!parent) return true;
  return Boolean(parent.closest("script, style, svg, code, pre, textarea"));
}

function translateTree(root: ParentNode, language: string, t: (key: string) => string) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    if (!shouldSkip(node) && clean(node.nodeValue || "")) {
      textNodes.push(node);
    }
  }

  textNodes.forEach((node) => {
    if (!originalText.has(node)) {
      originalText.set(node, node.nodeValue || "");
    }
    const original = originalText.get(node) || "";
    const nextValue = language === "ar" ? translateWithFallback(t, original) : original;
    if (node.nodeValue !== nextValue) {
      node.nodeValue = nextValue;
    }
  });

  document.querySelectorAll<HTMLElement>("[placeholder], [title], [aria-label]").forEach((element) => {
    translatedAttributes.forEach((attribute) => {
      const originalKey = originalAttributeKeys[attribute];
      const current = element.getAttribute(attribute);
      if (!current) return;

      const dataset = element.dataset as Record<string, string | undefined>;
      if (!dataset[originalKey]) {
        dataset[originalKey] = current;
      }

      const original = dataset[originalKey] || current;
      const nextValue = language === "ar" ? translateWithFallback(t, original) : original;
      if (element.getAttribute(attribute) !== nextValue) {
        element.setAttribute(attribute, nextValue);
      }
    });
  });
}

export function I18nDomTranslator() {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const applyLanguage = () => {
      const language = i18n.language === "ar" ? "ar" : "en";
      document.documentElement.lang = language;
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
      translateTree(document.body, language, t);
    };

    applyLanguage();
    const observer = new MutationObserver(applyLanguage);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label"],
    });

    i18n.on("languageChanged", applyLanguage);

    return () => {
      observer.disconnect();
      i18n.off("languageChanged", applyLanguage);
    };
  }, [i18n, t]);

  return null;
}
