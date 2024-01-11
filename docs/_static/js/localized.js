function local_string(id) {
  const localizationCode = window.location.pathname.split("/")[1];

  // If the localization code is not in the list of supported languages, default to English.
  // This can happen in PR previews.
  const localeDict =
    local_string.dict[localizationCode] || local_string.dict["en"];
  return localeDict[id] || "";
}

local_string.dict = {
  en: {
    COPY: "Copy",
    IN_THIS_ARTICLE: "In this article:",
    LOADING_NOTEBOOK: "Loading notebook...",
    EXPAND_NOTEBOOK: "Expand notebook",
    COLLAPSE_NOTEBOOK: "Collapse notebook",
  },
  ja: {
    COPY: "写し",
    IN_THIS_ARTICLE: "この記事の内容:",
    LOADING_NOTEBOOK: "ノートブックを読み込んでいます...",
    EXPAND_NOTEBOOK: "ノートを展開する",
    COLLAPSE_NOTEBOOK: "ノートを折りたたむ",
  },
  pt: {
    COPY: "Cópia de",
    IN_THIS_ARTICLE: "Neste artigo:",
    LOADING_NOTEBOOK: "Carregando caderno...",
    EXPAND_NOTEBOOK: "Expandir caderno",
    COLLAPSE_NOTEBOOK: "Recolher caderno",
  },
};
